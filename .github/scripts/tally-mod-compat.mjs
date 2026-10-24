// Ported from CoopKeep (https://github.com/Aderimo/bannerlord-coopkeep),
// .github/scripts/tally-mod-compat.mjs, translated from Turkish and changed for the Coodsz tools.
// MIT License, Copyright (c) 2026 aderimo. The full notice is in THIRD-PARTY-NOTICES.md.
//
// Counts the "mod-compat" issues from scratch and updates the works/broken counts and the
// statuses in compat-list/mods.json.
//
// Two kinds of report count: the GitHub issue form (one person = one GitHub login) and the
// anonymous reports the tools send through server/mod-reports-worker (label "mod-report"; one
// person = the "Reporter" hash the worker writes). Those arrive with the label "pending" and
// count only after Coodsz removes it. They carry the player's mod list, which gives each entry
// "testedWith" (mods often in the lists of players who said it works), "conflicts" (mods in the
// broken lists that no works list had) and "needs" (the mods players said it works only with).
// TAOM reports (label "taom") are not counted here; tally-taom-compat.mjs counts them in the
// Coodsz-TAOM repository, where the worker files them. AD1259 reports (label "ad1259") are left
// out too; the same script counts them in Coodsz-AD1259 (tally-taom-compat.mjs --list ad1259).
// Both kinds only sit here from before the worker filed them in their own repository.
//
// Next to the counts each entry gets "clientOnly" (players who said it only needs to be on the
// players' PCs; it never changes the status) and "lastReport" (the day of the newest counted
// report), only when there are any. The tools skip both (System.Text.Json ignores unknown fields).
//
// It also writes MODS.md, the readable page of the whole list (renderModsPage), in the root of
// Coodsz-Coop-and-Friends, where the tools' Full mod list link opens it.
//
// Every run counts all open and closed reports again; running twice on the same input
// gives the same file (idempotent).
//
// Usage:
//   node tally-mod-compat.mjs [--file compat-list/mods.json] [--page MODS.md] [--records compat-list/compat-records.json] [--issues fixture.json] [--dry-run]
//   node tally-mod-compat.mjs --page-only [--file ...] [--page ...]   (only writes MODS.md from the file as it is)
//
// --records also writes the approved results as ModderLords compat records (compat-records.mjs).
//
// Without --issues the issues come from the GitHub API (needs the GITHUB_TOKEN and
// GITHUB_REPOSITORY environment variables). No dependencies; Node 18+.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildRecords, readRecords, writeRecords } from './compat-records.mjs';

export const LABEL = 'mod-compat';
export const IGNORED_LABELS = ['invalid', 'spam', 'pending'];
// Set by the report worker only (no issue form adds it), so its Reporter line can be trusted.
export const REPORT_LABEL = 'mod-report';
export const TAOM_LABEL = 'taom';
// AD1259 client reports: counted in Coodsz-AD1259 against the fixed pack, never here.
export const AD1259_LABEL = 'ad1259';
// A mod counts as "broken together with" this one once it was in this many broken reports and in no works report.
export const CONFLICT_MIN = 2;
// "testedWith", "conflicts" and "needs" keep at most this many ids.
export const LIST_MAX = 5;
// Mods almost every list has; they say nothing about which mod works with which.
export const COMMON_MODS = ['bannerlord.harmony', 'bannerlord.butterlib', 'bannerlord.uiextenderex', 'bannerlord.mboptionscreen', 'coop', 'coopnightly'];
// The status changes on its own once works - broken reaches this difference.
export const THRESHOLD = 3;

const KEY_ORDER = ['id', 'name', 'status', 'coop', 'note', 'workshop', 'nexus', 'category', 'works', 'broken', 'clientOnly', 'lastReport', 'testedWith', 'conflicts', 'needs', 'idGuess'];
const ID_PATTERN = /^[\p{L}\p{N}_.\-' ()+&!:]{1,100}$/u;

// ---- JSONC ---------------------------------------------------------------

/** Removes // and /* *\/ comments and trailing commas without touching strings. */
export function stripJsonc(text) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"') {
      let j = i + 1;
      while (j < text.length && text[j] !== '"') j += text[j] === '\\' ? 2 : 1;
      out += text.slice(i, j + 1);
      i = j;
    } else if (c === '/' && n === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      out += '\n';
    } else if (c === '/' && n === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end < 0 ? text.length : end + 1;
    } else {
      out += c;
    }
  }
  return out.replace(/,(\s*[\]}])/g, '$1');
}

