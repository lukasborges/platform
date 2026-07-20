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
    role: 'primário',
  },
  {
    id: 'mathijs',
    repository: 'Mathijs003/station-app',
    role: 'secundário',
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
    category: 'Conflito com a política do Platform',
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
    category: 'Autenticação ou segurança',
    risk: 4,
    patterns: [/auth/i, /oauth/i, /credential/i, /certificate/i, /security/i, /permission/i],
  },
  {
    category: 'Runtime Electron/IPC',
    risk: 4,
    patterns: [/electron/i, /webcontents/i, /webview/i, /\bipc\b/i, /user.?agent/i, /session/i],
  },
  {
    category: 'Persistência ou migração',
    risk: 4,
    patterns: [/persist/i, /migration/i, /database/i, /sequelize/i, /storage/i, /partition/i],
  },
  {
    category: 'Build, pacote ou dependências',
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
    category: 'Interface ou experiência de uso',
    risk: 2,
    patterns: [/\.s?css$/i, /component/i, /toolbar/i, /quick.?switch/i, /dock/i, /icon/i, /logo/i, /theme/i, /ui\b/i],
  },
  {
    category: 'App Store ou aplicações',
    risk: 2,
    patterns: [/app.?store/i, /manifest/i, /application/i, /recipe/i],
  },
  {
    category: 'Identidade do produto',
    risk: 3,
    patterns: [/rebrand/i, /branding/i, /station.?logo/i, /product.?name/i],
    branding: true,
  },
  {
    category: 'Testes ou documentação',
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
      categories: ['Testes ou documentação'],
      conflict: false,
      recommendation: 'Candidato a cherry-pick com `-x` se o commit for pequeno e isolado.',
      risk: 'baixo',
    };
  }

  const matches = RULES.filter(rule => rule.patterns.some(pattern => pattern.test(haystack)));
  const conflict = matches.some(rule => rule.conflict);
  const branding = matches.some(rule => rule.branding);
  const riskScore = Math.max(1, ...matches.map(rule => rule.risk));
  const risk = riskScore >= 4 ? 'alto' : riskScore === 3 ? 'médio-alto' : riskScore === 2 ? 'médio' : 'baixo';
  const categories = matches.length
    ? matches.map(rule => rule.category)
    : ['Mudança geral; requer inspeção manual'];

  let recommendation;
  if (conflict) {
    recommendation = 'Rejeitar o comportamento conflitante. Se houver partes úteis no mesmo commit, reimplementar somente essas partes.';
  } else if (branding) {
    recommendation = 'Reimplementar preservando nome, logos, links e pacotes do Platform.';
  } else if (riskScore >= 4) {
    recommendation = 'Revisar em profundidade e preferir reimplementação; exige a validação completa antes de integrar.';
  } else if (riskScore >= 2) {
    recommendation = 'Candidato a adoção após revisar o diff e validar as personalizações do Platform.';
  } else {
    recommendation = 'Candidato a cherry-pick com `-x` se o commit for pequeno e isolado.';
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
    warning: 'Baseline inicial: os commits recentes são exibidos para triagem, mas não representam alterações novas desde uma execução anterior.',
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
        ? 'O histórico divergiu desde o último SHA; revise a comparação manualmente.'
        : null,
    };
  } catch (error) {
    if (![404, 409, 422].includes(error.status)) throw error;

    const fallback = await getInitialChanges(upstream, branch);
    return {
      ...fallback,
      baseline: false,
      warning: `Não foi possível comparar com ${shortSha(base)} (histórico reescrito ou SHA removido). Exibindo os commits mais recentes.`,
    };
  }
}

function renderCommit(commit, repository) {
  const sha = commit.sha;
  const subject = (commit.commit?.message || commit.message || 'Sem mensagem').split('\n')[0];
  const author = commit.author?.login || commit.commit?.author?.name || 'autor desconhecido';
  const url = commit.html_url || `https://github.com/${repository}/commit/${sha}`;
  return `- [\`${shortSha(sha)}\`](${url}) ${markdown(subject)} — ${markdown(author)}`;
}

function renderFiles(files) {
  if (!files.length) return 'não disponíveis no levantamento inicial';
  const shown = files.slice(0, 12).map(file => `\`${markdown(file.filename || file)}\``);
  const remaining = files.length - shown.length;
  return `${shown.join(', ')}${remaining > 0 ? ` e mais ${remaining}` : ''}`;
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
    `- **Head:** [\`${shortSha(head.sha)}\`](${headUrl}) na branch \`${markdown(head.branch)}\``,
    `- **Commits encontrados:** ${changes.totalCommits}`,
    `- **Risco:** ${classification.risk}`,
    `- **Classificação:** ${classification.categories.join('; ')}`,
    `- **Recomendação:** ${classification.recommendation}`,
    `- **Arquivos:** ${renderFiles(changes.files)}`,
  ];

  if (changes.warning) lines.push(`- **Atenção:** ${markdown(changes.warning)}`);
  lines.push('', ...commits.map(commit => renderCommit(commit, upstream.repository)));
  if (omitted > 0) lines.push(`- _Mais ${omitted} commit(s) omitido(s); abra a comparação completa antes de integrar._`);

  return lines.join('\n');
}

export function renderReport(results, timestamp = new Date()) {
  return [
    `## Relatório de ${timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
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
    'Painel automático das novidades nos forks acompanhados pelo Platform.',
    '',
    '> O radar não altera código. Toda adoção exige revisão humana, branch dedicada, pull request e validação multiplataforma.',
    '',
    `[Política de integração e checklist](${policyUrl})`,
    '',
    report,
    '',
    '## Próxima ação',
    '',
    'Use a classificação como triagem. Antes de aplicar qualquer item, leia o diff upstream completo e confira os invariantes descritos na política.',
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
    console.log('Upstream Radar: nenhum commit novo desde a última execução.');
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
  console.log(`Upstream Radar atualizado: ${savedIssue.html_url}`);
}

const isMainModule = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMainModule) {
  run().catch(error => {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  });
}
