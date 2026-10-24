// The TAOM community list: counts the approved TAOM mod reports into compat/taom-mod-compat.json
// and writes MODS.md, the readable page, in the Coodsz/Coodsz-TAOM repository.
//
// The reports are the one click reports the TAOM tools send through server/mod-reports-worker
// (labels mod-compat, mod-report, pending, taom; they count once pending is removed, by Coodsz
// or by the hourly auto approval, auto-approve-reports.mjs) and the TAOM issue form
// (labels mod-compat and taom, taom-compat/.github/ISSUE_TEMPLATE/mod-compat.yml in the
// launcher repository). Reading the issues and picking the latest vote per person and mod is the
// same as the Coop and Friends tally (collectReports in tally-mod-compat.mjs): pending, invalid
// and spam reports do not count.
//
// The hand checked fields stay Coodsz's: id, name, workshopId, nexusId, tag, class,
// clientOnlyOnServer, hasServerBuild, source, checked and note are never changed, and the tag
// never moves on its own. The tally only sets these count fields on each entry:
//   works       players who said it works (Works only with counts here too)
//   broken      players who said it is broken
//   clientOnly  players who said it only needs to be on the players' PCs (issue form only)
//   lastReport  the day of the newest counted report, YYYY-MM-DD
// An entry with no counted report has none of them. Reported mods that are not on the list go
// into a separate "community" array next to "mods" with the same count fields, so the tools,
// which read only "mods", never show a badge Coodsz did not give. The TAOM tools skip fields
// they do not know (System.Text.Json), so schemaVersion stays 2.
//
// Every run counts all reports again; running twice on the same input gives the same files.
//
// Usage:
//   node tally-taom-compat.mjs [--file compat/taom-mod-compat.json] [--page MODS.md] [--issues fixture.json] [--dry-run]
//   node tally-taom-compat.mjs --page-only [--file ...] [--page ...]   (only writes MODS.md from the file as it is)
//
// Without --issues the issues come from the GitHub API (GITHUB_TOKEN and GITHUB_REPOSITORY).
// It imports tally-mod-compat.mjs (which imports compat-records.mjs), so both sit next to it.
// No dependencies; Node 18+.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collectReports, fetchIssues, AD1259_LABEL } from './tally-mod-compat.mjs';

export const COUNT_KEYS = ['works', 'broken', 'clientOnly', 'lastReport'];
export const REPORT_FORM_URL = 'https://github.com/Coodsz/Coodsz-TAOM/issues/new?template=mod-compat.yml';

// The plain words for each tag, in the order MODS.md lists them.
export const STATUS = [
  ['safe', 'Works'],
  ['everyone', 'Everyone needs it'],
  ['loads', 'Loads'],
  ['reported', 'Reported working'],
  ['risky', 'Risky'],
  ['broken', 'Broken'],
];
export const NOT_CHECKED = 'Not checked yet';

const keyOf = s => String(s ?? '').trim().toLowerCase();

/** The list entry a report is about: by module id, else by name for an entry without an id. */
function findEntry(mods, report) {
  const id = keyOf(report.modId);
  const byId = mods.find(m => keyOf(m.id) === id && id !== '');
  if (byId) return byId;
  const names = [keyOf(report.modName), id].filter(Boolean);
  return mods.find(m => keyOf(m.id) === '' && names.includes(keyOf(m.name)));
}

function setCounts(entry, c) {
  for (const k of COUNT_KEYS) delete entry[k];
  if (!c) return;
  entry.works = c.works;
  entry.broken = c.broken;
  if (c.clientOnly) entry.clientOnly = c.clientOnly;
  if (c.lastReport) entry.lastReport = c.lastReport;
}

/**
 * Sets the count fields on doc.mods and rebuilds doc.community from the counted reports. Only the
 * count fields change. Returns the ids of the reported mods that are not on the hand list.
 */
export function applyTaomTally(doc, reports) {
  doc.mods ??= [];
  const counts = new Map();
  const community = new Map();
  for (const r of reports) {
    let target = findEntry(doc.mods, r);
    if (!target) {
      const key = keyOf(r.modId);
      target = community.get(key) ?? { id: r.modId, name: r.modName ?? r.modId };
      community.set(key, target);
    }
    const c = counts.get(target) ?? { works: 0, broken: 0, clientOnly: 0, lastReport: '' };
    if (r.result === 'works' || r.result === 'workswith') c.works++;
    else if (r.result === 'broken') c.broken++;
    else if (r.result === 'clientonly') c.clientOnly++;
    const day = String(r.created ?? '').slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && day > c.lastReport) c.lastReport = day;
    counts.set(target, c);
  }
  for (const m of doc.mods) setCounts(m, counts.get(m));
  const extra = [...community.values()]
    .map(e => { setCounts(e, counts.get(e)); return e; })
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) || a.id.localeCompare(b.id));
  if (extra.length) doc.community = extra;
  else delete doc.community;
  return { added: extra.map(e => e.id) };
}

