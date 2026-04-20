import fs from "node:fs";
import path from "node:path";
import { buildContextRestorationReadModel } from "../state/context-restoration-read-model.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC } from "../state/generate-state-docs.js";
import {
  resolveArtifactPath,
  resolveArtifactRelativePath,
  resolveGeneratedDocReadPath,
  resolveGeneratedDocRelativePath,
  resolveGeneratedDocWritePaths
} from "../state/harness-paths.js";

const FILES = {
  requirements: "REQUIREMENTS.md",
  architecture: "ARCHITECTURE_GUIDE.md",
  plan: "IMPLEMENTATION_PLAN.md",
  ui: "UI_DESIGN.md",
  packet: "PKT-01_DEV-04_PMW_READ_SURFACE.md",
  active: "codex/project-context/active-state.md",
  preventive: "codex/project-context/preventive-memory.md"
};
const FILE_KEYS = new Map(Object.entries(FILES).map(([key, value]) => [value, key]));
const DOMAINS = ["기준선 정렬", "상태 저장소", "상태 문서·복원", "PMW 읽기 화면", "검증·컷오버", "운영 품질"];

export function buildPmwReadSurface({ store, repoRoot = process.cwd(), outputDir = repoRoot, dbPath, verificationLane = "npm.cmd test", readModel }) {
  const root = path.resolve(repoRoot);
  const out = path.resolve(outputDir);
  const model = readModel ?? buildContextRestorationReadModel({ store, repoRoot: root, outputDir: out });
  const req = read(resolve(FILES.requirements, root, out));
  const plan = read(resolve(FILES.plan, root, out));
  const packet = read(resolve(FILES.packet, root, out));
  const workItems = store.listWorkItems();
  const current = workItems.find((item) => active(item.status)) ?? workItems[0] ?? null;
  const progress = buildProgress(workItems, model);
  const artifacts = buildArtifacts({ root, out, model });
  const generatedDocPaths = [
    ...resolveGeneratedDocWritePaths({ outputDir: out, docName: CURRENT_STATE_DOC }),
    ...resolveGeneratedDocWritePaths({ outputDir: out, docName: TASK_LIST_DOC })
  ];

  return {
    title: "Harness Implementation V1",
    freshness: model.freshness.stale ? { status: "stale", label: "stale snapshot" } : { status: "fresh", label: "fresh snapshot" },
    header: [
      { label: "Current Lane", title: current?.title ?? model.surfaces.currentFocus.headline, body: `${model.releaseState.currentStage} / ${model.releaseState.releaseGateState}` },
      { label: "Next Gate", title: model.surfaces.nextAction.headline, body: model.surfaces.nextAction.supportingText },
      { label: "Return Point", title: "PKT-01 DEV-04", body: model.recentHandoff.status === "ready" ? model.recentHandoff.headline : "DEV-04 packet / 구현 계획 문서로 복귀한다." }
    ],
    overview: {
      initial: "purpose",
      views: {
        purpose: { label: "프로젝트 목적", leftLabel: "추진목적", left: ordered(section(req, "### 추진목적")), rightLabel: "기대효과", right: ordered(section(req, "### 기대효과")), docs: presentPaths(root, out, [FILES.requirements, FILES.active]) },
        approach: { label: "프로젝트 진행 방안", leftLabel: "진행계획", left: ordered(section(plan, "## Phase Plan")), rightLabel: "승인 · 운영 규칙", right: bullets(section(packet, "## Approval Rule")), docs: presentPaths(root, out, [FILES.plan, FILES.ui, FILES.packet]) },
        progress: { label: "프로젝트 진행 현황", summaryLabel: "진행현황 요약", percent: progress.percent, keys: progress.keys, domainLabel: "도메인별 진행현황", domains: progress.domains, docs: presentPaths(root, out, [CURRENT_STATE_DOC, TASK_LIST_DOC, FILES.packet]) }
      }
    },
    cards: [
      card("decision", "결정해야 할 것", model.surfaces.decisionRequired),
      card("issue", "이슈", model.surfaces.blockedAtRisk),
      focusCard(model),
      card("next", "다음 작업", model.surfaces.nextAction)
    ],
    artifacts,
    settings: [
      { label: "workspace / repo path", value: root },
      { label: "DB path", value: dbPath ?? path.resolve(root, ".harness/operating_state.sqlite") },
      { label: "generated docs path", value: [...new Set(generatedDocPaths)].join("\n") },
      { label: "current verification lane", value: verificationLane },
      { label: "manual refresh", value: "브라우저 새로고침으로 snapshot을 다시 읽는다." },
      { label: "source contract summary", value: "strong surface는 read model과 designated summary만 사용한다." }
    ],
    diagnostics: model.diagnostics.slice(0, 6).map((finding) => ({ severity: finding.severity ?? "warning", message: finding.message ?? finding.code ?? "unknown finding" }))
  };
}

