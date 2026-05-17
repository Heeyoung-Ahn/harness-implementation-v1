import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyStarterPayloadPath,
  shouldIncludeStarterPayloadPath,
  STARTER_PAYLOAD_CONTRACT
} from "../../installer/starter-payload-contract.js";

test("starter payload contract classifies required, conditional, and removable surfaces", () => {
  assert.equal(classifyStarterPayloadPath("AGENTS.md"), "required");
  assert.equal(classifyStarterPayloadPath(".agents/scripts/init-project.js"), "required");
  assert.equal(classifyStarterPayloadPath(".harness/runtime/state/init-project.js"), "required");
  assert.equal(classifyStarterPayloadPath("reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md"), "required");

  assert.equal(classifyStarterPayloadPath("README.md"), "conditional");
  assert.equal(classifyStarterPayloadPath("START_HERE.md"), "conditional");
  assert.equal(classifyStarterPayloadPath("reference/manuals/HARNESS_MANUAL.md"), "conditional");
  assert.equal(classifyStarterPayloadPath("reference/README.md"), "conditional");

  assert.equal(classifyStarterPayloadPath("HARNESS_MANUAL.md"), "removable");
  assert.equal(classifyStarterPayloadPath(".harness/operating_state.sqlite"), "removable");
  assert.equal(classifyStarterPayloadPath(".harness/operating_state.sqlite-wal"), "removable");
  assert.equal(classifyStarterPayloadPath(".agents/runtime/ACTIVE_CONTEXT.json"), "removable");
  assert.equal(classifyStarterPayloadPath(".agents/runtime/ACTIVE_CONTEXT.md"), "removable");
  assert.equal(classifyStarterPayloadPath(".agents/runtime/agent-traces/PLN-22.json"), "removable");
  assert.equal(classifyStarterPayloadPath(".agents/runtime/generated-state-docs/CURRENT_STATE.md"), "removable");
  assert.equal(classifyStarterPayloadPath(".agents/runtime/recovery-reports/context-repair.json"), "removable");
  assert.equal(classifyStarterPayloadPath(".agents/runtime/reports/CUTOVER_PREFLIGHT.json"), "removable");
  assert.equal(classifyStarterPayloadPath("reference/artifacts/WALKTHROUGH.md"), "removable");
  assert.equal(classifyStarterPayloadPath("reference/artifacts/REVIEW_REPORT.md"), "removable");
  assert.equal(classifyStarterPayloadPath("reference/artifacts/DECISION_LOG.md"), "removable");
  assert.equal(classifyStarterPayloadPath("reference/artifacts/HANDOFF_ARCHIVE.md"), "removable");
  assert.equal(classifyStarterPayloadPath("reference/artifacts/daily/TEMPLATE.md"), "removable");
});

test("starter payload contract includes required and conditional surfaces but excludes removable clutter", () => {
  assert.equal(shouldIncludeStarterPayloadPath("AGENTS.md"), true);
  assert.equal(shouldIncludeStarterPayloadPath("README.md"), true);
  assert.equal(shouldIncludeStarterPayloadPath("reference/manuals/HARNESS_MANUAL.md"), true);
  assert.equal(shouldIncludeStarterPayloadPath("reference/README.md"), true);
  assert.equal(shouldIncludeStarterPayloadPath("HARNESS_MANUAL.md"), false);
  assert.equal(shouldIncludeStarterPayloadPath(".harness/operating_state.sqlite"), false);
  assert.equal(shouldIncludeStarterPayloadPath(".agents/runtime/ACTIVE_CONTEXT.json"), false);
  assert.equal(shouldIncludeStarterPayloadPath(".agents/runtime/ACTIVE_CONTEXT.md"), false);
  assert.equal(shouldIncludeStarterPayloadPath(".agents/runtime/agent-traces/PLN-22.json"), false);
  assert.equal(shouldIncludeStarterPayloadPath(".agents/runtime/generated-state-docs/TASK_LIST.md"), false);
  assert.equal(shouldIncludeStarterPayloadPath(".agents/runtime/recovery-reports/latest-context-repair.json"), false);
  assert.equal(shouldIncludeStarterPayloadPath(".agents/runtime/reports/CUTOVER_PREFLIGHT.md"), false);
  assert.equal(shouldIncludeStarterPayloadPath("reference/artifacts/WALKTHROUGH.md"), false);
  assert.equal(shouldIncludeStarterPayloadPath("reference/artifacts/REVIEW_REPORT.md"), false);
  assert.equal(shouldIncludeStarterPayloadPath("reference/artifacts/daily/TEMPLATE.md"), false);
});

test("starter payload contract documents the slice-4 manifest categories", () => {
  assert.equal(STARTER_PAYLOAD_CONTRACT.version, "pln-22-slice-4-v1");
  assert.deepEqual(Object.keys(STARTER_PAYLOAD_CONTRACT.laneTypes), ["required", "conditional", "removable"]);
  assert.equal(
    STARTER_PAYLOAD_CONTRACT.laneTypes.conditional.includes("reference/manuals/HARNESS_MANUAL.md"),
    true
  );
  assert.equal(STARTER_PAYLOAD_CONTRACT.laneTypes.removable.includes(".harness/operating_state.sqlite"), true);
  assert.equal(STARTER_PAYLOAD_CONTRACT.laneTypes.removable.includes("HARNESS_MANUAL.md"), true);
  assert.equal(
    STARTER_PAYLOAD_CONTRACT.laneTypes.removable.includes(".agents/runtime/ACTIVE_CONTEXT.json"),
    true
  );
  assert.equal(
    STARTER_PAYLOAD_CONTRACT.laneTypes.removable.includes(".agents/runtime/agent-traces/*"),
    true
  );
  assert.equal(
    STARTER_PAYLOAD_CONTRACT.laneTypes.removable.includes(".agents/runtime/ACTIVE_CONTEXT.md"),
    true
  );
  assert.equal(
    STARTER_PAYLOAD_CONTRACT.laneTypes.removable.includes(".agents/runtime/recovery-reports/*"),
    true
  );
  assert.equal(
    STARTER_PAYLOAD_CONTRACT.laneTypes.removable.includes(".agents/runtime/reports/*"),
    true
  );
});
