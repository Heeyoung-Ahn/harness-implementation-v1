import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

import {
  addProject,
  archiveProject,
  loadRegistry,
  readProjectReadModel,
  registryPath,
  removeProject,
  selectProject
} from "./project-registry.js";

export function createPmwMonitorServer({ host = "127.0.0.1", port = 4174 } = {}) {
  const commandSessions = new Map();
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? `${host}:${port}`}`);
      if (req.method === "GET" && url.pathname === "/api/projects") {
        return json(res, buildProjectsPayload(undefined, commandSessions));
      }
      if (req.method === "GET" && url.pathname === "/api/read-model") {
        const payload = buildProjectsPayload(url.searchParams.get("project"), commandSessions);
        return json(res, payload);
      }
      if (req.method === "GET" && url.pathname === "/api/artifact") {
        const payload = buildArtifactPayload({
          projectId: url.searchParams.get("project"),
          artifactPath: url.searchParams.get("path")
        });
        return json(res, payload);
      }
      if (req.method === "POST" && url.pathname === "/api/commands/run") {
        const body = await readJsonBody(req);
        const payload = await runPhaseOneCommand({
          projectId: body.projectId,
          commandId: body.commandId,
          commandSessions
        });
        return json(res, payload);
      }
      if (req.method === "POST" && url.pathname === "/api/projects/add") {
        const body = await readJsonBody(req);
        return json(res, addProject({ repoRoot: body.repoRoot, name: body.name }));
      }
      if (req.method === "POST" && url.pathname === "/api/projects/select") {
        const body = await readJsonBody(req);
        return json(res, selectProject(body.projectId));
      }
      if (req.method === "POST" && url.pathname === "/api/projects/archive") {
        const body = await readJsonBody(req);
        return json(res, archiveProject(body.projectId));
      }
      if (req.method === "POST" && url.pathname === "/api/projects/remove") {
        const body = await readJsonBody(req);
        return json(res, removeProject(body.projectId));
      }
      if (url.pathname !== "/") {
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        return res.end("Not Found");
      }
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(renderHtml());
    } catch (error) {
      res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, message: error instanceof Error ? error.message : "unknown PMW error" }));
    }
  });
}

function resolveSelectedProject(registry, requestedProjectId) {
  return (
    registry.projects.find((item) => item.id === requestedProjectId) ??
    registry.projects.find((item) => item.id === registry.selectedProjectId) ??
    registry.projects.find((item) => item.status === "active") ??
    null
  );
}

const APPROVED_PHASE_ONE_COMMANDS = {
  status: {
    command: "npm run harness:status",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "harness:status"]
  },
  next: {
    command: "npm run harness:next",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "harness:next"]
  },
  explain: {
    command: "npm run harness:explain",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "harness:explain"]
  },
  validate: {
    command: "npm run harness:validate",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "harness:validate"]
  },
  handoff: {
    command: "npm run harness:handoff",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "harness:handoff"]
  },
  "pmw-export": {
    command: "npm run harness:pmw-export",
    executable: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["run", "harness:pmw-export"]
  }
};

function buildProjectsPayload(requestedProjectId, commandSessions = new Map()) {
  const registry = loadRegistry();
  const selectedProject = resolveSelectedProject(registry, requestedProjectId);
  const readModel = readProjectReadModel(selectedProject);
  return {
    ok: true,
    registryPath: registryPath(),
    selectedProjectId: selectedProject?.id ?? null,
    projects: registry.projects,
    readModel,
    commandSession: selectedProject ? getCommandSession(commandSessions, selectedProject.id) : createEmptyCommandSession()
  };
}

function buildArtifactPayload({ projectId, artifactPath }) {
  const registry = loadRegistry();
  const selectedProject = resolveSelectedProject(registry, projectId);
  if (!selectedProject) {
    return { ok: false, message: "No selected project." };
  }
  if (!artifactPath) {
    return { ok: false, message: "Artifact path is required." };
  }

  const absolutePath = path.resolve(selectedProject.repoRoot, artifactPath);
  const repoRoot = path.resolve(selectedProject.repoRoot);
  if (!isPathInside(repoRoot, absolutePath)) {
    return { ok: false, message: `Artifact path escapes the selected project: ${artifactPath}` };
  }
  if (!fs.existsSync(absolutePath)) {
    return { ok: false, message: `Artifact not found: ${artifactPath}` };
  }

  const raw = fs.readFileSync(absolutePath, "utf8");
  const maxChars = 12000;
  return {
    ok: true,
    path: artifactPath,
    preview: raw.slice(0, maxChars),
    truncated: raw.length > maxChars
  };
}

function isPathInside(parentPath, candidatePath) {
  const relativePath = path.relative(parentPath, candidatePath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith(`..${path.sep}`) && relativePath !== ".." && !path.isAbsolute(relativePath))
  );
}

async function runPhaseOneCommand({ projectId, commandId, commandSessions }) {
  const registry = loadRegistry();
  const selectedProject = resolveSelectedProject(registry, projectId);
  if (!selectedProject) {
    return { ok: false, message: "No selected project." };
  }

  const readModel = readProjectReadModel(selectedProject);
  const phaseOneCommands = readModel?.context?.operatorCommands?.phaseOne ?? [];
  const commandContract = phaseOneCommands.find((command) => command.id === commandId);
  if (!commandContract) {
    return { ok: false, message: `Command is not in the approved PMW launcher scope: ${commandId}` };
  }

  const approved = APPROVED_PHASE_ONE_COMMANDS[commandId];
  if (!approved || approved.command !== commandContract.command) {
    return {
      ok: false,
      message: `Command contract mismatch for ${commandId}. PMW only launches the approved phase-1 command catalog.`
    };
  }

  const session = getCommandSession(commandSessions, selectedProject.id);
  if (session.running) {
    return {
      ok: false,
      message: `Another PMW command is already running for ${selectedProject.name}. Wait until it finishes.`,
      commandSession: session
    };
  }

  const runId = `run-${Date.now()}`;
  const entry = {
    runId,
    commandId,
    label: commandContract.label,
    command: commandContract.command,
    sideEffect: commandContract.sideEffect ?? "unknown",
    status: "running",
    startedAt: new Date().toISOString(),
    finishedAt: null,
    exitCode: null,
    summary: `${commandContract.label} is running.`,
    stdout: "",
    stderr: ""
  };
  session.running = true;
  session.projectId = selectedProject.id;
  session.projectName = selectedProject.name;
  session.repoRoot = selectedProject.repoRoot;
  session.entries.unshift(entry);
  session.entries = session.entries.slice(0, 12);
  commandSessions.set(selectedProject.id, session);

  const spawnCommand =
    process.platform === "win32"
      ? {
          executable: "cmd.exe",
          args: ["/d", "/s", "/c", approved.executable, ...approved.args]
        }
      : {
          executable: approved.executable,
          args: approved.args
        };

  const child = spawn(spawnCommand.executable, spawnCommand.args, {
    cwd: selectedProject.repoRoot,
    shell: false,
    windowsHide: true
  });

  child.stdout?.setEncoding("utf8");
  child.stderr?.setEncoding("utf8");
  child.stdout?.on("data", (chunk) => {
    entry.stdout = appendLimited(entry.stdout, chunk);
  });
  child.stderr?.on("data", (chunk) => {
    entry.stderr = appendLimited(entry.stderr, chunk);
  });
  child.on("error", (error) => {
    entry.status = "failed";
    entry.finishedAt = new Date().toISOString();
    entry.summary = `${commandContract.label} failed to start.`;
    entry.stderr = appendLimited(entry.stderr, error.message);
    session.running = false;
  });
  child.on("close", (code) => {
    entry.exitCode = code;
    entry.finishedAt = new Date().toISOString();
    entry.status = code === 0 ? "success" : "failed";
    entry.summary =
      code === 0
        ? `${commandContract.label} completed successfully.`
        : `${commandContract.label} failed with exit code ${code}.`;
    session.running = false;
  });

  return {
    ok: true,
    commandSession: session
  };
}

function appendLimited(current, chunk) {
  const combined = `${current}${chunk ?? ""}`;
  const limit = 30000;
  if (combined.length <= limit) {
    return combined;
  }
  return combined.slice(combined.length - limit);
}

function createEmptyCommandSession() {
  return {
    running: false,
    projectId: null,
    projectName: null,
    repoRoot: null,
    entries: []
  };
}

function getCommandSession(commandSessions, projectId) {
  return commandSessions.get(projectId) ?? createEmptyCommandSession();
}

function json(res, payload) {
  res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function renderHtml() {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Standard Harness PMW</title>
<style>
:root{
  --bg:#f4f1e7;
  --panel:#fffdf8;
  --panel-strong:#f0eadc;
  --ink:#1d221c;
  --muted:#5f675b;
  --line:#d8d1bf;
  --accent:#235c4f;
  --accent-soft:#e3efe9;
  --warn:#8f5b28;
  --overlay:rgba(32,28,20,.42);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:radial-gradient(circle at top,#fbf7ee 0,#f4f1e7 42%,#efe8d9 100%);color:var(--ink);font:14px/1.58 Segoe UI,Arial,sans-serif}
main{max-width:1380px;margin:0 auto;padding:24px}
h1,h2,h3{margin:0}
h1{font-size:28px;letter-spacing:.02em}
h2{font-size:22px}
h3{font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
small,.muted{color:var(--muted)}
.hidden{display:none !important}
.page-stack{display:grid;gap:18px}
.topbar{display:flex;justify-content:space-between;gap:16px;align-items:flex-end;margin-bottom:18px}
.topbar-actions{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}
.switcher{min-width:300px}
.switcher label,.field-label{display:block;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.switcher select,.row input{width:100%;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink)}
.panel{background:rgba(255,253,248,.92);border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 8px 30px rgba(73,61,35,.05);scroll-margin-top:24px}
.stack{display:grid;gap:18px}
.project{border:1px solid var(--line);background:#fff;border-radius:12px;padding:12px;margin:0 0 10px}
.project.active{border-color:var(--accent);background:var(--accent-soft)}
.project-head{display:flex;justify-content:space-between;gap:8px}
.project-actions{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.project-list{display:grid;gap:10px;margin-top:16px}
.row{display:flex;gap:8px;align-items:flex-end}
.row > *{flex:1}
button{padding:9px 11px;border:1px solid #bcc3b8;border-radius:10px;background:#fff;color:var(--ink);cursor:pointer}
button.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
button.subtle{background:#f7f3ea}
button:disabled{opacity:.55;cursor:default}
.hero{display:grid;grid-template-columns:1.4fr .9fr;gap:14px;align-items:stretch}
.hero .section-head{grid-column:1 / -1;margin-bottom:0}
.hero-main{background:linear-gradient(145deg,#fffef8,#f3ece0);border:1px solid var(--line);border-radius:16px;padding:16px}
.hero-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.stat{background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px}
.stat strong{display:block;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.stat div{font-size:18px;font-weight:600}
.section-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px}
.band{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:16px}
.metric-row{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:14px}
.metric{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px}
.metric .label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.metric .value{font-size:22px;font-weight:700;margin-top:4px}
.metric-button{width:100%;text-align:left}
.metric-button:hover{border-color:var(--accent);background:var(--accent-soft)}
.phase-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:14px}
.phase{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px}
.phase .name{font-weight:700}
.phase .meta{margin-top:6px;color:var(--muted);font-size:12px}
.phase-button{width:100%;text-align:left}
.phase-button:hover{border-color:var(--accent);background:var(--accent-soft)}
.action-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.action-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px;min-height:180px}
.action-card .eyebrow{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.action-card .title{font-size:18px;font-weight:700;margin-top:8px}
.action-card .sub{margin-top:8px;color:var(--muted)}
.pill{display:inline-block;padding:4px 8px;border-radius:999px;background:var(--panel-strong);color:var(--warn);font-size:12px;margin-top:10px}
.baton-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:12px}
.baton-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px}
.baton-list{margin:0;padding-left:18px}
.baton-list li{margin:6px 0}
.artifact-layout{display:grid;grid-template-columns:320px 1fr;gap:12px}
.artifact-group{background:#fff;border:1px solid var(--line);border-radius:14px;padding:12px;margin-top:10px}
.artifact-group:first-child{margin-top:0}
.artifact-button{width:100%;text-align:left;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#fdfbf6;margin-top:8px}
.artifact-button.active{border-color:var(--accent);background:var(--accent-soft)}
.artifact-meta{font-size:12px;color:var(--muted)}
.preview{background:#fbfaf6;border:1px solid var(--line);border-radius:14px;padding:12px}
pre{white-space:pre-wrap;word-break:break-word;background:#eef0e8;border:1px solid #c6ccbe;border-radius:12px;padding:14px;color:#141914;font:13px/1.68 Consolas,"Cascadia Code","Segoe UI",Arial,sans-serif}
.command-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.command-col{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px}
.command-item{border-top:1px solid #ebe5d8;padding-top:10px;margin-top:10px}
.command-item:first-child{border-top:none;padding-top:0;margin-top:0}
.command-item-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.command-item-actions{display:flex;gap:8px;align-items:center}
.command-run{white-space:nowrap}
.command-note{margin-top:12px;font-size:12px;color:var(--muted)}
.command-session{grid-column:1 / -1;background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px}
.command-session-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.command-session-summary{margin-top:8px}
.command-session-meta{margin-top:4px;font-size:12px;color:var(--muted)}
.command-log{margin-top:12px}
.command-log pre{margin:8px 0 0}
.route{font-size:12px;color:var(--muted);margin-top:4px}
.floating-nav{position:fixed;right:24px;top:110px;z-index:20;width:172px;background:rgba(255,253,248,.94);border:1px solid var(--line);border-radius:18px;padding:10px;box-shadow:0 14px 40px rgba(73,61,35,.14);backdrop-filter:blur(8px)}
.floating-nav .label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin:2px 6px 8px}
.floating-nav a{display:block;padding:8px 9px;border-radius:10px;color:var(--ink);text-decoration:none;font-size:12px;line-height:1.25}
.floating-nav a:hover{background:var(--accent-soft);color:var(--accent)}
.modal-shell{position:fixed;inset:0;background:var(--overlay);display:flex;justify-content:center;align-items:flex-start;padding:48px 20px;z-index:50}
.modal-card{width:min(980px,100%);max-height:calc(100vh - 96px);overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:22px;padding:22px;box-shadow:0 24px 60px rgba(38,33,24,.18)}
.modal-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
.modal-sub{margin-top:8px;color:var(--muted)}
.detail-table-wrap{margin-top:18px;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fff}
.detail-table{width:100%;border-collapse:collapse}
.detail-table th,.detail-table td{padding:12px 14px;border-bottom:1px solid #ebe5d8;text-align:left;vertical-align:top}
.detail-table th{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;background:#faf6ec}
.detail-table tr:last-child td{border-bottom:none}
.detail-task{font-weight:600}
.detail-meta{margin-top:4px;font-size:12px;color:var(--muted)}
.status-pill{display:inline-block;padding:4px 8px;border-radius:999px;background:var(--panel-strong);font-size:12px}
.status-pill.done{color:#2f6b40}
.status-pill.remaining{color:#8f5b28}
.empty-note{margin-top:10px;font-size:12px;color:var(--muted)}
@media(max-width:1100px){
  .hero,.artifact-layout,.baton-grid,.action-grid,.command-grid,.metric-row{grid-template-columns:1fr}
  .topbar{align-items:stretch;flex-direction:column}
  .switcher{min-width:0}
  .floating-nav{position:sticky;top:8px;width:auto;margin:0 0 14px;display:flex;gap:6px;overflow:auto;border-radius:14px}
  .floating-nav .label{display:none}
  .floating-nav a{white-space:nowrap}
}
</style>
</head>
<body>
<main>
  <nav class="floating-nav" aria-label="PMW section navigation">
    <div class="label">PMW Menu</div>
    <a href="#project-overview">Project Overview</a>
    <a href="#project-tasks-status">Project Tasks Status</a>
    <a href="#action-board">Action Board</a>
    <a href="#re-entry-baton">Re-entry Baton</a>
    <a href="#artifact-library">Artifact Library</a>
    <a href="#operator-commands">Operator Commands</a>
    <a href="#diagnostics-section">Diagnostics</a>
  </nav>

  <div class="topbar">
    <div>
      <h1>Standard Harness PMW</h1>
    </div>
    <div class="topbar-actions">
      <div class="switcher">
        <label for="projectSelect">Selected Project</label>
        <select id="projectSelect" onchange="changeProject(this.value)">
          <option value="">No project selected</option>
        </select>
      </div>
      <button class="subtle" onclick="openProjectsModal()">Manage Projects</button>
    </div>
  </div>

  <section class="page-stack">
      <section id="project-overview" class="panel hero">
        <div class="section-head">
          <h3>Project Overview</h3>
        </div>
        <div class="hero-main">
          <div class="muted">Selected Project</div>
          <h2 id="title">No project selected</h2>
          <p id="headline" class="muted" style="margin:10px 0 0">Run harness:pmw-export in a registered project.</p>
          <p id="goal" style="margin:14px 0 0"></p>
        </div>
        <div class="hero-meta">
          <div class="stat"><strong>Stage</strong><div id="stage">n/a</div></div>
          <div class="stat"><strong>Gate</strong><div id="gate">n/a</div></div>
          <div class="stat"><strong>Current Owner</strong><div id="currentOwner">n/a</div></div>
          <div class="stat"><strong>Target Workflow</strong><div id="workflow">n/a</div></div>
        </div>
      </section>

      <section id="project-tasks-status" class="panel">
        <div class="section-head">
          <h3>Project Tasks Status</h3>
          <button id="viewOverviewButton" class="subtle" onclick="openOverviewModal()" disabled>View Work Items</button>
        </div>
        <div id="overview"></div>
      </section>

      <section id="action-board" class="panel">
        <h3>Action Board</h3>
        <div id="actionBoard" class="action-grid"></div>
      </section>

      <section id="re-entry-baton" class="panel">
        <h3>Re-entry Baton</h3>
        <div id="baton" class="baton-grid"></div>
      </section>

      <section id="artifact-library" class="panel">
        <h3>Artifact Library</h3>
        <div class="artifact-layout">
          <div id="artifactLibrary"></div>
          <div class="preview">
            <div class="muted" id="previewPath">No artifact selected</div>
            <pre id="previewContent">Select an artifact to preview.</pre>
          </div>
        </div>
      </section>

      <section id="operator-commands" class="panel">
        <h3>Operator Commands</h3>
        <div id="commands" class="command-grid"></div>
      </section>

      <section id="diagnostics-section" class="panel">
        <h3>Diagnostics</h3>
        <pre id="diagnostics"></pre>
      </section>
  </section>

  <div id="projectsModal" class="modal-shell hidden" onclick="closeOnBackdrop(event, 'projectsModal')">
    <section class="modal-card">
      <div class="modal-head">
        <div>
          <h2>Projects</h2>
          <div class="modal-sub">Select the PMW target project or manage the registry only when needed.</div>
        </div>
        <button class="subtle" onclick="closeProjectsModal()">Close</button>
      </div>
      <div style="margin-top:18px">
        <div class="field-label">Add Project Repo Folder</div>
        <div class="row">
          <input id="repoRoot" placeholder="Project repo folder">
          <button class="primary" style="flex:0 0 auto" onclick="addProject()">Add</button>
        </div>
        <p class="muted" id="registry" style="margin:12px 0 0"></p>
      </div>
      <div id="projectsPanel" class="project-list"></div>
    </section>
  </div>

  <div id="overviewModal" class="modal-shell hidden" onclick="closeOnBackdrop(event, 'overviewModal')">
    <section class="modal-card">
      <div class="modal-head">
        <div>
          <h2 id="overviewModalTitle">Work Item Details</h2>
          <div id="overviewModalSubtitle" class="modal-sub">Review the selected work-item list.</div>
        </div>
        <button class="subtle" onclick="closeOverviewModal()">Close</button>
      </div>
      <div id="overviewModalBody"></div>
    </section>
  </div>
<script>
let selected = null;
let selectedArtifactPath = null;
let currentProjects = [];
let currentOverview = null;
let currentReadModel = null;
let currentCommandSession = null;
let currentCommandError = null;
let commandPollTimer = null;

async function api(path, body){
  const res = await fetch(path,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body:JSON.stringify(body)
  });
  return res.json();
}

async function load(projectId){
  const res = await fetch('/api/read-model'+(projectId?'?project='+encodeURIComponent(projectId):''));
  const data = await res.json();
  selected = data.selectedProjectId;
  render(data);
}

function normalizeStatus(status){
  return String(status ?? '').toLowerCase();
}

function escapeHtml(value){
  return String(value ?? '')
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;');
}

function render(data){
  document.getElementById('registry').textContent = data.registryPath;
  currentProjects = data.projects ?? [];
  renderProjectSwitcher(currentProjects, data.selectedProjectId);
  renderProjectsPanel(currentProjects, data.selectedProjectId);

  const model = data.readModel;
  currentReadModel = model ?? null;
  currentCommandSession = data.commandSession ?? createEmptyCommandSessionView();
  const ctx = model?.context;
  const route = (ctx?.diagnostics ?? []).find((item) => item.code === 'handoff_route');
  const actionBoard = ctx?.actionBoard;
  const currentTask = actionBoard?.cards?.currentTask ?? null;
  const nextTask = actionBoard?.cards?.nextTask ?? null;
  const overview = ctx?.projectOverviewBand;
  const baton = ctx?.reEntryBaton;
  const library = ctx?.artifactLibrary;
  currentOverview = overview ?? null;

  document.getElementById('title').textContent = model?.project?.name ?? 'No project selected';
  document.getElementById('headline').textContent = overview?.currentFocus ?? ctx?.releaseState?.currentFocus ?? 'Run harness:pmw-export in a registered project.';
  document.getElementById('goal').textContent = overview?.projectGoal ?? ctx?.releaseState?.releaseGoal ?? '';
  document.getElementById('stage').textContent = ctx?.releaseState?.currentStage ?? 'n/a';
  document.getElementById('gate').textContent = ctx?.releaseState?.releaseGateState ?? 'n/a';
  document.getElementById('currentOwner').textContent = currentTask?.owner ?? route?.owner ?? 'n/a';
  document.getElementById('workflow').textContent = route?.workflow ?? currentTask?.workflow ?? 'n/a';
  document.getElementById('overview').innerHTML = renderOverviewBand(overview);
  document.getElementById('viewOverviewButton').disabled = !overview;
  document.getElementById('actionBoard').innerHTML = renderActionBoard(actionBoard);
  document.getElementById('baton').innerHTML = renderBaton(baton);
  document.getElementById('artifactLibrary').innerHTML = renderArtifactLibrary(library);
  document.getElementById('commands').innerHTML = renderCommands(model);
  document.getElementById('diagnostics').textContent = JSON.stringify(ctx?.diagnostics ?? [], null, 2);
  syncCommandPolling(currentCommandSession);

  const defaultArtifactPath = library?.previewTitle ?? library?.groups?.[0]?.items?.[0]?.path ?? null;
  selectedArtifactPath = defaultArtifactPath;
  highlightArtifactSelection();
  if (defaultArtifactPath) {
    showArtifact(defaultArtifactPath);
  } else {
    document.getElementById('previewPath').textContent = 'No artifact selected';
    document.getElementById('previewContent').textContent = 'No previewable artifact is available.';
  }
}

function renderProjectSwitcher(projects, selectedProjectId){
  const select = document.getElementById('projectSelect');
  const options = [
    '<option value="">No project selected</option>',
    ...projects.map((project) => {
      const isSelected = project.id === selectedProjectId ? ' selected' : '';
      return '<option value="' + escapeHtml(project.id) + '"' + isSelected + '>' +
        escapeHtml(project.name + ' · ' + project.status) +
      '</option>';
    })
  ];
  select.innerHTML = options.join('');
}

function renderProjectsPanel(projects, selectedProjectId){
  const box = document.getElementById('projectsPanel');
  box.innerHTML = '';
  projects.forEach((p) => {
    const item = document.createElement('div');
    item.className = 'project' + (p.id === selectedProjectId ? ' active' : '');
    item.innerHTML = '<div class="project-head"><strong>' + escapeHtml(p.name) + '</strong><small>' + escapeHtml(p.status) + '</small></div><small>' + escapeHtml(p.repoRoot) + '</small>';
    const actions = document.createElement('div');
    actions.className = 'project-actions';
    const select = document.createElement('button');
    select.textContent = 'Select';
    select.onclick = async () => {
      await api('/api/projects/select', { projectId: p.id });
      closeProjectsModal();
      load(p.id);
    };
    const archive = document.createElement('button');
    archive.textContent = 'Archive';
    archive.onclick = async () => { await api('/api/projects/archive', { projectId: p.id }); load(); };
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.onclick = async () => { await api('/api/projects/remove', { projectId: p.id }); load(); };
    actions.append(select, archive, remove);
    item.appendChild(actions);
    box.appendChild(item);
  });
}

function renderOverviewBand(overview){
  if (!overview) {
    return '<p class="muted">Overview data is not available yet.</p>';
  }
  const metrics = overview.metrics ?? {};
  const phases = overview.phaseSummary ?? [];
  return [
    '<div class="metric-row">',
    metricCard('Tracked Items', metrics.totalTracked, 'tracked'),
    metricCard('Done', metrics.done, 'done'),
    metricCard('Active', metrics.active, 'active'),
    metricCard('Open Work Items', metrics.openWorkItems, 'open_work_items'),
    metricCard('Freshness', metrics.freshness, 'freshness'),
    '</div>',
    '<div class="phase-grid">',
    phases.map((phase) => phaseCard(phase)).join(''),
    '</div>'
  ].join('');
}

function metricCard(label, value, view){
  return '<button type="button" class="metric metric-button" onclick="openOverviewModal(\\'' + escapeJsString(view) + '\\')"><div class="label">' + escapeHtml(label) + '</div><div class="value">' + escapeHtml(value ?? 'n/a') + '</div></button>';
}

function phaseCard(phase){
  return '<button type="button" class="phase phase-button" onclick="openOverviewModal(\\'' + escapeJsString('phase::' + (phase.phase ?? 'Unmapped')) + '\\')"><div class="name">' + escapeHtml(phase.phase) + '</div><div class="meta">total ' + escapeHtml(phase.total) + ' · done ' + escapeHtml(phase.done) + ' · active ' + escapeHtml(phase.active) + '</div></button>';
}

function renderActionBoard(board){
  const cards = board?.cards;
  if (!cards) {
    return '<div class="action-card"><div class="title">No action-board data.</div></div>';
  }
  return [
    renderActionCard(cards.decisionRequired),
    renderActionCard(cards.blockedAtRisk),
    renderTaskCard(cards.currentTask),
    renderTaskCard(cards.nextTask)
  ].join('');
}

function renderActionCard(card){
  return '<article class="action-card"><div class="eyebrow">' + escapeHtml(card?.label) + '</div><div class="title">' + escapeHtml(card?.headline ?? card?.title ?? 'n/a') + '</div><div class="sub">' + escapeHtml(card?.supportingText ?? card?.summary ?? 'No summary recorded.') + '</div><div class="pill">count ' + escapeHtml(card?.count ?? card?.status ?? 'n/a') + '</div></article>';
}

function renderTaskCard(card){
  return '<article class="action-card"><div class="eyebrow">' + escapeHtml(card?.label) + '</div><div class="title">' + escapeHtml(card?.title ?? 'No task') + '</div><div class="sub">' + escapeHtml(card?.summary ?? 'No summary recorded.') + '</div><div class="pill">owner ' + escapeHtml(card?.owner ?? 'unassigned') + '</div><div class="route">' + escapeHtml(card?.workflow ?? 'workflow n/a') + ' · ' + escapeHtml(card?.status ?? 'status n/a') + '</div></article>';
}

function renderBaton(baton){
  if (!baton) {
    return '<div class="baton-card">No baton data.</div>';
  }
  const handoff = baton.latestHandoff;
  return [
    '<div class="baton-card"><div class="eyebrow">Latest Handoff</div><div class="title">' + escapeHtml(handoff?.headline ?? 'No recent handoff recorded.') + '</div><div class="sub">' + escapeHtml((handoff?.fromRole ?? 'n/a') + ' -> ' + (handoff?.toRole ?? 'n/a') + ' @ ' + (handoff?.createdAt ?? 'n/a')) + '</div></div>',
    '<div class="baton-card"><div class="eyebrow">Re-entry Data</div><ul class="baton-list">' +
      '<li>Next owner: ' + escapeHtml(baton.nextOwner ?? 'unassigned') + '</li>' +
      '<li>Target workflow: ' + escapeHtml(baton.targetWorkflow ?? 'n/a') + '</li>' +
      '<li>Route status: ' + escapeHtml(baton.routeStatus ?? 'n/a') + '</li>' +
      '<li>Active task: ' + escapeHtml(baton.activeTask ? '[' + baton.activeTask.taskId + '] ' + baton.activeTask.title : 'n/a') + '</li>' +
      '<li>Required SSOT: ' + escapeHtml((baton.requiredSsot ?? []).join(', ') || 'none') + '</li>' +
      '<li>Pending approvals: ' + escapeHtml((baton.pendingApprovals ?? []).join(', ') || 'none') + '</li>' +
    '</ul></div>'
  ].join('');
}

function renderArtifactLibrary(library){
  if (!library?.groups?.length) {
    return '<div class="artifact-group"><div class="muted">No artifact library is available yet.</div></div>';
  }
  return library.groups.map((group) => {
    const items = group.items ?? [];
    return '<section class="artifact-group"><h3>' + escapeHtml(group.label) + '</h3>' +
      items.map((item) => '<button class="artifact-button" data-artifact-path="' + escapeHtml(item.path) + '" onclick="showArtifact(\\'' + escapeJsString(item.path) + '\\')"><div><strong>' + escapeHtml(item.title) + '</strong></div><div class="artifact-meta">' + escapeHtml(item.path) + ' · ' + escapeHtml(item.kind) + (item.previewable ? '' : ' · preview unavailable') + '</div></button>').join('') +
      '</section>';
  }).join('');
}

async function showArtifact(relativePath){
  selectedArtifactPath = relativePath;
  highlightArtifactSelection();
  const res = await fetch('/api/artifact?project=' + encodeURIComponent(selected ?? '') + '&path=' + encodeURIComponent(relativePath));
  const payload = await res.json();
  document.getElementById('previewPath').textContent = payload.path ?? relativePath;
  if (!payload.ok) {
    document.getElementById('previewContent').textContent = payload.message ?? 'Unable to preview artifact.';
    return;
  }
  document.getElementById('previewContent').textContent = payload.preview + (payload.truncated ? '\\n\\n...[truncated]' : '');
}

function highlightArtifactSelection(){
  document.querySelectorAll('[data-artifact-path]').forEach((button) => {
    button.classList.toggle('active', button.getAttribute('data-artifact-path') === selectedArtifactPath);
  });
}

function renderCommands(model){
  const commands = model?.context?.operatorCommands;
  const repoRoot = model?.project?.repoRoot ?? currentCommandSession?.repoRoot ?? 'selected project repo root';
  if(!commands){
    return '<div class="command-col"><div class="title">No operator command guidance exported yet.</div></div>';
  }
  return [
    renderCommandColumn('Launch Here', commands.phaseOne, 'planned command', true, repoRoot),
    renderCommandColumn('Run In Terminal For Now', commands.terminalOnly, 'terminal command', false, repoRoot),
    renderCommandSession(currentCommandSession)
  ].join('');
}

function renderCommandColumn(title, items, commandLabel, launchable, repoRoot){
  return '<section class="command-col"><div class="title">' + escapeHtml(title) + '</div>' +
    (items ?? []).map((command) => renderCommandItem(command, commandLabel, launchable, repoRoot)).join('') +
    (launchable ? '<div class="command-note">Approved phase-1 launcher scope only. PMW runs one command at a time per project and keeps logs only for the current PMW session.</div>' : '') +
  '</section>';
}

function renderCommandItem(command, commandLabel, launchable, repoRoot){
  const running = Boolean(currentCommandSession?.running);
  const disabled = running ? ' disabled' : '';
  const runButton = launchable
    ? '<div class="command-item-actions"><button class="primary command-run"' + disabled + ' onclick="runCommand(\\'' + escapeJsString(command.id) + '\\')">' + (running ? 'Busy' : 'Run') + '</button></div>'
    : '';
  const commandRoute = launchable
    ? commandLabel + ': ' + command.command
    : commandLabel + ': ' + command.command + ' · repo root: ' + repoRoot;
  return '<div class="command-item"><div class="command-item-head"><div><strong>' + escapeHtml(command.label) + '</strong><div class="sub">' + escapeHtml(command.description) + '</div></div>' + runButton + '</div><div class="route">' + escapeHtml(commandRoute) + '</div></div>';
}

function renderCommandSession(session){
  const latest = session?.entries?.[0] ?? null;
  if(!latest){
    return '<section class="command-session"><div class="title">Latest Command Result</div><div class="command-session-summary muted">No PMW command has been run in this session.</div></section>';
  }
  const statusLabel = latest.status === 'running' ? 'running' : latest.status;
  const outputBlocks = [];
  if(latest.stdout){
    outputBlocks.push('<div class="command-log"><strong>stdout</strong><pre>' + escapeHtml(latest.stdout) + '</pre></div>');
  }
  if(latest.stderr){
    outputBlocks.push('<div class="command-log"><strong>stderr</strong><pre>' + escapeHtml(latest.stderr) + '</pre></div>');
  }
  if(currentCommandError){
    outputBlocks.unshift('<div class="command-log"><strong>message</strong><pre>' + escapeHtml(currentCommandError) + '</pre></div>');
  }
  return '<section class="command-session"><div class="command-session-head"><div><div class="title">Latest Command Result</div><div class="command-session-summary">' + escapeHtml(latest.summary ?? 'No summary.') + '</div><div class="command-session-meta">' + escapeHtml((latest.label ?? latest.commandId ?? 'command') + ' · ' + statusLabel + ' · started ' + (latest.startedAt ?? 'n/a')) + (latest.finishedAt ? escapeHtml(' · finished ' + latest.finishedAt) : '') + '</div></div><span class="status-pill ' + escapeHtml(statusLabel === 'success' ? 'done' : 'remaining') + '">' + escapeHtml(statusLabel) + '</span></div>' + outputBlocks.join('') + '</section>';
}

function escapeJsString(value){
  return String(value ?? '').replaceAll('\\\\','\\\\\\\\').replaceAll('\\'','\\\\\\'');
}

async function addProject(){
  const repoRoot = document.getElementById('repoRoot').value.trim();
  if(!repoRoot) return;
  await api('/api/projects/add',{repoRoot});
  document.getElementById('repoRoot').value = '';
  load();
}

async function changeProject(projectId){
  if(!projectId){
    return;
  }
  await api('/api/projects/select',{projectId});
  currentCommandError = null;
  load(projectId);
}

function openProjectsModal(){
  document.getElementById('projectsModal').classList.remove('hidden');
}

function closeProjectsModal(){
  document.getElementById('projectsModal').classList.add('hidden');
}

async function runCommand(commandId){
  if(!selected){
    return;
  }
  currentCommandError = null;
  const dangerous = ['validate', 'handoff', 'pmw-export'];
  if(dangerous.includes(commandId)){
    const confirmed = window.confirm('This command can update validation state, derived outputs, or workflow state for the selected project. Run it now?');
    if(!confirmed){
      return;
    }
  }
  const payload = await api('/api/commands/run', { projectId: selected, commandId });
  if(!payload.ok){
    currentCommandError = payload.message ?? 'Unable to run the selected PMW command.';
    currentCommandSession = payload.commandSession ?? currentCommandSession;
    document.getElementById('commands').innerHTML = renderCommands(currentReadModel);
    return;
  }
  await load(selected);
}

function openOverviewModal(view = 'tracked'){
  if(!currentOverview){
    return;
  }
  const detailView = buildOverviewDetailView(currentOverview, currentReadModel, view);
  document.getElementById('overviewModalTitle').textContent = detailView.title;
  document.getElementById('overviewModalSubtitle').textContent = detailView.description;
  document.getElementById('overviewModalBody').innerHTML = renderOverviewDetails(detailView);
  document.getElementById('overviewModal').classList.remove('hidden');
}

function closeOverviewModal(){
  document.getElementById('overviewModal').classList.add('hidden');
}

function closeOnBackdrop(event, id){
  if(event.target.id === id){
    document.getElementById(id).classList.add('hidden');
  }
}

function syncCommandPolling(session){
  if(commandPollTimer){
    clearTimeout(commandPollTimer);
    commandPollTimer = null;
  }
  if(session?.running && selected){
    commandPollTimer = setTimeout(() => {
      load(selected);
    }, 1200);
  }
}

function renderOverviewDetails(detailView){
  const items = detailView.items ?? [];
  if(!items.length){
    return '<p class="muted" style="margin-top:16px">' + escapeHtml(detailView.emptyMessage ?? 'No work-list detail is available yet.') + '</p>';
  }
  return '<div class="detail-table-wrap"><table class="detail-table"><thead><tr><th>Task</th><th>Phase</th><th>State</th><th>Detail</th></tr></thead><tbody>' +
    items.map(renderOverviewRow).join('') +
  '</tbody></table></div>';
}

function renderOverviewRow(item){
  const detailParts = [item.taskId, item.owner, item.rawStatus].filter(Boolean);
  return '<tr><td><div class="detail-task">' + escapeHtml(item.title ?? 'Untitled task') + '</div>' +
    (item.notes ? '<div class="detail-meta">' + escapeHtml(item.notes) + '</div>' : '') +
    '</td><td>' + escapeHtml(item.phase ?? 'Unmapped') + '</td><td><span class="status-pill ' + escapeHtml(item.stateClass ?? 'remaining') + '">' + escapeHtml(item.stateLabel ?? 'remaining') + '</span></td><td>' +
    '<div>' + escapeHtml(detailParts.join(' · ') || 'No extra detail.') + '</div>' +
    (item.source ? '<div class="detail-meta">' + escapeHtml(item.source) + '</div>' : '') +
  '</td></tr>';
}

function buildOverviewDetailView(overview, model, view){
  const trackedItems = buildTrackedItems(overview);
  const openWorkItems = buildOpenWorkItems(model, trackedItems);
  const freshness = overview?.metrics?.freshness ?? 'unknown';
  if(String(view).startsWith('phase::')){
    const phaseName = String(view).slice('phase::'.length) || 'Unmapped';
    return {
      title: phaseName + ' Items',
      description: phaseName + ' phase items are listed below with their current completion state.',
      items: trackedItems.filter((item) => item.phase === phaseName),
      emptyMessage: 'No item is available for the ' + phaseName + ' phase.'
    };
  }
  const views = {
    tracked: {
      title: 'Tracked Items',
      description: 'All tracked items are listed below with their phase and whether they are complete or still remaining.',
      items: trackedItems,
      emptyMessage: 'No tracked item is available.'
    },
    done: {
      title: 'Completed Items',
      description: 'Completed tracked items are listed below.',
      items: trackedItems.filter((item) => item.stateClass === 'done'),
      emptyMessage: 'No completed item is available.'
    },
    active: {
      title: 'Active Items',
      description: 'Tracked items that are still remaining are listed below.',
      items: trackedItems.filter((item) => item.stateClass === 'remaining'),
      emptyMessage: 'No active item is available.'
    },
    open_work_items: {
      title: 'Open Work Items',
      description: 'Open work items from the live work-item registry are listed below.',
      items: openWorkItems,
      emptyMessage: 'No open work item is available.'
    },
    freshness: {
      title: 'Freshness Context',
      description: 'Project freshness is currently ' + freshness + '. The list below shows the tracked items under that current snapshot.',
      items: trackedItems,
      emptyMessage: 'No tracked item is available.'
    }
  };
  return views[view] ?? views.tracked;
}

function buildTrackedItems(overview){
  const phaseDetails = overview?.phaseDetails ?? [];
  const items = [];
  phaseDetails.forEach((phase) => {
    (phase.completedItems ?? []).forEach((item) => {
      items.push({
        taskId: item.taskId,
        title: item.title,
        phase: phase.phase,
        stateLabel: 'done',
        stateClass: 'done',
        rawStatus: item.status ?? 'done',
        notes: item.notes ?? '',
        source: item.source ?? '',
        owner: null
      });
    });
    (phase.remainingItems ?? []).forEach((item) => {
      items.push({
        taskId: item.taskId,
        title: item.title,
        phase: phase.phase,
        stateLabel: 'remaining',
        stateClass: 'remaining',
        rawStatus: item.status ?? 'in_progress',
        notes: item.notes ?? '',
        source: item.source ?? '',
        owner: null
      });
    });
  });
  return items;
}

function buildOpenWorkItems(model, trackedItems){
  const trackedByTaskId = new Map(trackedItems.filter((item) => item.taskId).map((item) => [item.taskId, item]));
  const openItems = model?.context?.surfaces?.nextAction?.items ?? [];
  return openItems
    .filter((item) => !isClosedStatus(item.status))
    .map((item) => {
      const match = trackedByTaskId.get(item.id) ?? trackedItems.find((trackedItem) => trackedItem.title === item.title);
      return {
        taskId: item.id ?? null,
        title: item.title,
        phase: match?.phase ?? 'Unmapped',
        stateLabel: 'remaining',
        stateClass: 'remaining',
        rawStatus: item.status ?? 'open',
        notes: item.nextAction ?? '',
        source: item.sourceRef ?? '',
        owner: item.owner ?? null
      };
    });
}

function isClosedStatus(status){
  return ['done','closed','complete','completed'].includes(normalizeStatus(status));
}

function createEmptyCommandSessionView(){
  return {
    running: false,
    projectId: null,
    projectName: null,
    repoRoot: null,
    entries: []
  };
}

window.addEventListener('keydown', (event) => {
  if(event.key === 'Escape'){
    closeProjectsModal();
    closeOverviewModal();
  }
});

load();
</script>
</main>
</body>
</html>`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.PMW_HOST ?? "127.0.0.1";
  const port = Number(process.env.PMW_PORT ?? 4174);
  createPmwMonitorServer({ host, port }).listen(port, host, () => {
    console.log(`Standard Harness PMW listening on http://${host}:${port}`);
  });
}
