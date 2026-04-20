import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { createOperatingStateStore } from '../src/state/operating-state-store.js';
import { writeGeneratedStateDocs } from '../src/state/generate-state-docs.js';
import { buildPmwReadSurface } from '../src/pmw/read-surface.js';
import { createPmwServer } from '../src/pmw/server.js';

test('buildPmwReadSurface assembles overview, cards, and artifacts from standardized harness sources', () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pmw-surface-'));
  seedRepo(repoRoot);
  const store = createOperatingStateStore({
    dbPath: path.join(repoRoot, '.harness', 'operating_state.sqlite'),
    now: createClock('2026-04-19T10:00:00.000Z')
  });

  store.setReleaseState({
    currentStage: 'implementation',
    releaseGateState: 'open',
    currentFocus: 'DEV-04 PMW read surface 구현',
    releaseGoal: 'First ship baseline',
    sourceRef: '.agents/artifacts/REQUIREMENTS.md'
  });
  store.recordDecision({
    decisionId: 'DEC-04',
    title: 'PMW read surface runtime 시작',
    decisionNeeded: true,
    impactSummary: 'DEV-04 code start gate',
    sourceRef: 'reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md'
  });
  store.recordGateRisk({
    riskId: 'RISK-04',
    title: 'browser comprehension check는 아직 미검증',
    severity: 'medium',
    sourceRef: 'reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md'
  });
  store.upsertWorkItem({
    workItemId: 'DEV-01',
    title: 'DB foundation',
    status: 'done',
    nextAction: 'none',
    domainHint: '상태 저장소',
    sourceRef: '.agents/artifacts/IMPLEMENTATION_PLAN.md'
  });
  store.upsertWorkItem({
    workItemId: 'DEV-03',
    title: 'context restoration read model',
    status: 'done',
    nextAction: 'none',
    domainHint: '상태 문서·복원',
    sourceRef: '.agents/artifacts/IMPLEMENTATION_PLAN.md'
  });
  store.upsertWorkItem({
    workItemId: 'DEV-04',
    title: 'PMW read surface',
    status: 'in_progress',
    nextAction: 'Start local read-only PMW shell implementation',
    domainHint: 'PMW 읽기 화면',
    sourceRef: 'reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md'
  });
  store.appendHandoff({
    handoffId: 'handoff-04',
    handoffSummary: 'DEV-04 mockup approved, code implementation may start.',
    sourceRef: 'reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md'
  });

  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  const surface = buildPmwReadSurface({ store, repoRoot, outputDir: repoRoot });
  store.close();

  assert.equal(surface.title, 'Harness Implementation V1');
  assert.equal(surface.header[0].title, 'PMW read surface');
  assert.equal(surface.overview.views.purpose.left[0], 'hot-state 변경은 하나의 write surface만 수정하게 만든다.');
  assert.equal(surface.overview.views.approach.right[0], '이 packet은 PMW UI 코드 구현 전에 작성한다.');
  assert.equal(surface.cards.length, 4);
  assert.equal(surface.cards[0].title, 'PMW read surface runtime 시작');
  assert.equal(surface.overview.views.progress.rows[0].id, 'PLN-00');
  assert.equal(surface.overview.views.progress.rows.some((item) => item.id === 'DEV-04' && item.tone === 'review'), true);
  assert.equal(surface.overview.views.progress.domains.some((item) => item.label === 'PMW 읽기 화면' && item.tone === 'review'), true);
  assert.equal(surface.artifacts.byKey['requirements'].path, '.agents/artifacts/REQUIREMENTS.md');
  assert.equal(surface.artifacts.byKey['project-progress'].path, '.agents/artifacts/PROJECT_PROGRESS.md');
  assert.equal(surface.artifacts.byKey['ui-design'].path, 'reference/artifacts/UI_DESIGN.md');
  assert.equal(surface.artifacts.byKey['dev04-packet'].path, 'reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md');
  assert.equal(surface.artifacts.byKey['current-state'].path, '.agents/runtime/generated-state-docs/CURRENT_STATE.md');
  assert.equal(surface.artifacts.byKey['latest-handoff'].summary, 'DEV-04 mockup approved, code implementation may start.');
});