function presentPaths(root, out, refs) {
  return refs.filter((item) => exists(item, root, out)).map((item) => displayPath(item, root, out));
}
export function renderPmwHtml(surface) {
  const data = JSON.stringify(surface).replaceAll("<", "\\u003c");
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(surface.title)}</title><style>
body{margin:0;background:#f5f1e8;color:#1f231d;font:14px/1.6 "Segoe UI",sans-serif}main{max-width:1440px;margin:20px auto;padding:18px}.panel,.top{background:#fffcf6;border:1px solid rgba(60,53,40,.12);border-radius:24px;padding:18px;box-shadow:0 12px 30px rgba(54,45,33,.06)}.top{display:grid;grid-template-columns:1.2fr 1fr;gap:16px}.meta,.nav,.cards,.lower,.doc-cols,.keys{display:grid;gap:12px}.meta{grid-template-columns:repeat(3,1fr)}.cards{grid-template-columns:repeat(2,1fr)}.lower{grid-template-columns:1.4fr .8fr;margin-top:16px}.doc-cols{grid-template-columns:repeat(2,1fr)}.chip,.tab,.btn,.badge,.tone{display:inline-flex;align-items:center;justify-content:center;border-radius:999px;font-size:12px;font-weight:700;padding:8px 12px;border:1px solid rgba(60,53,40,.12);background:#fff}.badge.fresh,.tone.done{background:rgba(31,90,73,.09);color:#1f5a49}.badge.stale,.tone.review{background:rgba(139,93,24,.12);color:#8b5d18}.tone.todo,.chip{background:rgba(60,53,40,.07);color:#616760}.tab.active,.btn.active{background:#1f5a49;color:#f8f4eb}.eyebrow{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#616760}.title{font:700 46px/1.02 Georgia,serif;margin:10px 0}.section{margin-top:16px}.head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:14px}.head h2{margin:0;font:700 28px/1.1 Georgia,serif}.card,.meta-card,.box,li.doc,li.setting,li.diag{background:#fff;border:1px solid rgba(60,53,40,.12);border-radius:18px;padding:14px}.card h3{margin:0;font:700 22px/1.15 Georgia,serif}.card{display:grid;gap:12px;min-height:220px}.card[data-tone="decision"]{background:rgba(139,67,49,.06)}.card[data-tone="issue"]{background:rgba(139,93,24,.06)}.card[data-tone="active"]{background:rgba(31,90,73,.05)}.card[data-tone="next"]{background:rgba(60,53,40,.04)}.list,.settings,.diagnostics,.docs,.domain-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}.nav{grid-template-columns:repeat(3,1fr)}.two{display:grid;grid-template-columns:1fr .9fr;gap:12px}.overview-label{font-size:24px;font-weight:800;margin-bottom:12px}.bar{height:10px;background:rgba(60,53,40,.08);border-radius:999px;overflow:hidden}.bar span{display:block;height:100%;background:linear-gradient(90deg,#2c6d59,#88a98f)}.keys{grid-template-columns:repeat(2,1fr)}.domain{display:grid;grid-template-columns:.45fr 1fr;gap:12px;align-items:start}.doc-btn{display:grid;gap:6px;text-align:left;width:100%;background:#fff;border:1px solid rgba(60,53,40,.12);border-radius:16px;padding:12px}.doc-btn.active{background:#1f5a49;color:#fff}.preview{margin-top:14px}.preview h3{margin:0 0 8px;font:700 24px/1.1 Georgia,serif}pre{margin:0;white-space:pre-wrap;font:inherit}.hidden{display:none}@media(max-width:1100px){.top,.lower,.two,.cards,.meta,.doc-cols,.nav,.keys,.domain{grid-template-columns:1fr!important}}</style></head><body><main>
<div class="top"><div><div class="eyebrow">Project Monitor Workspace</div><div class="title">${esc(surface.title)}</div><div style="display:flex;gap:10px;flex-wrap:wrap"><button id="refresh" class="btn" type="button">새로고침</button><span class="badge ${esc(surface.freshness.status)}">${esc(surface.freshness.label)}</span></div></div><div id="meta" class="meta"></div></div>
<section class="panel section"><div class="head"><div><div class="eyebrow">Project Overview</div><h2>프로젝트 개요</h2></div><button id="toggle" class="btn active" type="button">개요 접기</button></div><div id="overview-shell"><div id="nav" class="nav"></div><div id="overview"></div></div></section>
<section class="panel section"><div class="head"><div><div class="eyebrow">Current Situation</div><h2>현재 진행 상황</h2></div><span class="chip">카드 안에서 바로 읽기</span></div><div id="cards" class="cards"></div></section>
<section class="lower"><section class="panel"><div class="head"><div><div class="eyebrow">Artifacts</div><h2>주요 산출물과 계약 문서</h2></div></div><div class="doc-cols"><div><div class="eyebrow">지속 업데이트 문서</div><div id="live" class="docs"></div></div><div><div class="eyebrow">주요 계약 문서</div><div id="contracts" class="docs"></div></div></div><div class="preview box"><div id="artifact-group" class="eyebrow"></div><h3 id="artifact-title"></h3><p id="artifact-summary"></p><ul id="artifact-points" class="list"></ul><div style="margin-top:12px"><span id="artifact-path" class="chip"></span></div></div></section><aside class="panel"><div class="head"><div><div class="eyebrow">Settings</div><h2>설정</h2></div><span class="chip">read only</span></div><ul id="settings" class="settings"></ul><div class="preview box"><div class="eyebrow">진단</div><ul id="diagnostics" class="diagnostics"></ul></div></aside></section>
</main><script id="data" type="application/json">${data}</script><script>
const s = JSON.parse(document.getElementById("data").textContent);
let overviewKey = s.overview.initial;
let artifactKey = s.artifacts.initial;
const q = (selector) => document.querySelector(selector);
function badge(text, className){ const el = document.createElement("span"); el.className = className; el.textContent = text; return el; }
function renderMeta(){ const box = q("#meta"); box.innerHTML = ""; s.header.forEach((item)=>{ const card = document.createElement("div"); card.className = "meta-card"; const eyebrow = document.createElement("div"); eyebrow.className = "eyebrow"; eyebrow.textContent = item.label; const title = document.createElement("strong"); title.textContent = item.title; const body = document.createElement("p"); body.textContent = item.body; card.append(eyebrow, title, body); box.append(card); }); }
function renderOverview(){ const nav = q("#nav"); const box = q("#overview"); nav.innerHTML = ""; box.innerHTML = ""; Object.entries(s.overview.views).forEach(([key, view])=>{ const button = document.createElement("button"); button.type = "button"; button.className = "tab" + (key === overviewKey ? " active" : ""); button.textContent = view.label; button.onclick = ()=>{ overviewKey = key; renderOverview(); }; nav.append(button); }); const view = s.overview.views[overviewKey]; if (overviewKey === "progress") { const top = document.createElement("div"); top.className = "box"; const label = document.createElement("div"); label.className = "overview-label"; label.textContent = view.summaryLabel; const bar = document.createElement("div"); bar.className = "bar"; const span = document.createElement("span"); span.style.width = String(Number(view.percent) || 0) + "%"; bar.append(span); const keys = document.createElement("div"); keys.className = "keys"; view.keys.forEach((item)=>{ const keyBox = document.createElement("div"); keyBox.className = "box"; const strong = document.createElement("strong"); strong.textContent = item.label; const value = document.createElement("div"); value.textContent = item.value; keyBox.append(strong, value); keys.append(keyBox); }); top.append(label, bar, keys); const bottom = document.createElement("div"); bottom.className = "box"; bottom.style.marginTop = "12px"; const domainLabel = document.createElement("div"); domainLabel.className = "overview-label"; domainLabel.textContent = view.domainLabel; const domainList = document.createElement("ul"); domainList.className = "domain-list"; view.domains.forEach((item)=>{ const li = document.createElement("li"); li.className = "domain"; const left = document.createElement("div"); left.style.display = "flex"; left.style.gap = "8px"; left.style.flexWrap = "wrap"; const name = document.createElement("strong"); name.textContent = item.label; left.append(name, badge(item.statusLabel, "tone " + item.tone)); const note = document.createElement("div"); note.textContent = item.note; li.append(left, note); domainList.append(li); }); const docs = document.createElement("div"); docs.style.marginTop = "12px"; docs.style.display = "flex"; docs.style.gap = "8px"; docs.style.flexWrap = "wrap"; view.docs.forEach((doc)=>docs.append(badge(doc, "chip"))); bottom.append(domainLabel, domainList, docs); box.append(top, bottom); return; } const grid = document.createElement("div"); grid.className = "two"; const left = document.createElement("div"); left.className = "box"; const leftLabel = document.createElement("div"); leftLabel.className = "overview-label"; leftLabel.textContent = view.leftLabel; const leftList = document.createElement("ul"); leftList.className = "list"; view.left.forEach((item)=>{ const li = document.createElement("li"); li.className = "doc"; li.textContent = item; leftList.append(li); }); left.append(leftLabel, leftList); const right = document.createElement("div"); right.className = "box"; const rightLabel = document.createElement("div"); rightLabel.className = "overview-label"; rightLabel.textContent = view.rightLabel; const rightList = document.createElement("ul"); rightList.className = "list"; view.right.forEach((item)=>{ const li = document.createElement("li"); li.className = "doc"; li.textContent = item; rightList.append(li); }); const docs = document.createElement("div"); docs.style.marginTop = "12px"; docs.style.display = "flex"; docs.style.gap = "8px"; docs.style.flexWrap = "wrap"; view.docs.forEach((doc)=>docs.append(badge(doc, "chip"))); right.append(rightLabel, rightList, docs); grid.append(left, right); box.append(grid); }
function renderCards(){ const box = q("#cards"); box.innerHTML = ""; s.cards.forEach((item)=>{ const card = document.createElement("article"); card.className = "card"; card.dataset.tone = item.tone; const top = document.createElement("div"); top.style.display = "flex"; top.style.justifyContent = "space-between"; top.style.gap = "8px"; top.append(badge(item.tone, "badge " + item.tone)); const eyebrow = document.createElement("div"); eyebrow.className = "eyebrow"; eyebrow.textContent = item.label; top.append(eyebrow); const title = document.createElement("h3"); title.textContent = item.title; const summary = document.createElement("p"); summary.textContent = item.summary; const list = document.createElement("ul"); list.className = "list"; item.points.forEach((point)=>{ const li = document.createElement("li"); li.className = "doc"; li.textContent = point; list.append(li); }); const docs = document.createElement("div"); docs.style.display = "flex"; docs.style.gap = "8px"; docs.style.flexWrap = "wrap"; item.docs.forEach((doc)=>docs.append(badge(doc, "chip"))); card.append(top, title, summary, list, docs); box.append(card); }); }
function renderArtifactButtons(target, items){ target.innerHTML = ""; items.forEach((item)=>{ const button = document.createElement("button"); button.type = "button"; button.className = "doc-btn" + (item.key === artifactKey ? " active" : ""); button.onclick = ()=>{ artifactKey = item.key; renderArtifacts(); renderArtifact(); }; const title = document.createElement("strong"); title.textContent = item.title; const summary = document.createElement("span"); summary.textContent = item.summary; button.append(title, summary); target.append(button); }); }
function renderArtifacts(){ renderArtifactButtons(q("#live"), s.artifacts.live); renderArtifactButtons(q("#contracts"), s.artifacts.contracts); }
function renderArtifact(){ const item = s.artifacts.byKey[artifactKey]; q("#artifact-group").textContent = item.group; q("#artifact-title").textContent = item.title; q("#artifact-summary").textContent = item.summary; const points = q("#artifact-points"); points.innerHTML = ""; item.points.forEach((point)=>{ const li = document.createElement("li"); li.className = "doc"; li.textContent = point; points.append(li); }); q("#artifact-path").textContent = item.path; }
function renderSettings(){ const settings = q("#settings"); settings.innerHTML = ""; s.settings.forEach((item)=>{ const li = document.createElement("li"); li.className = "setting"; const strong = document.createElement("strong"); strong.textContent = item.label; const pre = document.createElement("pre"); pre.textContent = item.value; li.append(strong, pre); settings.append(li); }); const diagnostics = q("#diagnostics"); diagnostics.innerHTML = ""; (s.diagnostics.length ? s.diagnostics : [{ severity: "info", message: "활성 진단 항목이 없다." }]).forEach((item)=>{ const li = document.createElement("li"); li.className = "diag"; const strong = document.createElement("strong"); strong.textContent = item.severity; const body = document.createElement("div"); body.textContent = item.message; li.append(strong, body); diagnostics.append(li); }); }
q("#refresh").onclick = ()=>location.reload(); q("#toggle").onclick = ()=>{ const box = q("#overview-shell"); const btn = q("#toggle"); const hidden = box.classList.toggle("hidden"); btn.textContent = hidden ? "개요 펼치기" : "개요 접기"; btn.classList.toggle("active", !hidden); };
renderMeta(); renderOverview(); renderCards(); renderArtifacts(); renderArtifact(); renderSettings();
</script></body></html>`;
}

function buildProgress(workItems, model) {
  const groups = new Map(DOMAINS.map((label) => [label, []]));
  const extra = [];
  for (const item of workItems) (groups.get(item.domainHint) ?? extra).push(item);
  const domains = DOMAINS.map((label) => summarize(label, groups.get(label)));
  if (extra.length) domains.push(summarize("미분류", extra));
  const done = workItems.filter((item) => doneStatus(item.status)).length;
  const percent = workItems.length ? Math.round((done / workItems.length) * 100) : 0;
  return { percent, domains, keys: [{ label: "진척률", value: workItems.length ? `약 ${percent}%` : "등록된 work item 없음" }, { label: "주요 결과", value: domains.filter((item) => item.tone === "done").map((item) => item.label).slice(0, 3).join(", ") || "완료된 도메인이 아직 없다." }, { label: "현재 게이트", value: model.surfaces.nextAction.headline }, { label: "진행 중 도메인", value: domains.filter((item) => item.tone === "review").map((item) => item.label).slice(0, 3).join(", ") || "현재 진행 중인 도메인이 없다." }] };
}
function summarize(label, items = []) { if (!items.length) return { label, statusLabel: "미착수", tone: "todo", note: "해당 도메인 work item이 아직 없다." }; const done = items.filter((item) => doneStatus(item.status)).length, reviewing = items.filter((item) => active(item.status)).length, tone = done === items.length ? "done" : reviewing ? "review" : "todo", statusLabel = done === items.length ? "완료" : reviewing ? "진행 중" : "대기", note = items.slice(0, 2).map((item) => `${item.title}${item.nextAction ? `: ${item.nextAction}` : ""}`).join(" · "); return { label, statusLabel, tone, note }; }
function card(tone, label, surface) { return { tone, label, title: surface.headline, summary: surface.supportingText ?? "needs source", points: points(surface), docs: docs(surface.sourceTrace) }; }
function focusCard(model) { const detail = model.surfaces.currentFocus.detail ?? {}; const pointsList = [detail.currentStage && `현재 stage: ${detail.currentStage}`, detail.releaseGateState && `gate state: ${detail.releaseGateState}`, detail.releaseGoal && `release goal: ${detail.releaseGoal}`].filter(Boolean); return { tone: "active", label: "지금 진행 중인 작업", title: model.surfaces.currentFocus.headline, summary: model.surfaces.currentFocus.supportingText ?? "현재 focus source를 확인한다.", points: pointsList.length ? pointsList : points(model.surfaces.currentFocus), docs: docs(model.surfaces.currentFocus.sourceTrace) }; }
function points(surface) { const values = surface.items?.map((item) => item.title ?? item.nextAction ?? item.id) ?? surface.summaryLines?.slice(1) ?? [surface.supportingText ?? "추가 detail이 없다."]; return values.filter(Boolean).slice(0, 3); }
function docs(trace = []) { const values = trace.map((item) => item.path).filter(Boolean).slice(0, 3); return values.length ? values : ["needs source"]; }
function buildArtifacts({ root, out, model }) {
  const live = [
    fileArtifact("active-state", "Active State", "지속 업데이트 문서", FILES.active, root, out),
    model.recentHandoff.status === "ready"
      ? {
          key: "latest-handoff",
          title: "Latest Handoff",
          group: "지속 업데이트 문서",
          path: model.recentHandoff.sourceTrace[0]?.path ?? "handoff_log",
          summary: model.recentHandoff.headline,
          points: [`created at: ${model.recentHandoff.createdAt ?? "unknown"}`]
        }
      : null,
    fileArtifact("current-state", "CURRENT_STATE", "지속 업데이트 문서", CURRENT_STATE_DOC, root, out),
    fileArtifact("task-list", "TASK_LIST", "지속 업데이트 문서", TASK_LIST_DOC, root, out),
    fileArtifact("preventive-memory", "Preventive Memory", "지속 업데이트 문서", FILES.preventive, root, out)
  ].filter(Boolean);
  const contracts = [
    fileArtifact("requirements", "REQUIREMENTS", "주요 계약 문서", FILES.requirements, root, out),
    fileArtifact("architecture", "ARCHITECTURE GUIDE", "주요 계약 문서", FILES.architecture, root, out),
    fileArtifact("implementation-plan", "IMPLEMENTATION PLAN", "주요 계약 문서", FILES.plan, root, out),
    fileArtifact("ui-design", "UI DESIGN", "주요 계약 문서", FILES.ui, root, out),
    fileArtifact("dev04-packet", "DEV-04 Packet", "주요 계약 문서", FILES.packet, root, out)
  ].filter(Boolean);
  const byKey = Object.fromEntries([...live, ...contracts].map((item) => [item.key, item]));
  return { initial: live[0]?.key ?? contracts[0]?.key ?? null, live, contracts, byKey };
}

function fileArtifact(key, fallbackTitle, group, rel, root, out) {
  const file = resolve(rel, root, out);
  const text = read(file);
  return {
    key,
    title: docTitle(text) ?? fallbackTitle,
    group,
    path: displayPath(rel, root, out),
    summary: summary(text),
    points: preview(text)
  };
}

function resolve(rel, root, out) {
  if (rel === CURRENT_STATE_DOC || rel === TASK_LIST_DOC) {
    return resolveGeneratedDocReadPath({ outputDir: out, docName: rel });
  }
  const key = FILE_KEYS.get(rel);
  return key ? resolveArtifactPath(root, key) : path.resolve(root, rel);
}

function displayPath(rel, root, out) {
  if (rel === CURRENT_STATE_DOC || rel === TASK_LIST_DOC) {
    return resolveGeneratedDocRelativePath({ repoRoot: root, outputDir: out, docName: rel });
  }
  const key = FILE_KEYS.get(rel);
  return key ? resolveArtifactRelativePath(root, key) : rel;
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

function exists(rel, root, out) {
  return fs.existsSync(resolve(rel, root, out));
}

function section(text, heading) {
  if (!text) return null;
  const normalized = text.replace(/\r\n/g, "\n");
  const match = new RegExp(`(?:^|\\n)${escapeRegExp(heading)}(?:\\n|$)`).exec(normalized);
  if (!match) return null;
  const offset = match[0].startsWith("\n") ? 1 : 0;
  const rest = normalized.slice(match.index + offset + heading.length).trimStart();
  const next = rest.search(/\n##\s+|\n###\s+/);
  return (next === -1 ? rest : rest.slice(0, next)).trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function ordered(text) {
  return list(text, /^\d+\.\s+/);
}

function bullets(text) {
  return list(text, /^-\s+/);
}

function list(text, pattern) {
  return (text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => pattern.test(line))
    .map((line) => line.replace(pattern, "").trim());
}

function docTitle(text) {
  const hit = (text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith("# "));
  return hit ? hit.slice(2).trim() : null;
}

function summary(text) {
  return first(section(text, "## Summary"))
    ?? first(section(text, "## Purpose"))
    ?? first(section(text, "## 1. Goal"))
    ?? first(text)
    ?? "파일이 아직 생성되지 않았다.";
}

function preview(text) {
  const items = list(text, /^(?:-\s+|\d+\.\s+)/).slice(0, 3);
  if (items.length) return items;
  const headings = (text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .slice(0, 3)
    .map((line) => line.replace(/^#{2,3}\s+/, ""));
  return headings.length ? headings : ["preview point가 아직 없다."];
}

function first(text) {
  const line = (text ?? "")
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .find((entry) => entry && !entry.startsWith("#") && !entry.startsWith("|") && !entry.startsWith("```"));
  return line ? line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "").trim() : null;
}

function doneStatus(status) {
  return ["done", "completed", "closed", "released"].includes(String(status));
}

function active(status) {
  return ["in_progress", "implementation", "coding", "testing", "review"].includes(String(status));
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
