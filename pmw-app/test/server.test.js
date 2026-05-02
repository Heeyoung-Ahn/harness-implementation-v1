import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { addProject } from "../runtime/project-registry.js";
import { createPmwMonitorServer } from "../runtime/server.js";

test("PMW home page renders the DEV-07 first-view sections and artifact preview API", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pmw-server-"));
  const previousAppData = process.env.APPDATA;
  process.env.APPDATA = root;
  t.after(() => {
    if (previousAppData === undefined) {
      delete process.env.APPDATA;
      return;
    }
    process.env.APPDATA = previousAppData;
  });

  const repoRoot = seedProject(root, "alpha-project", "Alpha Project", "planning");
  seedSiblingProjectPrefix(root, "alpha-project");
  addProject({ repoRoot });

  const server = createPmwMonitorServer({ host: "127.0.0.1", port: 0 });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      )
  );

  const address = server.address();
  const res = await fetch(`http://127.0.0.1:${address.port}/`);
  const html = await res.text();
  const apiRes = await fetch(`http://127.0.0.1:${address.port}/api/read-model`);
  const apiPayload = await apiRes.json();
  const artifactRes = await fetch(
    `http://127.0.0.1:${address.port}/api/artifact?project=${encodeURIComponent("alpha-project")}&path=${encodeURIComponent(".agents/artifacts/CURRENT_STATE.md")}`
  );
  const artifactPayload = await artifactRes.json();
  const escapedArtifactRes = await fetch(
    `http://127.0.0.1:${address.port}/api/artifact?project=${encodeURIComponent("alpha-project")}&path=${encodeURIComponent("../alpha-project-private/SECRET.md")}`
  );
  const escapedArtifactPayload = await escapedArtifactRes.json();
  const runRes = await fetch(`http://127.0.0.1:${address.port}/api/commands/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectId: "alpha-project", commandId: "status" })
  });
  const runPayload = await runRes.json();
  const busyRes = await fetch(`http://127.0.0.1:${address.port}/api/commands/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectId: "alpha-project", commandId: "next" })
  });
  const busyPayload = await busyRes.json();
  const completedStatusSession = await waitForCommandSession(address.port, "alpha-project", "status");
  const unknownCommandRes = await fetch(`http://127.0.0.1:${address.port}/api/commands/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectId: "alpha-project", commandId: "validation-report" })
  });
  const unknownCommandPayload = await unknownCommandRes.json();
  const handoffNoConfirmRes = await fetch(`http://127.0.0.1:${address.port}/api/commands/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectId: "alpha-project", commandId: "handoff" })
  });
  const handoffNoConfirmPayload = await handoffNoConfirmRes.json();
  const handoffRunRes = await fetch(`http://127.0.0.1:${address.port}/api/commands/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ projectId: "alpha-project", commandId: "handoff", confirmed: true })
  });
  const handoffRunPayload = await handoffRunRes.json();
  const completedHandoffSession = await waitForCommandSession(address.port, "alpha-project", "handoff");

  assert.match(html, /PMW section navigation/);
  assert.match(html, /Project Overview/);
  assert.match(html, /Project Tasks Status/);
  assert.match(html, /Action Board/);
  assert.match(html, /Re-entry Baton/);
  assert.match(html, /Artifact Library/);
  assert.match(html, /Operator Commands/);
  assert.match(html, /Diagnostics/);
  assert.match(html, /href="#project-overview"/);
  assert.match(html, /href="#project-tasks-status"/);
  assert.match(html, /href="#operator-commands"/);
  assert.match(html, /Manage Projects/);
  assert.match(html, /View Work Items/);
  assert.match(html, /Work Item Details/);
  assert.match(html, /openOverviewModal/);
  assert.match(html, /phase-button/);
  assert.match(html, /function phaseCard/);
  assert.match(html, /selected project:/);
  assert.match(html, /PMW Actions/);
  assert.match(html, /Terminal Actions/);
  assert.doesNotMatch(html, /dangerous = \['validate'/);
  assert.deepEqual(
    apiPayload.readModel.context.operatorCommands.phaseOne.map((command) => command.id),
    ["status", "next", "explain", "validate", "handoff", "pmw-export"]
  );
  assert.equal(apiPayload.readModel.context.operatorCommands.phaseOneLabel, "PMW Actions");
  assert.equal(apiPayload.readModel.context.operatorCommands.terminalOnlyLabel, "Terminal Actions");
  assert.equal(
    apiPayload.readModel.context.operatorCommands.phaseOne.find((command) => command.id === "validate")
      .confirmationRequired,
    false
  );
  assert.equal(
    apiPayload.readModel.context.operatorCommands.phaseOne.find((command) => command.id === "handoff")
      .confirmationRequired,
    true
  );
  assert.deepEqual(
    apiPayload.readModel.context.operatorCommands.terminalOnly.map((command) => command.id),
    ["doctor", "test", "validation-report"]
  );
  assert.equal(apiPayload.readModel.context.projectOverviewBand.heading, "Project Overview Band");
  assert.equal(
    apiPayload.readModel.context.projectOverviewBand.phaseDetails[0].completedItems[0].taskId,
    "PLN-00"
  );
  assert.equal(apiPayload.readModel.context.actionBoard.cards.currentTask.owner, "developer");
  assert.equal(apiPayload.readModel.context.reEntryBaton.targetWorkflow, ".agents/workflows/dev.md");
  assert.equal(artifactPayload.ok, true);
  assert.equal(escapedArtifactPayload.ok, false);
  assert.match(escapedArtifactPayload.message, /escapes the selected project/);
  assert.equal(runPayload.ok, true);
  assert.equal(busyPayload.ok, false);
  assert.match(busyPayload.message, /already running/);
  assert.equal(completedStatusSession.running, false);
  assert.equal(completedStatusSession.entries[0].status, "success");
  assert.equal(completedStatusSession.entries[0].selectedProject.id, "alpha-project");
  assert.equal(completedStatusSession.entries[0].confirmationRequired, false);
  assert.equal(typeof completedStatusSession.entries[0].durationMs, "number");
  assert.match(completedStatusSession.entries[0].stdout, /status ok/);
  assert.equal(unknownCommandPayload.ok, false);
  assert.match(unknownCommandPayload.message, /approved PMW launcher scope/);
  assert.equal(handoffNoConfirmPayload.ok, false);
  assert.equal(handoffNoConfirmPayload.confirmationRequired, true);
  assert.equal(handoffRunPayload.ok, true);
  assert.equal(completedHandoffSession.entries[0].status, "success");
  assert.equal(completedHandoffSession.entries[0].confirmationRequired, true);
  assert.equal(completedHandoffSession.entries[0].handoffBaton.previousWorkAgent, "planner");
  assert.match(completedHandoffSession.entries[0].handoffBaton.previousWorkSummary, /Ready For Code approved/);
  assert.equal(completedHandoffSession.entries[0].handoffBaton.nextWorkAgent, "developer");
  assert.match(completedHandoffSession.entries[0].handoffBaton.nextWorkSummary, /Implement DEV-09/);
  assert.match(artifactPayload.preview, /Current state preview/);
  assert.equal(apiPayload.readModel.context.operatorCommands.terminalOnly[1].command, "npm test");
  assert.equal(
    apiPayload.readModel.context.operatorCommands.terminalOnly[2].command,
    "npm run harness:validation-report"
  );
});

function seedProject(root, id, name, stage) {
  const repoRoot = path.join(root, id);
  fs.mkdirSync(path.join(repoRoot, ".agents", "runtime"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, ".agents", "artifacts"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, ".agents", "artifacts", "CURRENT_STATE.md"), "Current state preview\n", "utf8");
  fs.writeFileSync(
    path.join(repoRoot, "package.json"),
    `${JSON.stringify(
      {
        name: id,
        version: "1.0.0",
        scripts: {
          "harness:status": "node -e \"setTimeout(() => console.log('status ok'), 500)\"",
          "harness:next": "node -e \"console.log('next ok')\"",
          "harness:explain": "node -e \"console.log('explain ok')\"",
          "harness:validate": "node -e \"console.log('validate ok')\"",
          "harness:handoff": "node -e \"console.log('handoff ok')\"",
          "harness:pmw-export": "node -e \"console.log('pmw-export ok')\""
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "runtime", "project-manifest.json"),
    `${JSON.stringify(
      {
        schemaVersion: "standard-harness-project-manifest/v1",
        projectId: id,
        projectName: name,
        projectSlug: id,
        repoRoot,
        generatedAt: "2026-04-27T00:00:00.000Z",
        source: {
          pmwReadModel: ".agents/runtime/pmw-read-model.json"
        },
        status: {
          stage,
          gate: "open",
          focus: `${name} focus`,
          releaseGoal: `${name} goal`
        },
        activeProfiles: []
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(repoRoot, ".agents", "runtime", "pmw-read-model.json"),
    `${JSON.stringify(
      {
        schemaVersion: "standard-harness-pmw-read-model/v1",
        generatedAt: "2026-04-27T00:00:00.000Z",
        project: { id, name, repoRoot },
        context: {
          releaseState: {
            currentStage: stage,
            releaseGateState: "open",
            currentFocus: `${name} focus`
          },
          projectOverviewBand: {
            heading: "Project Overview Band",
            projectGoal: `${name} goal`,
            currentFocus: `${name} focus`,
            stage,
            gate: "open",
            metrics: {
              totalTracked: 3,
              done: 1,
              active: 2,
              openWorkItems: 1,
              freshness: "fresh"
            },
            phaseSummary: [
              { phase: "Planning", total: 1, done: 1, active: 0 },
              { phase: "Build", total: 2, done: 0, active: 2 }
            ],
            phaseDetails: [
              {
                phase: "Planning",
                total: 1,
                done: 1,
                active: 0,
                completedItems: [
                  {
                    taskId: "PLN-00",
                    title: "Kickoff planning",
                    status: "done",
                    notes: "Planning closed",
                    source: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
                  }
                ],
                remainingItems: []
              },
              {
                phase: "Build",
                total: 2,
                done: 0,
                active: 2,
                completedItems: [],
                remainingItems: [
                  {
                    taskId: "DEV-07",
                    title: "PMW first-view implementation",
                    status: "in_progress",
                    notes: "Implement the approved PMW first view.",
                    source: "reference/packets/PKT-01_DEV-07_PMW_V1_3_OPERATOR_CONSOLE_FIRST_VIEW.md"
                  },
                  {
                    taskId: "TST-04",
                    title: "PMW first-view verification",
                    status: "pending",
                    notes: "Verify the first-view implementation.",
                    source: ".agents/artifacts/IMPLEMENTATION_PLAN.md"
                  }
                ]
              }
            ]
          },
          surfaces: {
            nextAction: { headline: `${name} next action`, items: [] }
          },
          actionBoard: {
            cards: {
              decisionRequired: {
                label: "Decision Required",
                headline: "No open decision requires attention.",
                supportingText: "0 open decisions require attention."
              },
              blockedAtRisk: {
                label: "Blocked / At Risk",
                headline: "No blocking or at-risk item is open.",
                supportingText: "0 open blocker or risks require attention."
              },
              currentTask: {
                label: "Current Task",
                title: "DEV-07 implementation",
                owner: "developer",
                workflow: ".agents/workflows/dev.md",
                status: "in_progress",
                summary: "Implement the PMW first view."
              },
              nextTask: {
                label: "Next Task",
                title: "TST-04 verification",
                owner: "tester",
                workflow: ".agents/workflows/test.md",
                status: "pending",
                summary: "Verify the PMW first view."
              }
            }
          },
          reEntryBaton: {
            targetWorkflow: ".agents/workflows/dev.md",
            nextOwner: "developer",
            previousWorkAgent: "planner",
            previousWorkSummary: "DEV-09 Ready For Code approved.",
            nextWorkAgent: "developer",
            nextWorkSummary: "Implement DEV-09 PMW phase-1 command launcher and handoff baton behavior.",
            routeStatus: "ready",
            activeTask: { taskId: "DEV-07", title: "DEV-07 implementation" },
            requiredSsot: [".agents/artifacts/CURRENT_STATE.md"],
            pendingApprovals: [],
            latestHandoff: {
              headline: "planner -> developer",
              fromRole: "planner",
              toRole: "developer",
              createdAt: "2026-04-27T00:00:00.000Z"
            }
          },
          recentHandoff: {
            status: "ready",
            headline: "planner -> developer",
            createdAt: "2026-04-27T00:00:00.000Z",
            fromRole: "planner",
            toRole: "developer",
            payload: {
              completedScope: "DEV-09 Ready For Code approved.",
              nextFirstAction: "Implement DEV-09 PMW phase-1 command launcher and handoff baton behavior."
            }
          },
          artifactLibrary: {
            previewTitle: ".agents/artifacts/CURRENT_STATE.md",
            groups: [
              {
                id: "execution_truth",
                label: "Execution Truth",
                items: [
                  {
                    path: ".agents/artifacts/CURRENT_STATE.md",
                    title: "Current State",
                    kind: "governance",
                    previewable: true
                  }
                ]
              }
            ]
          },
          operatorCommands: {
            selectionMode: "selected_project",
            concurrencyPolicy: "one_command_per_project",
            logRetention: "session",
            phaseOneLabel: "PMW Actions",
            terminalOnlyLabel: "Terminal Actions",
            phaseOne: [
              {
                id: "status",
                label: "status",
                command: "npm run harness:status",
                launchMode: "pmw_phase1",
                sideEffect: "read_only",
                expectedEffect: "Read status.",
                confirmationRequired: false,
                description: "Summarize the selected project's current stage, gate, and focus."
              },
              {
                id: "next",
                label: "next",
                command: "npm run harness:next",
                launchMode: "pmw_phase1",
                sideEffect: "read_only",
                expectedEffect: "Read next action.",
                confirmationRequired: false,
                description: "Show the next recommended action for the selected project."
              },
              {
                id: "explain",
                label: "explain",
                command: "npm run harness:explain",
                launchMode: "pmw_phase1",
                sideEffect: "read_only",
                expectedEffect: "Read rationale.",
                confirmationRequired: false,
                description: "Explain the current state and operator-facing rationale."
              },
              {
                id: "validate",
                label: "validate",
                command: "npm run harness:validate",
                launchMode: "pmw_phase1",
                sideEffect: "validation",
                expectedEffect: "Run diagnostics.",
                confirmationRequired: false,
                description: "Run validator checks against the selected project's current truth surfaces."
              },
              {
                id: "handoff",
                label: "handoff",
                command: "npm run harness:handoff",
                launchMode: "pmw_phase1",
                sideEffect: "workflow_launch",
                expectedEffect: "Resolve handoff route.",
                confirmationRequired: true,
                description: "Launch the next approved workflow for the selected project based on handoff routing."
              },
              {
                id: "pmw-export",
                label: "pmw-export",
                command: "npm run harness:pmw-export",
                launchMode: "pmw_phase1",
                sideEffect: "derived_output",
                expectedEffect: "Regenerate PMW read-model artifacts.",
                confirmationRequired: true,
                description: "Regenerate the selected project's PMW read-model and manifest artifacts."
              }
            ],
            terminalOnly: [
              {
                id: "doctor",
                label: "doctor",
                command: "npm run harness:doctor",
                description: "Run environment and operator readiness checks from the selected project's terminal until PMW launch support is added."
              },
              {
                id: "test",
                label: "test",
                command: "npm test",
                description: "Run the selected project's test suite from the terminal until PMW command-panel support is added."
              },
              {
                id: "validation-report",
                label: "validation-report",
                command: "npm run harness:validation-report",
                description: "Persist validation evidence from the terminal until PMW command-panel support is added."
              }
            ],
            notes: [
              "PMW is a launcher and result-viewer surface, not the canonical write authority."
            ]
          },
          diagnostics: [
            {
              code: "handoff_route",
              severity: "info",
              owner: "developer",
              workflow: ".agents/workflows/dev.md"
            }
          ]
        }
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  return repoRoot;
}

function seedSiblingProjectPrefix(root, id) {
  const siblingRoot = path.join(root, `${id}-private`);
  fs.mkdirSync(siblingRoot, { recursive: true });
  fs.writeFileSync(path.join(siblingRoot, "SECRET.md"), "sibling secret\n", "utf8");
}

async function waitForCommandSession(port, projectId, commandId) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const res = await fetch(
      `http://127.0.0.1:${port}/api/read-model?project=${encodeURIComponent(projectId)}`
    );
    const payload = await res.json();
    const latest = payload.commandSession?.entries?.[0];
    if (!payload.commandSession?.running && latest?.commandId === commandId) {
      return payload.commandSession;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for PMW command session.");
}