export function parseJsonc(text) {
  return JSON.parse(stripJsonc(text));
}

function formatEntry(e) {
  const keys = [...KEY_ORDER.filter(k => k in e), ...Object.keys(e).filter(k => !KEY_ORDER.includes(k))];
  return '{ ' + keys.filter(k => e[k] !== undefined && e[k] !== null).map(k => `${JSON.stringify(k)}: ${JSON.stringify(e[k])}`).join(', ') + ' }';
}

export function sortMods(mods) {
  const label = m => (m.name ?? m.id);
  return mods.sort((a, b) => label(a).localeCompare(label(b), 'en', { sensitivity: 'base' }) || a.id.localeCompare(b.id));
}

/**
 * Keeps the file as it is up to the "mods" array (the comment block on top included) and
 * writes the array again, one entry per line.
 */
export function serialize(originalText, mods) {
  const m = originalText.match(/^([\s\S]*?"mods"\s*:\s*\[)/m);
  if (!m) throw new Error('the "mods" array was not found');
  const nl = originalText.includes('\r\n') ? '\r\n' : '\n';
  const body = mods.map(formatEntry).map(s => '    ' + s).join(',' + nl);
  return m[1] + nl + body + nl + '  ]' + nl + '}' + nl;
}

// ---- Issue form ---------------------------------------------------------

/** Splits an issue form body into its "### Heading" sections. */
export function parseForm(body) {
  const fields = {};
  const parts = String(body ?? '').replace(/\r\n/g, '\n').split(/^###[ \t]+/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const header = (nl < 0 ? part : part.slice(0, nl)).trim().toLowerCase();
    let value = (nl < 0 ? '' : part.slice(nl + 1)).trim();
    if (value === '_No response_') value = '';
    value = value.replace(/^```\w*\n?|\n?```$/g, '').replace(/^`+|`+$/g, '').trim();
    if (header.startsWith('mod id')) fields.modId = value.split('\n')[0].trim();
    else if (header.startsWith('mod name')) fields.modName = value.split('\n')[0].trim();
    else if (header.startsWith('mod version')) fields.version = value.split('\n')[0].trim();
    else if (header.startsWith('result')) fields.result = value;
    else if (header.startsWith('coop version')) fields.coop = value.split('\n')[0].trim();
    else if (header.startsWith('works only with')) fields.with = value.split('\n')[0].trim();
    else if (header.startsWith('reporter')) fields.reporter = value.split('\n')[0].trim();
    else if (header.startsWith('mod list')) fields.mods = value.split('\n').map(line => line.split('|')[0].trim()).filter(id => ID_PATTERN.test(id));
  }
  return fields;
}

export function normalizeResult(value) {
  const v = String(value ?? '').toLowerCase().replace(/[^a-zçğıöşü]/g, '');
  // English, plus the Turkish words CoopKeep's form used.
  if (['works', 'work', 'working', 'yes', 'çalışıyor', 'calisiyor'].includes(v)) return 'works';
  if (['broken', 'broke', 'notworking', 'no', 'crash', 'çalışmıyor', 'calismiyor'].includes(v)) return 'broken';
  if (['workswith', 'worksonlywith'].includes(v)) return 'workswith';
  if (['clientonly', 'client', 'yalnızcaoyuncularda'].includes(v)) return 'clientonly';
  return null;
}

// ---- Counting -----------------------------------------------------------

/**
 * The reports that count: only the latest one per person and mod. Reports labelled
 * invalid or spam, pull requests, bots and reports that cannot be read are skipped. leaveOut are
 * the tool labels this list does not count: TAOM and AD1259 here, only the other one in the TAOM
 * and AD1259 tallies (tally-taom-compat.mjs), where every report is of that tool.
 */
export function collectReports(issues, { leaveOut = [TAOM_LABEL, AD1259_LABEL] } = {}) {
  const latest = new Map();
  const skipped = [];
  for (const issue of issues) {
    const labels = (issue.labels ?? []).map(l => (typeof l === 'string' ? l : l.name).toLowerCase());
    if (issue.pull_request || !labels.includes(LABEL)) continue;
    if (labels.some(l => IGNORED_LABELS.includes(l))) { skipped.push([issue.number, labels.includes('pending') ? 'pending' : 'invalid/spam']); continue; }
    if (leaveOut.includes(TAOM_LABEL) && labels.includes(TAOM_LABEL)) { skipped.push([issue.number, 'TAOM report']); continue; }
    if (leaveOut.includes(AD1259_LABEL) && labels.includes(AD1259_LABEL)) { skipped.push([issue.number, 'AD1259 report']); continue; }
    const anonymous = labels.includes(REPORT_LABEL);
    if (issue.user?.type === 'Bot' && !anonymous) { skipped.push([issue.number, 'bot']); continue; }
    const f = parseForm(issue.body);
    const result = normalizeResult(f.result);
    if (!f.modId || !ID_PATTERN.test(f.modId)) { skipped.push([issue.number, 'mod id could not be read']); continue; }
    if (!result) { skipped.push([issue.number, 'result could not be read']); continue; }
    let user = (issue.user?.login ?? `#${issue.number}`).toLowerCase();
    if (anonymous) {
      if (!/^anon-[0-9a-f]{8,64}$/.test(f.reporter ?? '')) { skipped.push([issue.number, 'reporter could not be read']); continue; }
      user = f.reporter;
    }
    const key = `${user}|${f.modId.toLowerCase()}`;
    const report = {
      number: issue.number, user, modId: f.modId, modName: ID_PATTERN.test(f.modName ?? '') ? f.modName : null, result,
      with: result === 'workswith' && ID_PATTERN.test(f.with ?? '') ? f.with : null,
      mods: f.mods ?? [],
      version: f.version ?? '',
      coop: f.coop ?? '',
      // The newest report wins by when it was filed. A changed vote edits the same issue (one issue
      // per player, mod and version), so its body is already the latest vote. updated_at is not used:
      // approving an old issue (removing pending) bumps it and would beat a newer vote.
      created: issue.created_at ?? '',
    };
    const prev = latest.get(key);
    if (!prev || report.created > prev.created || (report.created === prev.created && report.number > prev.number)) latest.set(key, report);
  }
  return { reports: [...latest.values()].sort((a, b) => a.number - b.number), skipped };
}

/** Hand kept entries (the ones with "coop") never change status on their own. */
export const isManual = e => typeof e.coop === 'string' && e.coop.trim() !== '';

export function applyTally(mods, reports) {
  const byId = new Map(mods.map(m => [m.id.toLowerCase(), m]));
  const counts = new Map();
  const added = [], renamed = [];
  // The counted reports of each entry, for the compat records export (compat-records.mjs).
  const reportsByEntry = new Map();

  for (const r of reports) {
    let entry = byId.get(r.modId.toLowerCase());
    if (!entry && r.modName) {
      // An entry whose id is a guess gets the real id from the first report that carries it.
      entry = mods.find(m => m.idGuess && (m.name ?? m.id).toLowerCase() === r.modName.toLowerCase());
      if (entry) {
        renamed.push([entry.id, r.modId]);
        byId.delete(entry.id.toLowerCase());
        entry.id = r.modId;
        delete entry.idGuess;
        byId.set(entry.id.toLowerCase(), entry);
      }
    }
    if (!entry) {
      entry = { id: r.modId, name: r.modName ?? r.modId, status: 'Unknown', works: 0, broken: 0 };
      mods.push(entry);
      byId.set(entry.id.toLowerCase(), entry);
      added.push(entry.id);
    }
    const c = counts.get(entry) ?? { works: 0, broken: 0, clientonly: 0, lastReport: '', worksLists: [], brokenLists: [], needs: [] };
    if (r.result === 'workswith') {
      c.works++;
      if (r.with) c.needs.push(r.with);
    } else {
      c[r.result]++;
    }
    const day = String(r.created ?? '').slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && day > c.lastReport) c.lastReport = day;
    const others = otherMods(r.mods, entry.id);
    if (others.length && (r.result === 'works' || r.result === 'workswith')) c.worksLists.push(others);
    if (others.length && r.result === 'broken') c.brokenLists.push(others);
    counts.set(entry, c);
    reportsByEntry.set(entry, [...(reportsByEntry.get(entry) ?? []), r]);
  }

  const statusChanges = [];
  for (const m of mods) {
    const c = counts.get(m) ?? { works: 0, broken: 0, clientonly: 0, lastReport: '', worksLists: [], brokenLists: [], needs: [] };
    m.works = c.works;
    m.broken = c.broken;
    if (c.clientonly) m.clientOnly = c.clientonly;
    else delete m.clientOnly;
    if (c.lastReport) m.lastReport = c.lastReport;
    else delete m.lastReport;
    m.status ??= 'Unknown';
    setList(m, 'testedWith', topIds(c.worksLists.flat()));
    const inWorks = new Set(c.worksLists.flat().map(id => id.toLowerCase()));
    const conflicts = c.works > 0 ? topIds(c.brokenLists.flat(), CONFLICT_MIN, inWorks) : [];
    setList(m, 'conflicts', conflicts);
    setList(m, 'needs', topIds(c.needs));
    if (isManual(m)) continue;
    let next = m.status;
    if (m.works - m.broken >= THRESHOLD) next = 'Works';
    else if (m.broken - m.works >= THRESHOLD) next = 'Broken';
    if (next !== m.status) { statusChanges.push([m.id, m.status, next]); m.status = next; }
  }
  sortMods(mods);
  return { added, renamed, statusChanges, reportsByEntry };
}