// ---- The JSON file --------------------------------------------------------

/** One entry on one line, its own keys in their order and the count fields last. */
function formatEntry(e) {
  const keys = [...Object.keys(e).filter(k => !COUNT_KEYS.includes(k)), ...COUNT_KEYS.filter(k => k in e)];
  return '{ ' + keys.filter(k => e[k] !== undefined && e[k] !== null).map(k => `${JSON.stringify(k)}: ${JSON.stringify(e[k])}`).join(', ') + ' }';
}

/** Writes the file in the hand kept layout: top level fields one per line, one entry per line. */
export function serializeTaom(doc, nl = '\n') {
  const lines = ['{'];
  const keys = Object.keys(doc);
  keys.forEach((k, i) => {
    const comma = i < keys.length - 1 ? ',' : '';
    if (Array.isArray(doc[k]) && (k === 'mods' || k === 'community')) {
      if (doc[k].length === 0) { lines.push(`  ${JSON.stringify(k)}: []${comma}`); return; }
      lines.push(`  ${JSON.stringify(k)}: [`);
      doc[k].forEach((e, j) => lines.push('    ' + formatEntry(e) + (j < doc[k].length - 1 ? ',' : '')));
      lines.push('  ]' + comma);
    } else {
      lines.push(`  ${JSON.stringify(k)}: ${JSON.stringify(doc[k])}${comma}`);
    }
  });
  lines.push('}');
  return lines.join(nl) + nl;
}

// ---- MODS.md ------------------------------------------------------------

export function statusText(tag) {
  return STATUS.find(([t]) => t === keyOf(tag))?.[1] ?? NOT_CHECKED;
}

const statusRank = tag => { const i = STATUS.findIndex(([t]) => t === keyOf(tag)); return i < 0 ? STATUS.length : i; };

