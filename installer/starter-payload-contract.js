const REMOVABLE_MATCHERS = [
  { kind: "exact", value: "HARNESS_MANUAL.md" },
  { kind: "exact", value: ".harness/operating_state.sqlite" },
  { kind: "exact", value: ".harness/operating_state.sqlite-shm" },
  { kind: "exact", value: ".harness/operating_state.sqlite-wal" },
  { kind: "exact", value: ".agents/runtime/ACTIVE_CONTEXT.json" },
  { kind: "exact", value: ".agents/runtime/ACTIVE_CONTEXT.md" },
  { kind: "prefix", value: ".agents/runtime/generated-state-docs/" }
];

const CONDITIONAL_MATCHERS = [
  { kind: "exact", value: "README.md" },
  { kind: "exact", value: "START_HERE.md" },
  { kind: "exact", value: "reference/manuals/HARNESS_MANUAL.md" },
  { kind: "exact", value: "reference/README.md" },
  { kind: "exact", value: "reference/artifacts/DECISION_LOG.md" },
  { kind: "exact", value: "reference/artifacts/HANDOFF_ARCHIVE.md" },
  { kind: "exact", value: "reference/artifacts/REVIEW_REPORT.md" },
  { kind: "exact", value: "reference/artifacts/WALKTHROUGH.md" },
  { kind: "exact", value: "reference/legacy/README.md" },
  { kind: "exact", value: "reference/mockups/README.md" },
  { kind: "exact", value: "reference/reports/README.md" }
];

const REQUIRED_MATCHERS = [
  { kind: "exact", value: "AGENTS.md" },
  { kind: "exact", value: "INIT_STANDARD_HARNESS.cmd" },
  { kind: "exact", value: "package.json" },
  { kind: "prefix", value: ".agents/" },
  { kind: "prefix", value: ".harness/" },
  { kind: "prefix", value: "reference/artifacts/" },
  { kind: "prefix", value: "reference/packets/" },
  { kind: "prefix", value: "reference/planning/" },
  { kind: "prefix", value: "reference/profiles/" },
  { kind: "prefix", value: "reference/skills/" }
];

export const STARTER_PAYLOAD_CONTRACT = {
  version: "pln-20-slice-1-v1",
  laneTypes: {
    required: [
      "AGENTS.md",
      "INIT_STANDARD_HARNESS.cmd",
      "package.json",
      ".agents/*",
      ".harness/*",
      "reference/artifacts/* except explicitly conditional review/history docs",
      "reference/packets/*",
      "reference/planning/*",
      "reference/profiles/*",
      "reference/skills/*"
    ],
    conditional: [
      "README.md",
      "START_HERE.md",
      "reference/manuals/HARNESS_MANUAL.md",
      "reference/README.md",
      "reference/artifacts/DECISION_LOG.md",
      "reference/artifacts/HANDOFF_ARCHIVE.md",
      "reference/artifacts/REVIEW_REPORT.md",
      "reference/artifacts/WALKTHROUGH.md",
      "reference/legacy/README.md",
      "reference/mockups/README.md",
      "reference/reports/README.md"
    ],
    removable: [
      "HARNESS_MANUAL.md",
      ".harness/operating_state.sqlite",
      ".harness/operating_state.sqlite-shm",
      ".harness/operating_state.sqlite-wal",
      ".agents/runtime/ACTIVE_CONTEXT.json",
      ".agents/runtime/ACTIVE_CONTEXT.md",
      ".agents/runtime/generated-state-docs/*"
    ]
  }
};

export function classifyStarterPayloadPath(relativePath) {
  const normalized = normalizeRelativePath(relativePath);
  if (!normalized) {
    return "removable";
  }
  if (matchesAny(normalized, REMOVABLE_MATCHERS)) {
    return "removable";
  }
  if (matchesAny(normalized, CONDITIONAL_MATCHERS)) {
    return "conditional";
  }
  if (matchesAny(normalized, REQUIRED_MATCHERS)) {
    return "required";
  }
  return "conditional";
}

export function shouldIncludeStarterPayloadPath(relativePath) {
  return classifyStarterPayloadPath(relativePath) !== "removable";
}

function normalizeRelativePath(relativePath) {
  return String(relativePath ?? "").trim().replaceAll("\\", "/").replace(/^\/+/, "");
}

function matchesAny(relativePath, matchers) {
  return matchers.some((matcher) =>
    matcher.kind === "exact" ? relativePath === matcher.value : relativePath.startsWith(matcher.value)
  );
}