/** The ids of a report's mod list without the mod itself and the mods every list has, once each. */
export function otherMods(mods, selfId) {
  const self = selfId.toLowerCase();
  const seen = new Set();
  const out = [];
  for (const id of mods ?? []) {
    const key = id.toLowerCase();
    if (key === self || COMMON_MODS.includes(key) || key.startsWith('dedicatedserver.') || seen.has(key)) continue;
    seen.add(key);
    out.push(id);
  }
  return out;
}

/** The ids seen at least min times and not in skip, most often first (ties by id), at most LIST_MAX. */
export function topIds(ids, min = 1, skip = new Set()) {
  const counts = new Map();
  for (const id of ids) {
    const key = id.toLowerCase();
    if (skip.has(key)) continue;
    const c = counts.get(key) ?? { id, n: 0 };
    c.n++;
    counts.set(key, c);
  }
  return [...counts.values()]
    .filter(c => c.n >= min)
    .sort((a, b) => b.n - a.n || a.id.localeCompare(b.id, 'en', { sensitivity: 'base' }))
    .slice(0, LIST_MAX)
    .map(c => c.id);
}

function setList(entry, key, ids) {
  if (ids.length) entry[key] = ids;
  else delete entry[key];
}

// ---- MODS.md ------------------------------------------------------------
// The readable page of the list. mdCell, mdModLink, countsText and writeIfChanged are shared with
// the TAOM and AD1259 pages (tally-taom-compat.mjs).

