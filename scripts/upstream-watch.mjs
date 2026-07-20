#!/usr/bin/env node

const API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const TARGET_REPOSITORY = process.env.GITHUB_REPOSITORY || 'lukasborges/platform';
const ISSUE_TITLE = '[Upstream Radar] Platform';
const STATE_PREFIX = '<!-- upstream-state:';
const INITIAL_COMMIT_LIMIT = 10;
const REPORT_COMMIT_LIMIT = 20;

export const UPSTREAMS = [
  {
    id: 'ingenium',
    repository: 'agenciaingenium/desktop-app',
    role: 'primary',
  },
  {
    id: 'mathijs',
    repository: 'Mathijs003/station-app',
    role: 'secondary',
  },
  {
    id: 'oddball',
    repository: 'oddballza/desktop-app',
    role: 'experimental',
  },
];

function hasArg(name) {
  return process.argv.includes(name);
}

function markdown(value) {
  return String(value)
    .replace(/[\r\n]+/g, ' ')
    .replace(/([\\`*_[\]{}()#+!|>])/g, '\\$1')
    .trim();
}

function shortSha(sha) {
  return sha.slice(0, 7);
}

export function parseState(body = '') {
  const escapedPrefix = STATE_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = body.match(new RegExp(`${escapedPrefix}([^\n]+?) -->`));

  if (!match) return {};

  try {
    const state = JSON.parse(match[1]);
    return state && typeof state === 'object' ? state : {};
  } catch {
    return {};
  }
}

function stateMarker(state) {
  return `${STATE_PREFIX}${JSON.stringify(state)} -->`;
}

const RULES = [
  {
    category: 'Platform policy conflict',
    risk: 4,
    patterns: [
      /system.?tray/i,
      /systray/i,
      /\btray\b/i,
      /appindicator/i,
      /auto.?launch/i,
      /minimi[sz]e.?to.?tray/i,
      /background.?activity/i,
      /background.?on.?close/i,
    ],
    conflict: true,
  },
  {
    category: 'Authentication or security',
    risk: 4,
    patterns: [/auth/i, /oauth/i, /credential/i, /certificate/i, /security/i, /permission/i],
  },
  {
    category: 'Runtime Electron/IPC',
    risk: 4,
    patterns: [/electron/i, /webcontents/i, /webview/i, /\bipc\b/i, /user.?agent/i, /session/i],
  },
  {
    category: 'Persistence or migration',
    risk: 4,
    patterns: [/persist/i, /migration/i, /database/i, /sequelize/i, /storage/i, /partition/i],
  },
  {
    category: 'Build, packaging, or dependencies',
    risk: 3,
    patterns: [
      /package\.json/i,
      /yarn\.lock/i,
      /electron.?builder/i,
      /webpack/i,
      /release/i,
      /build/i,
      /dependenc/i,
      /docker/i,
      /\.github\/workflows/i,
    ],
  },
  {
    category: 'UI or user experience',
    risk: 2,
    patterns: [/\.s?css$/i, /component/i, /toolbar/i, /quick.?switch/i, /dock/i, /icon/i, /logo/i, /theme/i, /ui\b/i],
  },
  {
    category: 'App Store or applications',
    risk: 2,
    patterns: [/app.?store/i, /manifest/i, /application/i, /recipe/i],
  },
  {
    category: 'Product identity',
    risk: 3,
    patterns: [/rebrand/i, /branding/i, /station.?logo/i, /product.?name/i],
    branding: true,
  },
  {
    category: 'Tests or documentation',
    risk: 1,
    patterns: [/\btest/i, /spec\./i, /readme/i, /docs?\//i, /changelog/i],
  },
];

export function classifyChange(commits = [], files = []) {
  const filenames = files.map(file => file.filename || file);
  const haystack = [
    ...commits.map(commit => commit.commit?.message || commit.message || ''),
    ...filenames,
  ].join('\n');
  const documentationOnly = filenames.length > 0 && filenames.every(filename => (
    /(^|\/)docs?\//i.test(filename)
    || /(^|\/)(readme|changelog|contributing|license)(\.|$)/i.test(filename)
    || /\.md$/i.test(filename)
  ));

  if (documentationOnly) {
    return {
      categories: ['Tests or documentation'],
      conflict: false,
      recommendation: 'Candidate for `git cherry-pick -x` when the commit is small and isolated.',
      risk: 'low',
    };
  }

  const matches = RULES.filter(rule => rule.patterns.some(pattern => pattern.test(haystack)));
  const conflict = matches.some(rule => rule.conflict);
  const branding = matches.some(rule => rule.branding);
  const riskScore = Math.max(1, ...matches.map(rule => rule.risk));
  const risk = riskScore >= 4 ? 'high' : riskScore === 3 ? 'medium-high' : riskScore === 2 ? 'medium' : 'low';
  const categories = matches.length
    ? matches.map(rule => rule.category)
    : ['General change; manual inspection required'];

  let recommendation;
  if (conflict) {
    recommendation = 'Reject the conflicting behavior. If the commit also contains useful parts, reimplement only those parts.';
  } else if (branding) {
    recommendation = 'Reimplement while preserving the Platform name, logos, links, and package identifiers.';
  } else if (riskScore >= 4) {
    recommendation = 'Review in depth and prefer reimplementation; full validation is required before integration.';
  } else if (riskScore >= 2) {
    recommendation = 'Candidate for adoption after reviewing the diff and validating Platform customizations.';
  } else {
    recommendation = 'Candidate for `git cherry-pick -x` when the commit is small and isolated.';
  }

  return { categories, conflict, recommendation, risk };
}

async function github(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'platform-upstream-radar',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const details = await response.text();
    const error = new Error(`GitHub API ${response.status} for ${path}: ${details.slice(0, 500)}`);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

async function getUpstreamHead(upstream) {
  const repository = await github(`/repos/${upstream.repository}`);
  const branch = repository.default_branch;
  const commit = await github(`/repos/${upstream.repository}/commits/${encodeURIComponent(branch)}`);
  return { branch, sha: commit.sha };
}

async function getInitialChanges(upstream, branch) {
  const recentCommits = await github(
    `/repos/${upstream.repository}/commits?sha=${encodeURIComponent(branch)}&per_page=${INITIAL_COMMIT_LIMIT}`,
  );
  const commits = await Promise.all(recentCommits.map(commit => github(
    `/repos/${upstream.repository}/commits/${commit.sha}`,
  )));
  const filesByName = new Map();
  for (const commit of commits) {
    for (const file of commit.files || []) filesByName.set(file.filename, file);
  }

  return {
    baseline: true,
    commits,
    files: [...filesByName.values()],
    totalCommits: commits.length,
    warning: 'Initial baseline: recent commits are shown for triage, but they are not new changes detected since a previous run.',
  };
}

async function compareChanges(upstream, base, head, branch) {
  try {
    const comparison = await github(
      `/repos/${upstream.repository}/compare/${encodeURIComponent(base)}...${encodeURIComponent(head)}?per_page=100`,
    );

    return {
      baseline: false,
      commits: comparison.commits || [],
      files: comparison.files || [],
      totalCommits: comparison.total_commits ?? comparison.commits?.length ?? 0,
      warning: comparison.status === 'diverged'
        ? 'History has diverged since the previous SHA; review the comparison manually.'
        : null,
    };
  } catch (error) {
    if (![404, 409, 422].includes(error.status)) throw error;

    const fallback = await getInitialChanges(upstream, branch);
    return {
      ...fallback,
      baseline: false,
      warning: `Unable to compare against ${shortSha(base)} (rewritten history or removed SHA). Showing the most recent commits instead.`,
    };
  }
}

function renderCommit(commit, repository) {
  const sha = commit.sha;
  const subject = (commit.commit?.message || commit.message || 'No commit message').split('\n')[0];
  const author = commit.author?.login || commit.commit?.author?.name || 'unknown author';
  const url = commit.html_url || `https://github.com/${repository}/commit/${sha}`;
  return `- [\`${shortSha(sha)}\`](${url}) ${markdown(subject)} — ${markdown(author)}`;
}

function renderFiles(files) {
  if (!files.length) return 'not available in the initial scan';
  const shown = files.slice(0, 12).map(file => `\`${markdown(file.filename || file)}\``);
  const remaining = files.length - shown.length;
  return `${shown.join(', ')}${remaining > 0 ? ` and ${remaining} more` : ''}`;
}

function renderUpstreamReport(result) {
  const { upstream, head, changes } = result;
  const classification = classifyChange(changes.commits, changes.files);
  const commits = changes.commits.slice(0, REPORT_COMMIT_LIMIT);
  const omitted = Math.max(0, changes.totalCommits - commits.length);
  const headUrl = `https://github.com/${upstream.repository}/commit/${head.sha}`;

  const lines = [
    `### [${upstream.repository}](https://github.com/${upstream.repository}) (${upstream.role})`,
    '',
    `- **Head:** [\`${shortSha(head.sha)}\`](${headUrl}) on branch \`${markdown(head.branch)}\``,
    `- **Commits found:** ${changes.totalCommits}`,
    `- **Risk:** ${classification.risk}`,
    `- **Classification:** ${classification.categories.join('; ')}`,
    `- **Recommendation:** ${classification.recommendation}`,
    `- **Files:** ${renderFiles(changes.files)}`,
  ];

  if (changes.warning) lines.push(`- **Warning:** ${markdown(changes.warning)}`);
  lines.push('', ...commits.map(commit => renderCommit(commit, upstream.repository)));
  if (omitted > 0) lines.push(`- _${omitted} additional commit(s) omitted; open the full comparison before integrating._`);

  return lines.join('\n');
}

export function renderReport(results, timestamp = new Date()) {
  return [
    `## Report — ${timestamp.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo', dateStyle: 'medium', timeStyle: 'short' })} BRT`,
    '',
    ...results.flatMap((result, index) => [
      ...(index ? ['---', ''] : []),
      renderUpstreamReport(result),
      '',
    ]),
  ].join('\n').trim();
}

function issueBody(report, state) {
  const policyUrl = `https://github.com/${TARGET_REPOSITORY}/blob/main/.github/UPSTREAM_POLICY.md`;
  return [
    '# Upstream Radar',
    '',
    'Automated dashboard for changes detected in the forks monitored by Platform.',
    '',
    '> The radar never changes code. Every adoption requires human review, a dedicated branch, a pull request, and cross-platform validation.',
    '',
    `[Integration policy and validation checklist](${policyUrl})`,
    '',
    report,
    '',
    '## Next action',
    '',
    'Use the classification for triage. Before applying an item, read the complete upstream diff and check every invariant in the integration policy.',
    '',
    stateMarker(state),
  ].join('\n');
}

async function findRadarIssue() {
  const issues = await github(`/repos/${TARGET_REPOSITORY}/issues?state=all&per_page=100&sort=updated&direction=desc`);
  return issues.find(issue => !issue.pull_request && issue.title === ISSUE_TITLE) || null;
}

async function writeIssue(issue, report, state) {
  const body = issueBody(report, state);

  if (!issue) {
    return github(`/repos/${TARGET_REPOSITORY}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: ISSUE_TITLE, body, labels: [] }),
    });
  }

  await github(`/repos/${TARGET_REPOSITORY}/issues/${issue.number}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body, state: 'open' }),
  });
  await github(`/repos/${TARGET_REPOSITORY}/issues/${issue.number}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: report }),
  });
  return issue;
}

async function run() {
  const dryRun = hasArg('--dry-run');
  const explicitState = process.env.UPSTREAM_STATE ? JSON.parse(process.env.UPSTREAM_STATE) : null;

  if (!dryRun && !TOKEN) {
    throw new Error('GH_TOKEN or GITHUB_TOKEN is required unless --dry-run is used.');
  }

  const issue = dryRun ? null : await findRadarIssue();
  const previousState = explicitState || parseState(issue?.body || '');
  const heads = await Promise.all(UPSTREAMS.map(async upstream => ({
    upstream,
    head: await getUpstreamHead(upstream),
  })));
  const changedHeads = heads.filter(({ upstream, head }) => previousState[upstream.id] !== head.sha);

  if (issue && changedHeads.length === 0) {
    console.log('Upstream Radar: no new commits since the previous run.');
    return;
  }

  const results = await Promise.all(changedHeads.map(async ({ upstream, head }) => {
    const base = previousState[upstream.id];
    const changes = base
      ? await compareChanges(upstream, base, head.sha, head.branch)
      : await getInitialChanges(upstream, head.branch);
    return { upstream, head, changes };
  }));
  const nextState = Object.fromEntries(heads.map(({ upstream, head }) => [upstream.id, head.sha]));
  const report = renderReport(results);

  if (dryRun) {
    console.log(report);
    console.log(`\n${stateMarker(nextState)}`);
    return;
  }

  const savedIssue = await writeIssue(issue, report, nextState);
  console.log(`Upstream Radar updated: ${savedIssue.html_url}`);
}

const isMainModule = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMainModule) {
  run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
