// The TAOM and AD1259 community lists: counts the approved mod reports of one tool into its list
// file and writes MODS.md, the readable page, in that tool's repository:
//   --list taom    (default) compat/taom-mod-compat.json in Coodsz/Coodsz-TAOM
//   --list ad1259  compat/ad1259-mod-compat.json in Coodsz/Coodsz-AD1259 (the fixed AD1259 pack)
//
// The reports are the one click reports the tools send through server/mod-reports-worker
// (labels mod-compat, mod-report, pending and taom or ad1259; they count once pending is removed,
// by Coodsz or by the hourly auto approval, auto-approve-reports.mjs) and the tool's issue form
// (labels mod-compat and taom or ad1259, taom-compat/ and ad1259-compat/.github/ISSUE_TEMPLATE/
// mod-compat.yml in the launcher repository). Reading the issues and picking the latest vote per
// person and mod is the same as the Coop and Friends tally (collectReports in tally-mod-compat.mjs):
// pending, invalid and spam reports do not count.
//
// The hand checked fields stay Coodsz's: id, name, version, workshopId, nexusId, tag, class,
// clientOnlyOnServer, hasServerBuild, source, checked and note are never changed, and the tag
// never moves on its own. The tally only sets these count fields on each entry:
//   works       players who said it works (Works only with counts here too)
//   broken      players who said it is broken
//   clientOnly  players who said it only needs to be on the players' PCs (issue form only)
//   lastReport  the day of the newest counted report, YYYY-MM-DD
// An entry with no counted report has none of them. Reported mods that are not on the list go
// into a separate "community" array next to "mods" with the same count fields, so the tools,
// which read only "mods", never show a badge Coodsz did not give. The TAOM tools skip fields
// they do not know (System.Text.Json), so schemaVersion stays 2. No tool reads the AD1259 file yet.
//
// Every run counts all reports again; running twice on the same input gives the same files.
//
// Usage:
//   node tally-taom-compat.mjs [--list taom|ad1259] [--file <list file>] [--page MODS.md] [--issues fixture.json] [--dry-run]
//   node tally-taom-compat.mjs --page-only [--list ...] [--file ...] [--page ...]   (only writes MODS.md from the file as it is)
//
// Without --issues the issues come from the GitHub API (GITHUB_TOKEN and GITHUB_REPOSITORY).
// It imports tally-mod-compat.mjs (which imports compat-records.mjs), so both sit next to it.
// No dependencies; Node 18+.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collectReports, fetchIssues, mdCell, mdModLink, countsText, writeIfChanged, TAOM_LABEL, AD1259_LABEL, NOT_CHECKED } from './tally-mod-compat.mjs';

export { NOT_CHECKED };
export const COUNT_KEYS = ['works', 'broken', 'clientOnly', 'lastReport'];
export const REPORT_FORM_URL = 'https://github.com/Coodsz/Coodsz-TAOM/issues/new?template=mod-compat.yml';
export const AD1259_REPORT_FORM_URL = 'https://github.com/Coodsz/Coodsz-AD1259/issues/new?template=mod-compat.yml';

// The plain words for each TAOM tag, in the order MODS.md lists them.
export const STATUS = [
  ['safe', 'Works'],
  ['everyone', 'Everyone needs it'],
  ['loads', 'Loads'],
  ['reported', 'Reported working'],
  ['risky', 'Risky'],
  ['broken', 'Broken'],
];

// The AD1259 tags: the pack mods, then extra mods Coodsz checked with the pack.
export const AD1259_STATUS = [
  ['pack', 'In the pack'],
  ['safe', 'Works'],
  ['risky', 'Risky'],
  ['broken', 'Broken'],
];

const keyOf = s => String(s ?? '').trim().toLowerCase();
const dayOf = s => (/^\d{4}-\d{2}-\d{2}$/.test(s ?? '') ? s : '');

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
 * The same for the TAOM and the AD1259 list.
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

/** The status words of a tag, in the TAOM list unless another list's statuses are passed. */
export function statusText(tag, statuses) {
  if (!Array.isArray(statuses)) statuses = STATUS;
  return statuses.find(([t]) => t === keyOf(tag))?.[1] ?? NOT_CHECKED;
}

const statusRank = (tag, statuses) => { const i = statuses.findIndex(([t]) => t === keyOf(tag)); return i < 0 ? statuses.length : i; };

const modCell = e => mdModLink(e.name || e.id || e.workshopId, e.workshopId, e.nexusId);

export function playersCell(e) {
  if (e.works === undefined && e.broken === undefined && !e.clientOnly) return '';
  return countsText(e.works, e.broken, e.clientOnly);
}

/** The day Coodsz checked it himself: in Coop, or with the automatic server load test. */
export function checkedCell(e) {
  const day = dayOf(e.checked);
  if (!day) return '';
  if (keyOf(e.source) === 'coodsz-coop') return day;
  if (keyOf(e.source) === 'server-loads') return `${day} (server load test)`;
  return '';
}

const versionsOf = (doc, first) => [first, doc.game && `Bannerlord ${doc.game}`, doc.coop && `Coop ${doc.coop}`].filter(Boolean).join(', ');

/**
 * What differs between the two lists: the file kind, where it sits, which reports count, the tags,
 * the text on top of MODS.md and the table columns. keepOrder lists the hand entries of one status
 * in the file's order (the AD1259 load order) instead of by name.
 */