export const REPORT_FORM_URL = 'https://github.com/Coodsz/Coodsz-Coop-and-Friends/issues/new?template=mod-compat.yml';
export const NOT_CHECKED = 'Not checked yet';
// The prefix of a hand kept Works note for a mod that runs with the fixes the note gives.
const WITH_ISSUES = 'works with issues.';

// The plain words for each status, in the order MODS.md lists them.
export const COOP_STATUS = ['Works', 'Works with issues', 'Client only', 'Reported working', 'Reported broken', 'Broken', NOT_CHECKED];

/**
 * Text for a table cell: no line breaks, no pipes, no HTML, and no links GitHub would make on its
 * own. A reported id or name like "www.some-site.example" would otherwise turn into a link (GFM
 * autolinks www. and scheme://), so the dot after www and the slashes after a scheme are escaped;
 * the page still shows the text as it is.
 */
export function mdCell(text) {
  return String(text ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').replace(/</g, '&lt;')
    .replace(/\b(www)\./gi, '$1\\.').replace(/:\/\//g, ':\\/\\/').trim();
}

/** The mod's name, linked to its Steam Workshop page, else its Nexus Mods page. */
export function mdModLink(name, workshopId, nexusId) {
  const text = mdCell(name).replace(/([[\]])/g, '\\$1');
  const workshop = String(workshopId ?? '').trim(), nexus = String(nexusId ?? '').trim();
  if (/^\d{1,20}$/.test(workshop)) return `[${text}](https://steamcommunity.com/sharedfiles/filedetails/?id=${workshop})`;
  if (/^\d{1,10}$/.test(nexus)) return `[${text}](https://www.nexusmods.com/mountandblade2bannerlord/mods/${nexus})`;
  return text;
}

/** "3 works, 1 broken, 2 client only" (client only only when there are any). */
export function countsText(works, broken, clientOnly) {
  const parts = [`${works ?? 0} works`, `${broken ?? 0} broken`];
  if (clientOnly) parts.push(`${clientOnly} client only`);
  return parts.join(', ');
}

/** The status words of an entry. A hand kept one ("coop") was checked by Coodsz; the others come from the player counts. */
export function coopStatusText(e) {
  const status = String(e.status ?? '').trim().toLowerCase();
  if (status === 'clientonly') return 'Client only';
  if (status === 'works') {
    if (!isManual(e)) return 'Reported working';
    return String(e.note ?? '').trim().toLowerCase().startsWith(WITH_ISSUES) ? 'Works with issues' : 'Works';
  }
  if (status === 'broken') return isManual(e) ? 'Broken' : 'Reported broken';
  return NOT_CHECKED;
}

/** The Players cell: empty when nobody reported it. */
export function coopPlayersCell(e) {
  return (e.works ?? 0) + (e.broken ?? 0) + (e.clientOnly ?? 0) > 0 ? countsText(e.works, e.broken, e.clientOnly) : '';
}

/** The whole MODS.md page from the list. Only depends on the list, so it is the same every run. */
export function renderModsPage(doc) {
  const rows = (doc.mods ?? [])
    .map(e => ({ e, status: coopStatusText(e) }))
    .sort((a, b) => COOP_STATUS.indexOf(a.status) - COOP_STATUS.indexOf(b.status)
      || (a.e.name || a.e.id).localeCompare(b.e.name || b.e.id, 'en', { sensitivity: 'base' }) || a.e.id.localeCompare(b.e.id));
  const day = e => (/^\d{4}-\d{2}-\d{2}$/.test(e.lastReport ?? '') ? e.lastReport : '');
  const out = [
    '# Coop and Friends mod list',
    '',
    'Which mods work with Bannerlord Coop. This page is made from',
    '[compat-list/mods.json](compat-list/mods.json), the list Coodsz Coop and Friends and Coodsz Host show,',
    'and is written again on its own whenever a player report is counted.',
    '',
    '## What the statuses mean',
    '',
    '- **Works**: checked in Coop by Coodsz. The Coop version it was checked with is in the Checked with Coop column.',
    '- **Works with issues**: checked by Coodsz, it runs with the fixes the note gives.',
    '- **Client only**: only needs to be on the players\' PCs (looks, interface). The server keeps it with its code off.',
    `- **Reported working**: not checked by Coodsz, but at least ${THRESHOLD} more players said it works than said it is broken.`,
    `- **Reported broken**: not checked by Coodsz, but at least ${THRESHOLD} more players said it is broken than said it works.`,
    '- **Broken**: known to break Coop or to stop players from joining. Leave it off.',
    `- **${NOT_CHECKED}**: nobody checked it yet, or the player reports do not agree yet.`,
    '',
    'A status Coodsz set by hand never changes on its own; player reports show in the Players column.',
    '**Players** counts the players who reported it works, is broken or is client only. **Last report** is',
    'the day of the newest counted report.',
    '',
    '## How to report a mod',
    '',
    'Click **Report a mod** at the top of Coodsz Coop and Friends (or **Report** on the bar after a game)',
    'and pick Works or Broken for each mod. No GitHub account is needed. A report counts here about a',
    'day later.',
    `With a GitHub account you can also use the [report form](${REPORT_FORM_URL}).`,
    '',
    '| Mod | Status | Players | Last report | Checked with Coop | Note |',
    '| --- | --- | --- | --- | --- | --- |',
    ...rows.map(({ e, status }) =>
      `| ${mdModLink(e.name || e.id, e.workshop, e.nexus)} | ${status} | ${coopPlayersCell(e)} | ${day(e)} | ${isManual(e) ? mdCell(e.coop) : ''} | ${mdCell(e.note)} |`),
    '',
    `${rows.length} mods.`,
    '',
  ];
  return out.join('\n');
}

/** Writes the file only when its text changed; true when it did (or would, in a dry run). */
export function writeIfChanged(file, text, dryRun) {
  const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (before === text) return false;
  if (!dryRun) fs.writeFileSync(file, text);
  return true;
}

// ---- GitHub -------------------------------------------------------------

export async function fetchIssues(repo, token) {
  const all = [];
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/repos/${repo}/issues?labels=${LABEL}&state=all&per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) return all;
  }
}