/** Text for a table cell: no line breaks, no pipes, no HTML. */
function cell(text) {
  return String(text ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').replace(/</g, '&lt;').trim();
}

function modCell(e) {
  const name = cell(e.name || e.id || e.workshopId).replace(/([[\]])/g, '\\$1');
  if (/^\d{1,20}$/.test(e.workshopId ?? '')) return `[${name}](https://steamcommunity.com/sharedfiles/filedetails/?id=${e.workshopId})`;
  if (/^\d{1,10}$/.test(e.nexusId ?? '')) return `[${name}](https://www.nexusmods.com/mountandblade2bannerlord/mods/${e.nexusId})`;
  return name;
}

export function playersCell(e) {
  if (e.works === undefined && e.broken === undefined && !e.clientOnly) return '';
  const parts = [`${e.works ?? 0} works`, `${e.broken ?? 0} broken`];
  if (e.clientOnly) parts.push(`${e.clientOnly} client only`);
  return parts.join(', ');
}

/** The day Coodsz checked it himself: in Coop, or with the automatic server load test. */
export function checkedCell(e) {
  const day = /^\d{4}-\d{2}-\d{2}$/.test(e.checked ?? '') ? e.checked : '';
  if (!day) return '';
  if (keyOf(e.source) === 'coodsz-coop') return day;
  if (keyOf(e.source) === 'server-loads') return `${day} (server load test)`;
  return '';
}

/** The whole MODS.md page from the list file. Only depends on the file, so it is the same every run. */
export function renderModsPage(doc) {
  const rows = [
    ...(doc.mods ?? []).map(e => ({ e, rank: statusRank(e.tag), status: statusText(e.tag) })),
    ...(doc.community ?? []).map(e => ({ e, rank: STATUS.length + 1, status: NOT_CHECKED })),
  ].sort((a, b) => a.rank - b.rank || (a.e.name || a.e.id).localeCompare(b.e.name || b.e.id, 'en', { sensitivity: 'base' }));

  const versions = [doc.taom && `TAOM ${doc.taom}`, doc.game && `Bannerlord ${doc.game}`, doc.coop && `Coop ${doc.coop}`].filter(Boolean).join(', ');
  const out = [
    '# TAOM mod list',
    '',
    `Which mods work with TAOM in Coop${versions ? ` (${versions})` : ''}. This page is made from`,
    '[compat/taom-mod-compat.json](compat/taom-mod-compat.json), the list the Coodsz TAOM tools show,',
    'and is written again on its own whenever a player report is counted.',
    '',
    '## What the statuses mean',
    '',
    'The status is set by hand by Coodsz. Player reports never change it; they show in the Players column.',
    '',
    '- **Works**: tested in Coop by Coodsz, a TAOM server with a player joining.',
    '- **Everyone needs it**: works, but the host and every player need the same version.',
    '- **Loads**: passed the automatic server load test of the TAOM server tool. Joining was not tested.',
    '- **Reported working**: reported working in TAOM singleplayer, not tested in Coop yet.',
    '- **Risky**: can work, but it changes campaign logic or battles, or is not tested with TAOM yet. The note says why.',
    '- **Broken**: known to break TAOM or Coop. Leave it off.',
    `- **${NOT_CHECKED}**: players reported it, Coodsz has not checked it.`,
    '',
    '**Players** counts the players who reported it works or is broken. **Checked by Coodsz** is the day',
    'Coodsz tested it himself.',
    '',
    '## How to report a mod',
    '',
    'Click **Report a mod** at the top of the Coodsz TAOM Client Launcher (or **Report** on the bar after a',
    'game) and pick Works or Broken for each mod. No GitHub account is needed. A report counts here about a',
    'day later.',
    `With a GitHub account you can also use the [report form](${REPORT_FORM_URL}).`,
    '',
    '| Mod | Status | Players | Checked by Coodsz | Note |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(({ e, status }) => `| ${modCell(e)} | ${status} | ${playersCell(e)} | ${checkedCell(e)} | ${cell(e.note)} |`),
    '',
    `${rows.length} mods${doc.updated ? `. List updated ${doc.updated}` : ''}.`,
    '',
  ];
  return out.join('\n');
}

// ---- Entry point --------------------------------------------------------

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
}

function writeIfChanged(file, text, dryRun) {
  const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (before === text) return false;
  if (!dryRun) fs.writeFileSync(file, text);
  return true;
}

async function main() {
  const file = arg('--file') ?? 'compat/taom-mod-compat.json';
  const page = arg('--page') ?? 'MODS.md';
  const fixture = arg('--issues');
  const dryRun = process.argv.includes('--dry-run');

  const original = fs.readFileSync(file, 'utf8');
  const doc = JSON.parse(original.replace(/^\uFEFF/, ''));
  if (doc.kind !== 'CoodszTaomCompat' || !Array.isArray(doc.mods)) throw new Error(`${file} is not a TAOM mod list`);
  const nl = original.includes('\r\n') ? '\r\n' : '\n';

  let listChanged = false;
  if (!process.argv.includes('--page-only')) {
    let issues;
    if (fixture) {
      issues = JSON.parse(fs.readFileSync(fixture, 'utf8'));
    } else {
      const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repo } = process.env;
      if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are needed (or --issues <fixture.json>)');
      issues = await fetchIssues(repo, token);
    }
    // Every report in the TAOM repository is a TAOM one, so only AD1259 reports are left out.
    const { reports, skipped } = collectReports(issues, { leaveOut: [AD1259_LABEL] });
    const { added } = applyTaomTally(doc, reports);
    const text = serializeTaom(doc, nl);
    JSON.parse(text); // make sure the result is valid before writing it
    console.log(`issues: ${issues.length}, reports counted: ${reports.length}, skipped: ${skipped.length}, mods: ${doc.mods.length}, not on the list: ${added.length}`);
    for (const [n, why] of skipped) console.log(`  skipped #${n}: ${why}`);
    for (const id of added) console.log(`  not on the list: ${id}`);
    listChanged = writeIfChanged(file, text, dryRun);
  }
  const pageChanged = writeIfChanged(page, renderModsPage(doc), dryRun);
  const changed = listChanged || pageChanged;
  console.log(changed ? `Changed${listChanged ? ` ${file}` : ''}${pageChanged ? ` ${page}` : ''}${dryRun ? ' (dry run)' : ''}.` : 'No change.');
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed && !dryRun}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main().catch(err => { console.error(err); process.exit(1); });
}