test('createPmwServer serves HTML and JSON read surface responses from standardized paths', async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pmw-server-'));
  seedRepo(repoRoot);
  const dbPath = path.join(repoRoot, '.harness', 'operating_state.sqlite');
  const store = createOperatingStateStore({ dbPath, now: createClock('2026-04-19T11:00:00.000Z') });
  store.setReleaseState({
    currentStage: 'implementation',
    releaseGateState: 'open',
    currentFocus: 'DEV-04 PMW read surface 구현',
    releaseGoal: 'First ship baseline',
    sourceRef: '.agents/artifacts/REQUIREMENTS.md'
  });
  store.recordDecision({
    decisionId: 'DEC-04',
    title: 'PMW shell route를 연다',
    decisionNeeded: true,
    impactSummary: 'HTML entrypoint를 연다',
    sourceRef: 'reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md'
  });
  store.upsertWorkItem({
    workItemId: 'DEV-04',
    title: 'PMW read surface',
    status: 'in_progress',
    nextAction: 'Serve PMW shell over local http',
    domainHint: 'PMW 읽기 화면',
    sourceRef: 'reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md'
  });
  writeGeneratedStateDocs({ store, outputDir: repoRoot });
  store.close();

  const server = createPmwServer({ repoRoot, outputDir: repoRoot, dbPath });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  const html = await fetch(`http://127.0.0.1:${port}/`).then((res) => res.text());
  const json = await fetch(`http://127.0.0.1:${port}/api/read-surface`).then((res) => res.json());

  assert.match(html, /Harness Implementation V1/);
  assert.match(html, /현재 진행 상황/);
  assert.match(html, /전체 작업표/);
  assert.equal(json.cards.length, 4);
  assert.equal(json.overview.views.progress.label, '프로젝트 진행 현황');
  assert.equal(json.overview.views.progress.rows.some((item) => item.id === 'DEV-04'), true);
  assert.equal(json.artifacts.byKey['requirements'].path, '.agents/artifacts/REQUIREMENTS.md');

  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

function seedRepo(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, '.agents', 'artifacts'), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, 'reference', 'artifacts'), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, 'reference', 'packets'), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, '.agents', 'artifacts', 'REQUIREMENTS.md'), `# Requirements\n\n## Summary\nPMW first view에서 현재 판단 지점을 빠르게 읽게 만든다.\n\n## Project Goal\n\n### 추진목적\n1. hot-state 변경은 하나의 write surface만 수정하게 만든다.\n2. PMW에서 파일 탐색 없이 필요한 artifact를 읽게 만든다.\n\n### 기대효과\n1. 상태 변경 시 수정 비용과 정합도 유지 비용을 줄인다.\n2. 최종사용자가 첫 화면에서 지금 판단해야 할 내용과 다음 행동을 빠르게 이해한다.\n`, 'utf8');
  fs.writeFileSync(path.join(repoRoot, '.agents', 'artifacts', 'IMPLEMENTATION_PLAN.md'), `# Implementation Plan\n\n## Summary\nDEV-04 PMW read surface를 구현한다.\n\n## Phase Plan\n1. deep interview로 requirements 핵심 이슈 폐쇄\n2. 사용자 final confirmation으로 baseline requirements freeze\n3. architecture / implementation / UI 문서 sync\n\n## Operator Next Action\n- Start local read-only PMW shell implementation.\n- Keep the shell sourced from the approved read model.\n`, 'utf8');
  fs.writeFileSync(path.join(repoRoot, '.agents', 'artifacts', 'PROJECT_PROGRESS.md'), `# Project Progress\n\n## Summary\nTrack the whole standardized harness build in one place.\n\n## Progress Board\n| Phase | Task ID | Task | Status | Notes | Source |\n| --- | --- | --- | --- | --- | --- |\n| Planning | PLN-00 | Deep interview | done | Requirements baseline closed. | reference/planning/PLN-00_DEEP_INTERVIEW.md |\n| Build | DEV-04 | PMW read surface | in_progress | Shell implementation is in progress. | reference/packets/PKT-01_DEV-04_PMW_READ_SURFACE.md |\n`, 'utf8');
  fs.writeFileSync(path.join(repoRoot, 'reference', 'packets', 'PKT-01_DEV-04_PMW_READ_SURFACE.md'), `# DEV-04\n\n## Purpose\nPMW first view를 overview, 4-card grid, artifact preview로 읽게 만든다.\n\n## Approval Rule\n- 이 packet은 PMW UI 코드 구현 전에 작성한다.\n- 이 작업은 사용자가 직접 체감하는 프로그램 기능과 UI/UX를 포함하므로 human sign-off 없이 Ready For Code로 올리지 않는다.\n- mockup direction이 바뀌면 이 packet을 다시 연다.\n\n## Program Function Detail\n- 입력: \`.agents/artifacts/REQUIREMENTS.md > ## Summary\`, \`.agents/artifacts/IMPLEMENTATION_PLAN.md > ## Operator Next Action\`\n`, 'utf8');
  fs.writeFileSync(path.join(repoRoot, '.agents', 'artifacts', 'ARCHITECTURE_GUIDE.md'), '# Architecture\n\n## Summary\nDB truth + Markdown truth + generated docs + read-only PMW\n', 'utf8');
  fs.writeFileSync(path.join(repoRoot, 'reference', 'artifacts', 'UI_DESIGN.md'), '# UI Design\n\n## Summary\ncompact 4-card rail과 lower document preview를 유지한다.\n', 'utf8');
  fs.writeFileSync(path.join(repoRoot, '.agents', 'artifacts', 'PREVENTIVE_MEMORY.md'), '# Preventive Memory\n\n- keep strong surface on approved source only\n', 'utf8');
  fs.writeFileSync(path.join(repoRoot, '.agents', 'artifacts', 'CURRENT_STATE.md'), '# Current State\n\n## Snapshot\n- DEV-04 implementation in progress.\n', 'utf8');
  fs.writeFileSync(path.join(repoRoot, '.agents', 'artifacts', 'TASK_LIST.md'), '# Task List\n\n## Active Tasks\n- DEV-04 active.\n', 'utf8');
}

function createClock(startIso) {
  let offset = 0;
  const base = Date.parse(startIso);
  return () => new Date(base + offset++ * 1000).toISOString();
}
