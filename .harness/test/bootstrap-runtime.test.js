import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  bootstrapHarnessProject,
  normalizeActiveProfiles,
  resolveBootstrapTarget,
  resolveGithubAuthority,
  slugifyProjectName
} from "../../installer/bootstrap-runtime.js";

test("slugifyProjectName normalizes a readable project name", () => {
  assert.equal(slugifyProjectName("WBMS Budget Suite"), "wbms-budget-suite");
});

test("normalizeActiveProfiles deduplicates and validates explicit profiles", () => {
  assert.deepEqual(normalizeActiveProfiles("prf-07, PRF-09, prf-07"), ["PRF-07", "PRF-09"]);
  assert.deepEqual(normalizeActiveProfiles("none"), []);
  assert.throws(() => normalizeActiveProfiles("PRF-99"), /Unknown profile/);
});

test("resolveBootstrapTarget accepts empty folders and rejects non-repo dirty targets", () => {
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "bootstrap-empty-"));
  assert.equal(resolveBootstrapTarget(emptyDir).targetMode, "empty_new_project_folder");

  const repoDir = fs.mkdtempSync(path.join(os.tmpdir(), "bootstrap-repo-"));
  fs.mkdirSync(path.join(repoDir, ".git"));
  fs.writeFileSync(path.join(repoDir, ".gitignore"), "node_modules/\n", "utf8");
  assert.equal(resolveBootstrapTarget(repoDir).targetMode, "existing_local_repository_root");

  const dirtyDir = fs.mkdtempSync(path.join(os.tmpdir(), "bootstrap-dirty-"));
  fs.writeFileSync(path.join(dirtyDir, "app.js"), "console.log('dirty');\n", "utf8");
  assert.throws(() => resolveBootstrapTarget(dirtyDir), /not a valid existing local repository root/);

  const busyRepoDir = fs.mkdtempSync(path.join(os.tmpdir(), "bootstrap-busy-repo-"));
  fs.mkdirSync(path.join(busyRepoDir, ".git"));
  fs.writeFileSync(path.join(busyRepoDir, "package.json"), "{}\n", "utf8");
  assert.throws(() => resolveBootstrapTarget(busyRepoDir), /must contain only repo markers/);
});

test("resolveGithubAuthority prefers explicit ref and otherwise uses the latest release tag", async () => {
  const explicit = await resolveGithubAuthority({
    githubRepo: "owner/repo",
    githubRef: "v1.2.3",
    fetchImpl: () => {
      throw new Error("fetch should not run for explicit refs");
    }
  });
  assert.equal(explicit.selection, "ref:v1.2.3");

  let requestedUrl = null;
  const latest = await resolveGithubAuthority({
    githubRepo: "owner/repo",
    fetchImpl: async (url) => {
      requestedUrl = url;
      return new Response(JSON.stringify({ tag_name: "v9.9.9" }), { status: 200 });
    }
  });
  assert.match(String(requestedUrl), /releases\/latest/);
  assert.equal(latest.selection, "release:v9.9.9");
  assert.equal(latest.ref, "v9.9.9");
});

