// Writes Coodsz's approved community results as ModderLords compat records, the format Ryvius
// (@PlueRyvius) made for ModderLords (https://github.com/PlueRyvius/ModderLords,
// docs/COMPAT-RECORD-FORMAT.md), used with his permission. The output is the STRICT form his
// submission gate and compat-record.schema.json (copied next to this file) accept.
//
// A mod gets a record once the counted reports agree: works - broken >= RECORD_THRESHOLD gives
// Verdict "Works", the other way round "Broken". Anything closer than that gets no record. A hand
// kept entry (one with "coop" in mods.json) gets a record only when the counts agree with the
// status Coodsz set, so a record never says something else than mods.json.
//
// UpdatedAt changes only when a record's content changes: with the records file from before
// (previous), an unchanged record keeps its date.
//
// The tally (tally-mod-compat.mjs --records <file>) calls buildRecords with the counted reports,
// which carry the mod and Coop versions. Run on its own it reads only the counts in mods.json:
//   node compat-records.mjs [--file compat-list/mods.json] [--out compat-list/compat-records.json]
// No dependencies; Node 18+.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const RECORD_THRESHOLD = 3;
export const SCHEMA_VERSION = 1;
const ID_PATTERN = /^(?=.{1,64}$)[A-Za-z0-9][A-Za-z0-9._-]*(?: [A-Za-z0-9._-]+)*$/;
const VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._+-]{0,39}$/;
const MAX_VERSIONS = 20;

/** "Works", "Broken" or null from the counts. */
export function verdictFor(works, broken) {
  if (works - broken >= RECORD_THRESHOLD) return 'Works';
  if (broken - works >= RECORD_THRESHOLD) return 'Broken';
  return null;
}

const players = n => `${n} ${n === 1 ? 'player' : 'players'}`;

/** The Notes text, for example "12 players reported works, 2 broken, with the Coodsz tools." */
export function notesFor(works, broken) {
  return `${players(works)} reported works, ${broken} broken, with the Coodsz tools.`;
}

/** An ISO date in the record form (2026-10-14T01:52:02Z), or null. */
function utc(value) {
  const t = Date.parse(value ?? '');
  return Number.isNaN(t) ? null : new Date(t).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * The records file for these mods. reportsByEntry maps a mods.json entry to its counted reports
 * ({ result, version, coop, created }); without it the records have only the verdict and notes.
 */
export function buildRecords(mods, reportsByEntry = new Map(), { previous = null, now = new Date() } = {}) {
  const records = [];
  const seen = new Set();
  const before = new Map((previous?.Records ?? []).filter(r => typeof r?.Id === 'string').map(r => [r.Id.toLowerCase(), r]));
  for (const m of mods) {
    if (m.idGuess || typeof m.id !== 'string' || !ID_PATTERN.test(m.id)) continue;
    const key = m.id.toLowerCase();
    if (seen.has(key)) continue;
    const works = m.works ?? 0, broken = m.broken ?? 0;
    const verdict = verdictFor(works, broken);
    if (!verdict) continue;
    // Hand kept: the status Coodsz set is the answer; counts that say otherwise give no record.
    if (isHandKept(m) && m.status !== verdict) continue;
    seen.add(key);
    const reports = reportsByEntry.get(m) ?? [];
    const agree = reports
      .filter(r => (verdict === 'Works' ? r.result === 'works' || r.result === 'workswith' : r.result === 'broken'))
      .sort((a, b) => String(b.created).localeCompare(String(a.created)));
    const record = { Id: m.id, Verdict: verdict };
    const versions = [];
    for (const r of agree) {
      const v = String(r.version ?? '').trim();
      if (VERSION_PATTERN.test(v) && !versions.some(x => x.toLowerCase() === v.toLowerCase())) versions.push(v);
    }
    if (versions.length) record.TestedVersions = versions.slice(0, MAX_VERSIONS);
    const coop = mostCommon(agree.map(r => String(r.coop ?? '').trim()).filter(v => VERSION_PATTERN.test(v)));
    if (coop) record.TestedCoopVersion = coop;
    record.Notes = notesFor(works, broken);
    const workshop = String(m.workshop ?? '').trim();
    if (/^\d{1,20}$/.test(workshop)) record.Url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshop}`;
    const old = before.get(key);
    if (old && sameContent(old, record)) {
      if (old.UpdatedAt) record.UpdatedAt = old.UpdatedAt;
    } else {
      // New or changed: the newest report that made it, or now when that is not newer than the old date.
      const newest = reports.map(r => utc(r.created)).filter(Boolean).sort().pop();
      record.UpdatedAt = newest && (!old?.UpdatedAt || newest > old.UpdatedAt) ? newest : utc(now.toISOString());
    }
    records.push(record);
  }
  records.sort((a, b) => a.Id.localeCompare(b.Id, 'en', { sensitivity: 'base' }) || a.Id.localeCompare(b.Id));
  return { SchemaVersion: SCHEMA_VERSION, Records: records };
}

// Hand kept entries carry the Coop version their verdict was checked with (tally isManual).
const isHandKept = m => typeof m.coop === 'string' && m.coop.trim() !== '';

// The same record apart from UpdatedAt.
function sameContent(a, b) {
  const strip = ({ UpdatedAt, ...rest }) => rest;
  return JSON.stringify(strip(a)) === JSON.stringify(strip(b));
}

/** The records file written before, or null when there is none or it cannot be read. */
export function readRecords(path) {
  try {
    return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, 'utf8')) : null;
  } catch {
    return null;
  }
}

// The most common value (the newest of a tie, since the list comes newest first).
function mostCommon(values) {
  const counts = new Map();
  for (const v of values) counts.set(v.toLowerCase(), { v: counts.get(v.toLowerCase())?.v ?? v, n: (counts.get(v.toLowerCase())?.n ?? 0) + 1 });
  let best = null;
  for (const c of counts.values()) if (!best || c.n > best.n) best = c;
  return best?.v ?? null;
}

export function serializeRecords(file) {
  return JSON.stringify(file, null, 2) + '\n';
}

/** Writes the file when it changed; true when it did. */
export function writeRecords(path, file) {
  const text = serializeRecords(file);
  const old = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : null;
  if (old === text) return false;
  fs.writeFileSync(path, text);
  return true;
}

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  // Not awaited at the top: the tally imports this file, and a top level await would wait on itself.
  import('./tally-mod-compat.mjs').then(({ parseJsonc }) => {
    const file = arg('--file') ?? 'compat-list/mods.json';
    const out = arg('--out') ?? 'compat-list/compat-records.json';
    const records = buildRecords(parseJsonc(fs.readFileSync(file, 'utf8')).mods, new Map(), { previous: readRecords(out) });
    const changed = writeRecords(out, records);
    console.log(`${records.Records.length} records, ${changed ? 'written' : 'no change'}: ${out}`);
  }).catch(err => { console.error(err); process.exit(1); });
}
