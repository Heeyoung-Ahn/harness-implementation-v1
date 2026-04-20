import http from "node:http";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createOperatingStateStore, DEFAULT_DB_PATH } from "../state/operating-state-store.js";
import { buildPmwReadSurface, renderPmwHtml } from "./read-surface.js";

export function createPmwServer({ repoRoot = process.cwd(), outputDir = repoRoot, dbPath = DEFAULT_DB_PATH, verificationLane = "npm.cmd test" } = {}) {
  const root = path.resolve(repoRoot);
  const out = path.resolve(outputDir);
  const db = path.isAbsolute(dbPath) ? dbPath : path.resolve(root, dbPath);
  return http.createServer((req, res) => {
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);
      const store = createOperatingStateStore({ dbPath: db });
      const surface = buildPmwReadSurface({ store, repoRoot: root, outputDir: out, dbPath: db, verificationLane });
      store.close();
      if (url.pathname === "/api/read-surface") {
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(surface));
        return;
      }
      if (url.pathname === "/health") {
        res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: true }));
        return;
      }
      if (url.pathname !== "/") {
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(renderPmwHtml(surface));
    } catch (error) {
      res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, message: error instanceof Error ? error.message : "unknown pmw error" }));
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const host = process.env.PMW_HOST ?? "127.0.0.1";
  const port = Number(process.env.PMW_PORT ?? 4173);
  const server = createPmwServer({
    repoRoot: process.env.REPO_ROOT ?? process.cwd(),
    outputDir: process.env.PMW_OUTPUT_DIR ?? process.cwd(),
    dbPath: process.env.PMW_DB_PATH ?? DEFAULT_DB_PATH,
    verificationLane: process.env.PMW_VERIFICATION_LANE ?? "npm.cmd test"
  });
  server.listen(port, host, () => console.log(`PMW read surface listening on http://${host}:${port}`));
}
