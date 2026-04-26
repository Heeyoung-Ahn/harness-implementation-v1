import http from "node:http";
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
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? `${host}:${port}`}`);
      if (req.method === "GET" && url.pathname === "/api/projects") {
        return json(res, buildProjectsPayload());
      }
      if (req.method === "GET" && url.pathname === "/api/read-model") {
        const payload = buildProjectsPayload(url.searchParams.get("project"));
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

function buildProjectsPayload(requestedProjectId) {
  const registry = loadRegistry();
  const selectedProject =
    registry.projects.find((item) => item.id === requestedProjectId) ??
    registry.projects.find((item) => item.id === registry.selectedProjectId) ??
    registry.projects.find((item) => item.status === "active") ??
    null;
  const readModel = readProjectReadModel(selectedProject);
  return {
    ok: true,
    registryPath: registryPath(),
    selectedProjectId: selectedProject?.id ?? null,
    projects: registry.projects,
    readModel
  };
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
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Standard Harness PMW</title><style>
body{margin:0;background:#f7f7f4;color:#20231f;font:14px/1.55 Segoe UI,Arial,sans-serif}main{max-width:1280px;margin:0 auto;padding:24px}.layout{display:grid;grid-template-columns:340px 1fr;gap:18px}.panel{background:#fff;border:1px solid #d8dbd2;border-radius:8px;padding:16px}.project{border:1px solid #d8dbd2;background:#fff;border-radius:6px;padding:10px;margin:0 0 8px}.project.active{border-color:#2d6b57;background:#eef6f2}.project-head{display:flex;justify-content:space-between;gap:8px}.project-actions{display:flex;gap:6px;margin-top:8px}.project-actions button{font-size:12px;padding:6px 8px}.row{display:flex;gap:8px}.row input{flex:1;padding:9px;border:1px solid #c8ccbf;border-radius:6px}button{padding:9px 11px;border:1px solid #bfc5b9;border-radius:6px;background:#fff}button.primary{background:#2d6b57;color:#fff;border-color:#2d6b57}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.card{border:1px solid #d8dbd2;border-radius:8px;padding:12px;background:#fafbf8}pre{white-space:pre-wrap;word-break:break-word;background:#f1f3ee;border-radius:6px;padding:12px}@media(max-width:900px){.layout,.cards{grid-template-columns:1fr}}</style></head><body><main>
<h1>Standard Harness PMW</h1>
<div class="layout"><aside class="panel"><h2>Projects</h2><div class="row"><input id="repoRoot" placeholder="Project repo folder"><button class="primary" onclick="addProject()">Add</button></div><p id="registry"></p><div id="projects"></div></aside><section class="panel"><h2 id="title">No project selected</h2><div class="cards"><div class="card"><strong>Stage</strong><div id="stage"></div></div><div class="card"><strong>Gate</strong><div id="gate"></div></div><div class="card"><strong>Next</strong><div id="next"></div></div></div><h3>Current Focus</h3><pre id="focus"></pre><h3>Diagnostics</h3><pre id="diagnostics"></pre></section></div>
<script>
let selected = null;
async function api(path, body){ const res = await fetch(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); return res.json(); }
async function load(projectId){ const res = await fetch('/api/read-model'+(projectId?'?project='+encodeURIComponent(projectId):'')); const data = await res.json(); selected = data.selectedProjectId; render(data); }
function render(data){ document.getElementById('registry').textContent = data.registryPath; const box=document.getElementById('projects'); box.innerHTML=''; data.projects.forEach(p=>{ const item=document.createElement('div'); item.className='project'+(p.id===data.selectedProjectId?' active':''); item.innerHTML='<div class="project-head"><strong>'+p.name+'</strong><small>'+p.status+'</small></div><small>'+p.repoRoot+'</small>'; const actions=document.createElement('div'); actions.className='project-actions'; const select=document.createElement('button'); select.textContent='Select'; select.onclick=async()=>{ await api('/api/projects/select',{projectId:p.id}); load(p.id); }; const archive=document.createElement('button'); archive.textContent='Archive'; archive.onclick=async()=>{ await api('/api/projects/archive',{projectId:p.id}); load(); }; const remove=document.createElement('button'); remove.textContent='Remove'; remove.onclick=async()=>{ await api('/api/projects/remove',{projectId:p.id}); load(); }; actions.append(select,archive,remove); item.appendChild(actions); box.appendChild(item); }); const model=data.readModel; document.getElementById('title').textContent=model?.project?.name ?? 'No project selected'; const ctx=model?.context; document.getElementById('stage').textContent=ctx?.releaseState?.currentStage ?? 'n/a'; document.getElementById('gate').textContent=ctx?.releaseState?.releaseGateState ?? 'n/a'; document.getElementById('next').textContent=ctx?.surfaces?.nextAction?.headline ?? 'n/a'; document.getElementById('focus').textContent=ctx?.releaseState?.currentFocus ?? 'Run harness:pmw-export in a registered project.'; document.getElementById('diagnostics').textContent=JSON.stringify(ctx?.diagnostics ?? [], null, 2); }
async function addProject(){ const repoRoot=document.getElementById('repoRoot').value.trim(); if(!repoRoot) return; await api('/api/projects/add',{repoRoot}); document.getElementById('repoRoot').value=''; load(); }
load();
</script></main></body></html>`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.PMW_HOST ?? "127.0.0.1";
  const port = Number(process.env.PMW_PORT ?? 4174);
  createPmwMonitorServer({ host, port }).listen(port, host, () => {
    console.log(`Standard Harness PMW listening on http://${host}:${port}`);
  });
}
