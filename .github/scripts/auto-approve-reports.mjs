// Approves the one click mod reports on its own: removes the "pending" label from every open
// "mod-report" issue that nobody changed for WAIT_HOURS hours and that has none of the labels
// "suspicious", "spam" or "invalid". The report worker (server/mod-reports-worker) adds
// "suspicious" when a report looks odd; those wait for Coodsz, who approves one by removing
// "pending" or drops it with "spam" or "invalid".
//
// The wait counts from the issue's last change (updated_at), so a vote a player changed (the worker
// edits the issue and adds "pending" again) waits a full day again too.
//
// Runs from .github/workflows/auto-approve-reports.yml every hour, in Coodsz-Coop-and-Friends, in
// Coodsz-TAOM and in Coodsz-AD1259 (where the worker files the TAOM and the AD1259 reports). Older
// TAOM and AD1259 reports in Coodsz-Coop-and-Friends get approved the same way; the tally there
// leaves them out of compat-list/mods.json anyway.
//
// Usage:
//   node auto-approve-reports.mjs [--dry-run]
//
// Needs the GITHUB_TOKEN (Issues: write) and GITHUB_REPOSITORY environment variables. WAIT_HOURS
// comes from the workflow; without it the default below is used. No dependencies; Node 18+.

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Only for runs outside the workflow; the workflow's WAIT_HOURS is the one to change.
export const DEFAULT_WAIT_HOURS = 24;
export const REPORT_LABEL = 'mod-report';
export const PENDING_LABEL = 'pending';
// A report with any of these stays pending for Coodsz.
export const HOLD_LABELS = ['suspicious', 'spam', 'invalid'];

const labelsOf = issue => (issue.labels ?? []).map(l => (typeof l === 'string' ? l : l.name).toLowerCase());

/** Why this issue is not approved now, or null when it may be. */
export function waitReason(issue, now, waitHours) {
  const labels = labelsOf(issue);
  if (issue.pull_request || issue.state === 'closed') return 'not an open issue';
  if (!labels.includes(REPORT_LABEL) || !labels.includes(PENDING_LABEL)) return 'not a pending mod report';
  const hold = HOLD_LABELS.find(l => labels.includes(l));
  if (hold) return `held (${hold})`;
  const changed = Date.parse(issue.updated_at ?? issue.created_at ?? '');
  if (!Number.isFinite(changed)) return 'no date';
  if (now - changed < waitHours * 3600 * 1000) return 'waiting';
  return null;
}

async function call(fetcher, token, method, url) {
  return fetcher(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'coodsz-auto-approve-reports',
    },
  });
}

/** The open pending mod reports, every page. */
export async function fetchPending(repo, token, fetcher = fetch) {
  const all = [];
  for (let page = 1; ; page++) {
    const url = `https://api.github.com/repos/${repo}/issues?labels=${REPORT_LABEL},${PENDING_LABEL}&state=open&per_page=100&page=${page}`;
    const res = await call(fetcher, token, 'GET', url);
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    all.push(...batch);
    if (batch.length < 100) return all;
  }
}

/** One issue as it is now, or null when it is gone. */
export async function fetchIssue(repo, token, number, fetcher = fetch) {
  const res = await call(fetcher, token, 'GET', `https://api.github.com/repos/${repo}/issues/${number}`);
  if (res.status === 404 || res.status === 410) return null;
  if (!res.ok) throw new Error(`GitHub API ${res.status} reading #${number}: ${await res.text()}`);
  return res.json();
}

/** Removes pending from every report that waited long enough. The numbers it approved, and the rest with why. */
export async function autoApprove({ repo, token, fetcher = fetch, now = Date.now(), waitHours = DEFAULT_WAIT_HOURS, dryRun = false }) {
  const issues = await fetchPending(repo, token, fetcher);
  const approved = [];
  const left = [];
  for (const issue of issues) {
    const why = waitReason(issue, now, waitHours);
    if (why) { left.push([issue.number, why]); continue; }
    // Read the issue again just before approving: Coodsz may have added suspicious, spam or invalid,
    // or the worker may have changed the vote, since the list was read.
    const current = await fetchIssue(repo, token, issue.number, fetcher);
    const whyNow = current ? waitReason(current, now, waitHours) : 'gone';
    if (whyNow) { left.push([issue.number, whyNow]); continue; }
    if (!dryRun) {
      const res = await call(fetcher, token, 'DELETE', `https://api.github.com/repos/${repo}/issues/${issue.number}/labels/${PENDING_LABEL}`);
      // 404: the label is gone already (Coodsz was quicker).
      if (!res.ok && res.status !== 404) throw new Error(`GitHub API ${res.status} removing pending from #${issue.number}: ${await res.text()}`);
    }
    approved.push(issue.number);
  }
  return { approved, left };
}

/** WAIT_HOURS from the environment, or the default when it is missing or not a positive number. */
export function waitHoursFrom(value) {
  const n = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(n) && n > 0 ? n : DEFAULT_WAIT_HOURS;
}

async function main() {
  const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repo } = process.env;
  if (!token || !repo) throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY are needed');
  const waitHours = waitHoursFrom(process.env.WAIT_HOURS);
  const dryRun = process.argv.includes('--dry-run');
  const { approved, left } = await autoApprove({ repo, token, waitHours, dryRun });
  console.log(`wait: ${waitHours} hours, approved: ${approved.length}${dryRun ? ' (dry run)' : ''}, left pending: ${left.length}`);
  for (const n of approved) console.log(`  approved #${n}`);
  for (const [n, why] of left) console.log(`  #${n}: ${why}`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `approved=${dryRun ? 0 : approved.length}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  main().catch(err => { console.error(err); process.exit(1); });
}