// ---- Entry point --------------------------------------------------------

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const file = arg('--file') ?? 'compat-list/mods.json';
  const page = arg('--page') ?? 'MODS.md';
  const fixture = arg('--issues');
  const dryRun = process.argv.includes('--dry-run');
  const recordsFile = arg('--records');

  const original = fs.readFileSync(file, 'utf8');
  const doc = parseJsonc(original);
  if (!Array.isArray(doc.mods)) throw new Error(`${file} has no "mods" array`);
  let changed = false;
  if (!process.argv.includes('--page-only')) changed = await tally(file, original, doc, { fixture, dryRun, recordsFile });

  const pageChanged = writeIfChanged(page, renderModsPage(doc), dryRun);
  console.log(pageChanged ? `Changed ${page}${dryRun ? ' (dry run)' : ''}.` : `${page} is up to date.`);
  changed = changed || (pageChanged && !dryRun);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
}

/** Counts the reports into doc and writes the list (and the records); true when a file changed. */
async function tally(file, original, doc, { fixture, dryRun, recordsFile }) {
  let issues;
  if (fixture) {
    issues = JSON.parse(fs.readFileSync(fixture, 'utf8'));
  } else {
    const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repo } = process.env;
    if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are needed (or --issues <fixture.json>)');
    issues = await fetchIssues(repo, token);
  }

  const { reports, skipped } = collectReports(issues);
  const { added, renamed, statusChanges, reportsByEntry } = applyTally(doc.mods, reports);
  const text = serialize(original, doc.mods);
  parseJsonc(text); // make sure the result is valid before writing it

  console.log(`issues: ${issues.length}, reports counted: ${reports.length}, skipped: ${skipped.length}, entries: ${doc.mods.length}`);
  for (const [n, why] of skipped) console.log(`  skipped #${n}: ${why}`);
  for (const id of added) console.log(`  new entry: ${id}`);
  for (const [from, to] of renamed) console.log(`  id fixed: ${from} -> ${to}`);
  for (const [id, from, to] of statusChanges) console.log(`  status: ${id} ${from} -> ${to}`);

  let changed = text !== original;
  console.log(changed ? 'Changed.' : 'No change.');
  if (changed && !dryRun) fs.writeFileSync(file, text);
  if (recordsFile) {
    const records = buildRecords(doc.mods, reportsByEntry, { previous: readRecords(recordsFile) });
    const recordsChanged = !dryRun && writeRecords(recordsFile, records);
    console.log(`compat records: ${records.Records.length}${recordsChanged ? ', written' : ''}`);
    changed = changed || recordsChanged;
  }
  return changed;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main().catch(err => { console.error(err); process.exit(1); });
}