test("bootstrapHarnessProject downloads the standard-template tree from GitHub and initializes an empty target", async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "bootstrap-target-"));
  fs.rmSync(repoRoot, { recursive: true, force: true });
  const fetchLog = [];
  const writtenWrappers = [];

  const result = await bootstrapHarnessProject({
    projectName: "Bootstrap Demo",
    targetDir: repoRoot,
    profiles: ["PRF-07"],
    userGoal: "사용자가 기준선을 빠르게 이해한다.",
    opsGoal: "운영자가 active context를 복원한다.",
    approvalGoal: "첫 packet을 연다.",
    fetchImpl: async (url) => {
      fetchLog.push(url);
      if (String(url).includes("/releases/latest")) {
        return new Response(JSON.stringify({ tag_name: "v1.0.0" }), { status: 200 });
      }
      if (String(url).includes("/git/trees/")) {
        return new Response(
          JSON.stringify({
            tree: [
              { path: "standard-template/AGENTS.md", type: "blob" },
              { path: "standard-template/README.md", type: "blob" },
              { path: "standard-template/reference/manuals/HARNESS_MANUAL.md", type: "blob" },
              { path: "standard-template/package.json", type: "blob" },
              { path: "standard-template/.agents/scripts/init-project.js", type: "blob" },
              { path: "standard-template/.agents/runtime/generated-state-docs/CURRENT_STATE.md", type: "blob" },
              { path: "standard-template/.harness/operating_state.sqlite", type: "blob" }
            ]
          }),
          { status: 200 }
        );
      }
      if (String(url).includes("standard-template/AGENTS.md")) {
        return new Response("# Agents\n", { status: 200 });
      }
      if (String(url).includes("standard-template/README.md")) {
        return new Response("# Starter\n", { status: 200 });
      }
      if (String(url).includes("standard-template/reference/manuals/HARNESS_MANUAL.md")) {
        return new Response("# Harness Manual\n", { status: 200 });
      }
      if (String(url).includes("standard-template/package.json")) {
        return new Response("{\"name\":\"starter\"}\n", { status: 200 });
      }
      if (String(url).includes("standard-template/.agents/scripts/init-project.js")) {
        return new Response("console.log('init');\n", { status: 200 });
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    },
    runInitializer: ({ targetDir, projectName, projectSlug, profiles }) => {
      assert.equal(projectName, "Bootstrap Demo");
      assert.equal(projectSlug, "bootstrap-demo");
      assert.deepEqual(profiles, ["PRF-07"]);
      assert.equal(fs.existsSync(path.join(targetDir, "AGENTS.md")), true);
      assert.equal(fs.existsSync(path.join(targetDir, ".agents", "scripts", "init-project.js")), true);
      return { ok: true, stdout: "initialized" };
    },
    writeWrappers: ({ repoRoot }) => {
      writtenWrappers.push(repoRoot);
    }
  });

  assert.equal(result.targetMode, "empty_new_project_folder");
  assert.equal(result.authoritySelection, "release:v1.0.0");
  assert.equal(result.appliedFileCount, 5);
  assert.equal(fs.existsSync(path.join(repoRoot, ".harness", "operating_state.sqlite")), false);
  assert.equal(
    fs.existsSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs", "CURRENT_STATE.md")),
    false
  );
  assert.equal(fs.existsSync(path.join(repoRoot, "README.md")), true);
  assert.equal(fs.existsSync(path.join(repoRoot, "reference", "manuals", "HARNESS_MANUAL.md")), true);
  assert.deepEqual(writtenWrappers, [repoRoot]);
  assert.equal(fetchLog.some((url) => String(url).includes("raw.githubusercontent.com")), true);
});

test("bootstrapHarnessProject accepts a lightly initialized existing git repo target", async () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "bootstrap-existing-repo-"));
  fs.mkdirSync(path.join(repoRoot, ".git"));
  fs.writeFileSync(path.join(repoRoot, ".gitignore"), "dist/\n", "utf8");

  const localStarterRoot = fs.mkdtempSync(path.join(os.tmpdir(), "bootstrap-local-starter-"));
  fs.writeFileSync(path.join(localStarterRoot, "AGENTS.md"), "# Agents\n", "utf8");
  fs.mkdirSync(path.join(localStarterRoot, ".agents", "scripts"), { recursive: true });
  fs.writeFileSync(path.join(localStarterRoot, ".agents", "scripts", "init-project.js"), "console.log('init');\n", "utf8");
  fs.mkdirSync(path.join(localStarterRoot, ".agents", "runtime", "generated-state-docs"), { recursive: true });
  fs.writeFileSync(
    path.join(localStarterRoot, ".agents", "runtime", "generated-state-docs", "CURRENT_STATE.md"),
    "# Generated\n",
    "utf8"
  );
  fs.mkdirSync(path.join(localStarterRoot, ".harness"), { recursive: true });
  fs.writeFileSync(path.join(localStarterRoot, ".harness", "operating_state.sqlite"), "starter-db", "utf8");
  fs.mkdirSync(path.join(localStarterRoot, "reference", "manuals"), { recursive: true });
  fs.writeFileSync(path.join(localStarterRoot, "reference", "manuals", "HARNESS_MANUAL.md"), "# Harness Manual\n", "utf8");
  fs.writeFileSync(path.join(localStarterRoot, "package.json"), "{\"name\":\"starter\"}\n", "utf8");

  const result = await bootstrapHarnessProject({
    projectName: "Repo Bootstrap Demo",
    targetDir: repoRoot,
    profiles: [],
    userGoal: "사용자가 기준선을 빠르게 이해한다.",
    opsGoal: "운영자가 active context를 복원한다.",
    approvalGoal: "첫 packet을 연다.",
    authoritySource: "local",
    localStarterRoot,
    runInitializer: () => ({ ok: true, stdout: "initialized" }),
    writeWrappers: () => {}
  });

  assert.equal(result.targetMode, "existing_local_repository_root");
  assert.equal(result.authoritySource, "local");
  assert.equal(fs.existsSync(path.join(repoRoot, "AGENTS.md")), true);
  assert.equal(
    fs.existsSync(path.join(repoRoot, ".agents", "runtime", "generated-state-docs", "CURRENT_STATE.md")),
    false
  );
  assert.equal(fs.existsSync(path.join(repoRoot, ".harness", "operating_state.sqlite")), false);
});