export const LISTS = {
  taom: {
    kind: 'CoodszTaomCompat',
    file: 'compat/taom-mod-compat.json',
    // Every report in the TAOM repository is a TAOM one, so only AD1259 reports are left out.
    leaveOut: [AD1259_LABEL],
    statuses: STATUS,
    keepOrder: false,
    intro: doc => {
      const versions = versionsOf(doc, doc.taom && `TAOM ${doc.taom}`);
      return [
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
      ];
    },
    header: '| Mod | Status | Players | Checked by Coodsz | Note |',
    row: (e, status) => `| ${modCell(e)} | ${status} | ${playersCell(e)} | ${checkedCell(e)} | ${mdCell(e.note)} |`,
  },
  ad1259: {
    kind: 'CoodszAd1259Compat',
    file: 'compat/ad1259-mod-compat.json',
    // Every report in the AD1259 repository is an AD1259 one, so only TAOM reports are left out.
    leaveOut: [TAOM_LABEL],
    statuses: AD1259_STATUS,
    keepOrder: true,
    intro: doc => {
      const versions = versionsOf(doc, doc.ad1259 && `AD1259 ${doc.ad1259}`);
      return [
        '# AD1259 mod list',
        '',
        `The mods of the AD1259 Coop pack${versions ? ` (${versions})` : ''} and what players report about them.`,
        'This page is made from [compat/ad1259-mod-compat.json](compat/ad1259-mod-compat.json) and is written',
        'again on its own whenever a player report is counted.',
        '',
        'The server and every player need exactly the pack mods, in these versions and in this order. The Coodsz',
        'AD1259 Client Launcher checks them and Get it opens each mod\'s page.',
        '',
        '## What the statuses mean',
        '',
        'The status is set by hand by Coodsz. Player reports never change it; they show in the Players column.',
        '',
        `- **In the pack**: part of the AD1259 pack, tested together on a Coop dedicated server with players joining${dayOf(doc.tested) ? ` (${doc.tested})` : ''}. Every PC needs it.`,
        '- **Works**: an extra mod Coodsz tested with the pack in Coop.',
        '- **Risky**: an extra mod that can work with the pack, but the note says what to watch for.',
        '- **Broken**: known to break the pack or Coop. Leave it off.',
        `- **${NOT_CHECKED}**: players reported it, Coodsz has not checked it.`,
        '',
        '**Players** counts the players who reported it works, is broken or is client only. A Broken report on',
        'a pack mod mostly says which mod a crash named. **Last report** is the day of the newest counted report.',
        '',
        '## How to report a mod',
        '',
        'Click **Report a mod** at the top of the Coodsz AD1259 Client Launcher (or **Report** on the bar after a',
        'game) and pick Works or Broken for each mod. No GitHub account is needed. A report counts here about a',
        'day later.',
        `With a GitHub account you can also use the [report form](${AD1259_REPORT_FORM_URL}).`,
      ];
    },
    header: '| Mod | Status | Version | Players | Last report | Note |',
    row: (e, status) => `| ${modCell(e)} | ${status} | ${mdCell(e.version)} | ${playersCell(e)} | ${dayOf(e.lastReport)} | ${mdCell(e.note)} |`,
  },
};

/** The list a file is, by its kind; the TAOM list when the kind is not known. */
export function listOf(doc) {
  return Object.values(LISTS).find(l => l.kind === doc?.kind) ?? LISTS.taom;
}

/** The whole MODS.md page from the list file. Only depends on the file, so it is the same every run. */
export function renderModsPage(doc, list = listOf(doc)) {
  const { statuses } = list;
  const name = e => e.name || e.id;
  const rows = [
    ...(doc.mods ?? []).map((e, i) => ({ e, i, hand: true, rank: statusRank(e.tag, statuses), status: statusText(e.tag, statuses) })),
    ...(doc.community ?? []).map((e, i) => ({ e, i, hand: false, rank: statuses.length + 1, status: NOT_CHECKED })),
  ].sort((a, b) => a.rank - b.rank
    || (list.keepOrder && a.hand && b.hand ? a.i - b.i : name(a.e).localeCompare(name(b.e), 'en', { sensitivity: 'base' })));

  const out = [
    ...list.intro(doc),
    '',
    list.header,
    list.header.replace(/[^|]+/g, ' --- '),
    ...rows.map(({ e, status }) => list.row(e, status)),
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

async function main() {
  const listName = arg('--list') ?? 'taom';
  const list = LISTS[listName];
  if (!list) throw new Error(`--list must be ${Object.keys(LISTS).join(' or ')}`);
  const file = arg('--file') ?? list.file;
  const page = arg('--page') ?? 'MODS.md';
  const fixture = arg('--issues');
  const dryRun = process.argv.includes('--dry-run');

  const original = fs.readFileSync(file, 'utf8');
  const doc = JSON.parse(original.replace(/^\uFEFF/, ''));
  if (doc.kind !== list.kind || !Array.isArray(doc.mods)) throw new Error(`${file} is not a ${listName} mod list`);
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
    const { reports, skipped } = collectReports(issues, { leaveOut: list.leaveOut });
    const { added } = applyTaomTally(doc, reports);
    const text = serializeTaom(doc, nl);
    JSON.parse(text); // make sure the result is valid before writing it
    console.log(`issues: ${issues.length}, reports counted: ${reports.length}, skipped: ${skipped.length}, mods: ${doc.mods.length}, not on the list: ${added.length}`);
    for (const [n, why] of skipped) console.log(`  skipped #${n}: ${why}`);
    for (const id of added) console.log(`  not on the list: ${id}`);
    listChanged = writeIfChanged(file, text, dryRun);
  }
  const pageChanged = writeIfChanged(page, renderModsPage(doc, list), dryRun);
  const changed = listChanged || pageChanged;
  console.log(changed ? `Changed${listChanged ? ` ${file}` : ''}${pageChanged ? ` ${page}` : ''}${dryRun ? ' (dry run)' : ''}.` : 'No change.');
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed && !dryRun}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main().catch(err => { console.error(err); process.exit(1); });
}
