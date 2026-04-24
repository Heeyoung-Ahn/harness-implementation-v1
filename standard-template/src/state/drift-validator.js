import fs from "node:fs";
import path from "node:path";

import { resolveGeneratedDocReadPath } from "./harness-paths.js";
import { CURRENT_STATE_DOC, TASK_LIST_DOC, calculateChecksum } from "./generate-state-docs.js";

const REQUIRED_SECTIONS = {
  [CURRENT_STATE_DOC]: ["## Current Focus Summary", "## Decision Required Summary", "## Decision Required Detail"],
  [TASK_LIST_DOC]: ["## Blocked / At Risk Summary", "## Blocked / At Risk Detail"]
};

const PACKET_TEMPLATE_PATH = "reference/packets/PKT-01_WORK_ITEM_PACKET_TEMPLATE.md";
const SOURCE_WAVE_LEDGER_PATH = "reference/artifacts/AUTHORITATIVE_SOURCE_WAVE_LEDGER.md";
const TASK_PACKET_DIRECTORY = "reference/packets";
const TASK_PACKET_ARTIFACT_CATEGORY = "task_packet";
const TASK_PACKET_DISCOVERY_EXCLUDED_FILES = new Set([
  path.basename(PACKET_TEMPLATE_PATH),
  "README.md"
]);
const TASK_PACKET_DISCOVERY_REQUIRED_MARKERS = [
  "## Quick Decision Header",
  "| Layer classification |",
  "| Domain foundation status |",
  "| Authoritative source intake status |",
  "- Required reading before code:"
];
const SOURCE_WAVE_LEDGER_REQUIRED_MARKERS = [
  "## Approval Rule",
  "## 4. Impacted Packet Set",
  "## 8. Packet Citation Rule",
  "| Packet path | Prior source snapshot | Required action | Rebaseline status | Notes |"
];
const PACKET_TEMPLATE_REQUIRED_MARKERS = [
  "| Layer classification |",
  "| Active profile dependencies |",
  "| Profile evidence status |",
  "| Shared-source wave status |",
  "| Layer classification agreement |",
  "| Optional profile evidence approval |",
  "- Active profile references:",
  "- Profile composition rationale:",
  "- Active profile dependencies:",
  "- Profile-specific evidence status:",
  "- UX archetype reference:",
  "- Environment topology reference:",
  "- Domain foundation reference:",
  "- Authoritative source intake reference:",
  "- Impacted packet set scope:",
  "- Authoritative source wave ledger reference:",
  "- Source wave packet disposition:",
  "- Packet exit quality gate reference:",
  "- Improvement candidate reference:",
  "- Primary admin entity / surface:",
  "- Grid interaction model:",
  "- Search / filter / sort / pagination behavior:",
  "- Row action / bulk action rule:",
  "- Edit / save / confirm / audit pattern:",
  "- Source spreadsheet artifact:",
  "- Workbook / sheet / tab / range trace:",
  "- Header / column mapping:",
  "- Row key / record identity rule:",
  "- Source snapshot / version:",
  "- Transformation / normalization assumptions:",
  "- Reconciliation / overwrite rule:",
  "- Transfer package / bundle artifact:",
  "- Transfer medium / handoff channel:",
  "- Checksum / integrity evidence:",
  "- Offline dependency bundle status:",
  "- Ingress verification / import step:",
  "- Rollback package / recovery bundle:",
  "- Manual custody / operator handoff:"
];

const OPTIONAL_PROFILE_REQUIREMENTS = [
  {
    profileId: "PRF-01",
    relativePath: "reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Primary admin entity / surface:",
      "- Grid interaction model:",
      "- Search / filter / sort / pagination behavior:",
      "- Row action / bulk action rule:",
      "- Edit / save pattern:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-02",
    relativePath: "reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Source spreadsheet artifact:",
      "- Workbook / sheet / tab / range trace:",
      "- Header / column mapping:",
      "- Row key / record identity rule:",
      "- Source snapshot / version:",
      "- Transformation / normalization assumptions:",
      "- Reconciliation / overwrite rule:",
      "- Profile deviation / exception:"
    ]
  },
  {
    profileId: "PRF-03",
    relativePath: "reference/profiles/PRF-03_AIRGAPPED_DELIVERY_PROFILE.md",
    requiredMarkers: [
      "## Approval Rule",
      "## 8. Required Packet Evidence",
      "## 10. Packet Citation Rule",
      "- Active profile references:",
      "- Transfer package / bundle artifact:",
      "- Transfer medium / handoff channel:",
      "- Checksum / integrity evidence:",
      "- Offline dependency bundle status:",
      "- Ingress verification / import step:",
      "- Rollback package / recovery bundle:",
      "- Manual custody / operator handoff:",
      "- Profile deviation / exception:"
    ]
  }
];

const TASK_PACKET_REQUIRED_HEADER_ITEMS = [
  { label: "Ready For Code" },
  { label: "User-facing impact" },
  { label: "Layer classification" },
  { label: "Active profile dependencies", aliases: ["Active profile dependency"] },
  { label: "Profile evidence status" },
  { label: "UX archetype status" },
  { label: "Environment topology status" },
  { label: "Domain foundation status" },
  { label: "Authoritative source intake status" },
  { label: "Shared-source wave status" },
  { label: "Packet exit gate status" },
  { label: "Existing system dependency" },
  { label: "New authoritative source impact" }
];

const TASK_PACKET_PROFILE_FIELD_REQUIREMENTS = {
  "PRF-01": [
    "Primary admin entity / surface",
    "Grid interaction model",
    "Search / filter / sort / pagination behavior",
    "Row action / bulk action rule",
    "Edit / save / confirm / audit pattern"
  ],
  "PRF-02": [
    "Source spreadsheet artifact",
    "Workbook / sheet / tab / range trace",
    "Header / column mapping",
    "Row key / record identity rule",
    "Source snapshot / version",
    "Transformation / normalization assumptions",
    "Reconciliation / overwrite rule"
  ],
  "PRF-03": [
    "Transfer package / bundle artifact",
    "Transfer medium / handoff channel",
    "Checksum / integrity evidence",
    "Offline dependency bundle status",
    "Ingress verification / import step",
    "Rollback package / recovery bundle",
    "Manual custody / operator handoff"
  ]
};

export function validateGeneratedStateDocs({
  store,
  outputDir = process.cwd(),
  repoRoot = outputDir
}) {
  const findings = [];
  const currentStatePath = resolveGeneratedDocReadPath({ outputDir, docName: CURRENT_STATE_DOC });
  const taskListPath = resolveGeneratedDocReadPath({ outputDir, docName: TASK_LIST_DOC });

  const currentStateContent = readUtf8File(currentStatePath, findings);
  const taskListContent = readUtf8File(taskListPath, findings);

  if (currentStateContent != null) {
    validateRequiredSections(CURRENT_STATE_DOC, currentStateContent, findings);
    validateProjectionState(store, CURRENT_STATE_DOC, currentStateContent, findings);
    validateDecisionParity(store, currentStateContent, findings);
  }

  if (taskListContent != null) {
    validateRequiredSections(TASK_LIST_DOC, taskListContent, findings);
    validateProjectionState(store, TASK_LIST_DOC, taskListContent, findings);
    validateRiskParity(store, taskListContent, findings);
  }

  validateSourceRefs(store, repoRoot, findings);
  validateFreshness(store, findings);
  validateProfileAwareContracts(repoRoot, findings);
  validateRegisteredTaskPackets(store, repoRoot, findings);

  const blockingFindings = findings.filter((finding) => finding.severity === "error");
  const cutoverReady = blockingFindings.length === 0;

  if (!cutoverReady) {
    findings.push({
      code: "cutover_preflight_failed",
      severity: "error",
      message: "Cutover preflight failed because unresolved generated-doc findings remain."
    });
  }

  return {
    ok: blockingFindings.length === 0,
    cutoverReady,
    findings
  };
}

function readUtf8File(filePath, findings) {
  return readRequiredUtf8File({
    filePath,
    findings,
    missingCode: "generated_doc_missing",
    missingMessage: `Missing generated doc: ${path.basename(filePath)}`,
    pathKey: "path"
  });
}

function readRequiredUtf8File({
  filePath,
  findings,
  missingCode,
  missingMessage,
  pathKey = "path"
}) {
  if (!fs.existsSync(filePath)) {
    findings.push({
      code: missingCode,
      severity: "error",
      [pathKey]: filePath,
      message: missingMessage
    });
    return null;
  }

  const buffer = fs.readFileSync(filePath);
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    findings.push({
      code: "utf8_bom_detected",
      severity: "error",
      path: filePath,
      message: `${path.basename(filePath)} must be UTF-8 without BOM.`
    });
  }

  const content = buffer.toString("utf8");
  if (content.includes("\uFFFD")) {
    findings.push({
      code: "mojibake_detected",
      severity: "error",
      path: filePath,
      message: `${path.basename(filePath)} contains replacement characters that indicate mojibake.`
    });
  }

  return content;
}

function validateProfileAwareContracts(repoRoot, findings) {
  validateContractMarkers({
    repoRoot,
    relativePath: PACKET_TEMPLATE_PATH,
    requiredMarkers: PACKET_TEMPLATE_REQUIRED_MARKERS,
    missingFileCode: "packet_template_missing",
    missingMarkerCode: "packet_template_field_missing",
    findings
  });

  validateContractMarkers({
    repoRoot,
    relativePath: SOURCE_WAVE_LEDGER_PATH,
    requiredMarkers: SOURCE_WAVE_LEDGER_REQUIRED_MARKERS,
    missingFileCode: "source_wave_ledger_missing",
    missingMarkerCode: "source_wave_ledger_field_missing",
    findings
  });

  for (const profile of OPTIONAL_PROFILE_REQUIREMENTS) {
    validateContractMarkers({
      repoRoot,
      relativePath: profile.relativePath,
      requiredMarkers: profile.requiredMarkers,
      missingFileCode: "optional_profile_artifact_missing",
      missingMarkerCode: "optional_profile_evidence_missing",
      findings,
      profileId: profile.profileId
    });
  }
}

function validateRegisteredTaskPackets(store, repoRoot, findings) {
  const registeredArtifacts = store.listArtifacts({ category: TASK_PACKET_ARTIFACT_CATEGORY });

  for (const artifact of registeredArtifacts) {
    validateRegisteredTaskPacket({ artifact, repoRoot, findings });
  }

  for (const packetPath of discoverConcreteTaskPacketCandidates(repoRoot)) {
    const existingArtifact = store.getArtifactByPath(packetPath);
    if (existingArtifact?.category === TASK_PACKET_ARTIFACT_CATEGORY) {
      continue;
    }

    if (!existingArtifact) {
      findings.push({
        code: "task_packet_registration_missing",
        severity: "error",
        packetPath,
        message:
          `${packetPath} matches the current concrete task-packet contract under ${TASK_PACKET_DIRECTORY} ` +
          `but is not registered in artifact_index as category ${TASK_PACKET_ARTIFACT_CATEGORY}.`
      });
      validateRegisteredTaskPacket({
        artifact: createDiscoveredTaskPacketArtifact(packetPath),
        repoRoot,
        findings
      });
      continue;
    }

    findings.push({
      code: "task_packet_registration_category_mismatch",
      severity: "error",
      artifactId: existingArtifact.artifactId,
      packetPath,
      category: existingArtifact.category,
      message:
        `${packetPath} matches the current concrete task-packet contract under ${TASK_PACKET_DIRECTORY} ` +
        `but artifact_index registers it as category ${existingArtifact.category} instead of ${TASK_PACKET_ARTIFACT_CATEGORY}.`
    });
    validateRegisteredTaskPacket({ artifact: existingArtifact, repoRoot, findings });
  }
}

function validateRegisteredTaskPacket({ artifact, repoRoot, findings }) {
  const packetPath = path.resolve(repoRoot, artifact.path);
  const content = readRequiredUtf8File({
    filePath: packetPath,
    findings,
    missingCode: "task_packet_missing",
    missingMessage: `Missing registered task packet artifact: ${artifact.path}.`,
    pathKey: "packetPath"
  });

  if (content == null) {
    const finding = findings.at(-1);
    if (finding?.code === "task_packet_missing") {
      finding.artifactId = artifact.artifactId;
      finding.packetPath = artifact.path;
    }
    return;
  }

  const header = parseQuickDecisionHeader(content);
  if (!header) {
    findings.push({
      code: "task_packet_header_missing",
      severity: "error",
      artifactId: artifact.artifactId,
      packetPath: artifact.path,
      message: `${artifact.path} is missing the Quick Decision Header table required for task-packet validation.`
    });
    return;
  }

  const fields = parseBulletFields(content);
  validateTaskPacketHeader({ artifact, header, findings });
  validateTaskPacketEvidence({ artifact, header, fields, repoRoot, findings });
}

function validateTaskPacketHeader({ artifact, header, findings }) {
  for (const item of TASK_PACKET_REQUIRED_HEADER_ITEMS) {
    const row = getHeaderRow(header, item.label, item.aliases);
    if (!row) {
      findings.push({
        code: "task_packet_header_field_missing",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: item.label,
        message: `${artifact.path} is missing Quick Decision Header row ${item.label}.`
      });
      continue;
    }

    if (!hasStatedHeaderValue(row.proposed)) {
      findings.push({
        code: "task_packet_header_value_missing",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: item.label,
        message: `${artifact.path} does not provide a concrete proposed value for ${item.label}.`
      });
    }
  }
}

function validateTaskPacketEvidence({ artifact, header, fields, repoRoot, findings }) {
  const readyForCode = normalizeValue(getHeaderProposed(header, "Ready For Code"));
  const readyForCodeApproved = readyForCode === "approve" || readyForCode === "approved";
  const userFacingImpact = normalizeValue(getHeaderProposed(header, "User-facing impact"));
  const profileDependencies = extractProfileIds(
    getHeaderProposedWithAliases(header, "Active profile dependencies", ["Active profile dependency"])
  );
  const profileEvidenceStatus = normalizeValue(getHeaderProposed(header, "Profile evidence status"));
  const uxArchetypeStatus = normalizeValue(getHeaderProposed(header, "UX archetype status"));
  const uxDeviationStatus = normalizeValue(getHeaderProposed(header, "UX deviation status"));
  const environmentTopologyStatus = normalizeValue(getHeaderProposed(header, "Environment topology status"));
  const domainFoundationStatus = normalizeValue(getHeaderProposed(header, "Domain foundation status"));
  const authoritativeSourceStatus = normalizeValue(getHeaderProposed(header, "Authoritative source intake status"));
  const sharedSourceWaveStatus = normalizeValue(getHeaderProposed(header, "Shared-source wave status"));
  const packetExitGateStatus = normalizeValue(getHeaderProposed(header, "Packet exit gate status"));
  const existingSystemDependency = normalizeValue(getHeaderProposed(header, "Existing system dependency"));
  const newAuthoritativeSourceImpact = normalizeValue(getHeaderProposed(header, "New authoritative source impact"));
  const schemaImpactClassification = getFieldValue(fields, "Schema impact classification");
  const impactedPacketSetScope = normalizeValue(getFieldValue(fields, "Impacted packet set scope"));
  const sourceWaveLedgerReference = getFieldValue(fields, "Authoritative source wave ledger reference");
  const sourceWavePacketDisposition = normalizeValue(getFieldValue(fields, "Source wave packet disposition"));

  requireTaskPacketField({
    artifact,
    fields,
    label: "Layer classification",
    findings,
    message: "Registered task packets must record Layer classification."
  });

  requireTaskPacketField({
    artifact,
    fields,
    label: "Required reading before code",
    findings,
    message: "Registered task packets must record Required reading before code."
  });

  if (profileDependencies.length > 0) {
    requireTaskPacketField({
      artifact,
      fields,
      label: "Active profile references",
      aliases: ["Active profile reference"],
      findings,
      message: `Task packet ${artifact.path} declares active optional profiles but does not cite Active profile references.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Profile-specific evidence status",
      findings,
      message: `Task packet ${artifact.path} declares active optional profiles but does not record Profile-specific evidence status.`
    });

    if (profileDependencies.length > 1) {
      requireTaskPacketField({
        artifact,
        fields,
        label: "Profile composition rationale",
        findings,
        message: `${artifact.path} declares multiple active optional profiles but does not record Profile composition rationale.`
      });
    }

    const activeProfileReferences = getFieldValueWithAliases(fields, [
      "Active profile references",
      "Active profile reference"
    ]);
    if (hasConcreteValue(activeProfileReferences)) {
      for (const profileDependency of profileDependencies) {
        if (activeProfileReferences.includes(`reference/profiles/${profileDependency}_`)) {
          continue;
        }

        findings.push({
          code: "task_packet_status_contract_mismatch",
          severity: "error",
          artifactId: artifact.artifactId,
          packetPath: artifact.path,
          headerItem: "Active profile dependencies",
          message: `${artifact.path} declares ${profileDependency} but Active profile references does not cite that profile.`
        });
      }
    }

    if (readyForCodeApproved && profileEvidenceStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Profile evidence status",
        message: `${artifact.path} is marked Ready For Code approve while Profile evidence status is ${profileEvidenceStatus || "missing"}.`
      });
    }

    if (readyForCodeApproved || profileEvidenceStatus === "approved") {
      const requiredProfileFields = new Set();
      for (const profileDependency of profileDependencies) {
        for (const label of TASK_PACKET_PROFILE_FIELD_REQUIREMENTS[profileDependency] ?? []) {
          requiredProfileFields.add(label);
        }
      }

      for (const label of requiredProfileFields) {
        requireTaskPacketField({
          artifact,
          fields,
          label,
          findings,
          message: `${artifact.path} is missing ${label} required by one of its active optional profiles.`
        });
      }
    }
  }

  if (userFacingImpact && userFacingImpact !== "none") {
    requireTaskPacketField({
      artifact,
      fields,
      label: "UX archetype reference",
      findings,
      message: `${artifact.path} has user-facing impact but does not cite a UX archetype reference.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Selected UX archetype",
      findings,
      message: `${artifact.path} has user-facing impact but does not record Selected UX archetype.`
    });

    if (readyForCodeApproved && uxArchetypeStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "UX archetype status",
        message: `${artifact.path} is marked Ready For Code approve while UX archetype status is ${uxArchetypeStatus || "missing"}.`
      });
    }

    if (uxDeviationStatus && uxDeviationStatus !== "none") {
      requireTaskPacketField({
        artifact,
        fields,
        label: "Archetype deviation / approval",
        findings,
        message: `${artifact.path} declares UX deviation but does not record Archetype deviation / approval.`
      });
    }
  }

  if (environmentTopologyStatus && environmentTopologyStatus !== "not-needed") {
    for (const label of [
      "Environment topology reference",
      "Source environment",
      "Target environment",
      "Execution target",
      "Transfer boundary",
      "Rollback boundary"
    ]) {
      requireTaskPacketField({
        artifact,
        fields,
        label,
        findings,
        message: `${artifact.path} is missing ${label} required by the environment topology contract.`
      });
    }

    if (readyForCodeApproved && environmentTopologyStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Environment topology status",
        message: `${artifact.path} is marked Ready For Code approve while Environment topology status is ${environmentTopologyStatus || "missing"}.`
      });
    }
  }

  if (
    (domainFoundationStatus && domainFoundationStatus !== "not-needed") ||
    (existingSystemDependency && existingSystemDependency !== "none") ||
    hasConcreteValue(schemaImpactClassification, { allowNone: false, allowUnknown: false })
  ) {
    requireTaskPacketField({
      artifact,
      fields,
      label: "Domain foundation reference",
      findings,
      message: `${artifact.path} requires data-impact evidence but does not cite Domain foundation reference.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Schema impact classification",
      findings,
      message: `${artifact.path} requires data-impact evidence but does not record Schema impact classification.`,
      allowUnknown: false
    });

    if (readyForCodeApproved && domainFoundationStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Domain foundation status",
        message: `${artifact.path} is marked Ready For Code approve while Domain foundation status is ${domainFoundationStatus || "missing"}.`
      });
    }

    if (existingSystemDependency === "confirmed") {
      for (const label of [
        "Existing schema source artifact",
        "Table / column naming compatibility",
        "Data operation / ownership compatibility",
        "Migration / rollback / cutover compatibility"
      ]) {
        requireTaskPacketField({
          artifact,
          fields,
          label,
          findings,
          message: `${artifact.path} confirms an existing-system dependency but does not record ${label}.`
        });
      }
    }
  }

  if (
    (authoritativeSourceStatus && authoritativeSourceStatus !== "not-needed") ||
    (newAuthoritativeSourceImpact && newAuthoritativeSourceImpact !== "none")
  ) {
    for (const label of [
      "Authoritative source intake reference",
      "Authoritative source disposition",
      "Current implementation impact"
    ]) {
      requireTaskPacketField({
        artifact,
        fields,
        label,
        findings,
        message: `${artifact.path} requires authoritative-source evidence but does not record ${label}.`
      });
    }

    requireTaskPacketField({
      artifact,
      fields,
      label: "Existing plan conflict",
      findings,
      message: `${artifact.path} requires authoritative-source evidence but does not record Existing plan conflict.`,
      allowNone: true
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Impacted packet set scope",
      findings,
      message: `${artifact.path} requires authoritative-source evidence but does not record Impacted packet set scope.`,
      allowNone: false,
      allowUnknown: false
    });

    if (readyForCodeApproved && authoritativeSourceStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Authoritative source intake status",
        message: `${artifact.path} is marked Ready For Code approve while Authoritative source intake status is ${authoritativeSourceStatus || "missing"}.`
      });
    }
  }

  if (impactedPacketSetScope === "multi-packet" || (sharedSourceWaveStatus && sharedSourceWaveStatus !== "not-needed")) {
    requireTaskPacketField({
      artifact,
      fields,
      label: "Authoritative source wave ledger reference",
      findings,
      message: `${artifact.path} participates in a shared-source wave but does not cite Authoritative source wave ledger reference.`
    });
    requireTaskPacketField({
      artifact,
      fields,
      label: "Source wave packet disposition",
      findings,
      message: `${artifact.path} participates in a shared-source wave but does not record Source wave packet disposition.`,
      allowNone: false,
      allowUnknown: false
    });

    if (impactedPacketSetScope === "multi-packet" && sharedSourceWaveStatus === "not-needed") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Shared-source wave status",
        message: `${artifact.path} declares multi-packet source-wave impact while Shared-source wave status is not-needed.`
      });
    }

    if (impactedPacketSetScope !== "multi-packet" && sharedSourceWaveStatus && sharedSourceWaveStatus !== "not-needed") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Shared-source wave status",
        message: `${artifact.path} records Shared-source wave status ${sharedSourceWaveStatus} without declaring multi-packet source-wave scope.`
      });
    }

    if (readyForCodeApproved && sharedSourceWaveStatus !== "approved") {
      findings.push({
        code: "task_packet_status_contract_mismatch",
        severity: "error",
        artifactId: artifact.artifactId,
        packetPath: artifact.path,
        headerItem: "Shared-source wave status",
        message: `${artifact.path} is marked Ready For Code approve while Shared-source wave status is ${sharedSourceWaveStatus || "missing"}.`
      });
    }

    if (
      hasConcreteValue(sourceWaveLedgerReference) &&
      hasConcreteValue(sourceWavePacketDisposition, { allowNone: false, allowUnknown: false })
    ) {
      validateSourceWaveLedgerMembership({
        artifact,
        ledgerReference: sourceWaveLedgerReference,
        packetDisposition: sourceWavePacketDisposition,
        repoRoot,
        findings
      });
    }
  }

  if (packetExitGateStatus === "approved") {
    for (const label of [
      "Packet exit quality gate reference",
      "Exit recommendation",
      "Source parity result",
      "Validation / security / cleanup evidence"
    ]) {
      requireTaskPacketField({
        artifact,
        fields,
        label,
        findings,
        message: `${artifact.path} marks Packet exit gate as approved but does not record ${label}.`
      });
    }
  }
}

function requireTaskPacketField({
  artifact,
  fields,
  label,
  aliases = [],
  findings,
  message,
  allowNone = false,
  allowUnknown = false
}) {
  const value = getFieldValueWithAliases(fields, [label, ...aliases]);
  if (hasConcreteValue(value, { allowNone, allowUnknown })) {
    return;
  }

  findings.push({
    code: "task_packet_required_evidence_missing",
    severity: "error",
    artifactId: artifact.artifactId,
    packetPath: artifact.path,
    field: label,
    message
  });
}

function validateContractMarkers({
  repoRoot,
  relativePath,
  requiredMarkers,
  missingFileCode,
  missingMarkerCode,
  findings,
  profileId = null
}) {
  const resolvedPath = path.resolve(repoRoot, relativePath);
  const content = readRequiredUtf8File({
    filePath: resolvedPath,
    findings,
    missingCode: missingFileCode,
    missingMessage: `Missing required contract artifact: ${relativePath}.`,
    pathKey: "contractPath"
  });
  if (content == null) {
    if (findings.at(-1)?.code === missingFileCode) {
      findings.at(-1).contractPath = relativePath;
      if (profileId) {
        findings.at(-1).profileId = profileId;
      }
    }
    return;
  }

  for (const marker of requiredMarkers) {
    if (content.includes(marker)) {
      continue;
    }

    findings.push({
      code: missingMarkerCode,
      severity: "error",
      contractPath: relativePath,
      profileId,
      marker,
      message: `${relativePath} is missing required marker ${marker}.`
    });
  }
}

function parseQuickDecisionHeader(content) {
  const section = sliceSection(content, "## Quick Decision Header");
  if (!section) {
    return null;
  }

  const tableLines = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  if (tableLines.length < 3) {
    return null;
  }

  const rows = new Map();
  for (const line of tableLines.slice(2)) {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 4 || !cells[0] || cells[0].startsWith("---")) {
      continue;
    }

    rows.set(cells[0], {
      proposed: cells[1],
      why: cells[2],
      status: cells[3]
    });
  }

  return rows;
}

function parseBulletFields(content) {
  const fields = new Map();

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    const match = line.match(/^- ([^:]+):(.*)$/);
    if (!match) {
      continue;
    }

    fields.set(match[1].trim(), match[2].trim());
  }

  return fields;
}

function getHeaderProposed(header, item) {
  return header.get(item)?.proposed ?? "";
}

function getHeaderProposedWithAliases(header, item, aliases = []) {
  return getHeaderRow(header, item, aliases)?.proposed ?? "";
}

function getHeaderRow(header, item, aliases = []) {
  for (const candidate of [item, ...aliases]) {
    const row = header.get(candidate);
    if (row) {
      return row;
    }
  }

  return null;
}

function getFieldValue(fields, label) {
  return fields.get(label) ?? "";
}

function getFieldValueWithAliases(fields, labels) {
  for (const label of labels) {
    const value = getFieldValue(fields, label);
    if (value) {
      return value;
    }
  }

  return "";
}

function hasStatedHeaderValue(value) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed === "-" || trimmed.includes("[") || trimmed.includes("]")) {
    return false;
  }

  return !trimmed.includes(" / ");
}

function hasConcreteValue(value, { allowNone = false, allowUnknown = true } = {}) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  const normalized = normalizeValue(trimmed);
  if (!trimmed || trimmed === "-" || trimmed.includes("[") || trimmed.includes("]")) {
    return false;
  }
  if (!allowNone && normalized === "none") {
    return false;
  }
  if (!allowUnknown && normalized === "unknown") {
    return false;
  }
  return true;
}

function normalizeValue(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function extractProfileIds(value) {
  const matches = value.match(/PRF-\d+/gi) ?? [];
  return [...new Set(matches.map((match) => match.toUpperCase()))];
}

function validateSourceWaveLedgerMembership({
  artifact,
  ledgerReference,
  packetDisposition,
  repoRoot,
  findings
}) {
  const ledgerPath = path.resolve(repoRoot, ledgerReference);
  const content = readRequiredUtf8File({
    filePath: ledgerPath,
    findings,
    missingCode: "source_wave_ledger_instance_missing",
    missingMessage: `${artifact.path} cites missing authoritative source wave ledger ${ledgerReference}.`,
    pathKey: "contractPath"
  });

  if (content == null) {
    const finding = findings.at(-1);
    if (finding?.code === "source_wave_ledger_instance_missing") {
      finding.artifactId = artifact.artifactId;
      finding.packetPath = artifact.path;
      finding.contractPath = ledgerReference;
    }
    return;
  }

  const packetRow = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.includes(`| ${artifact.path} |`));

  if (!packetRow) {
    findings.push({
      code: "source_wave_packet_missing_from_ledger",
      severity: "error",
      artifactId: artifact.artifactId,
      packetPath: artifact.path,
      contractPath: ledgerReference,
      message: `${artifact.path} cites ${ledgerReference} but the impacted packet set does not include that packet path.`
    });
    return;
  }

  if (!packetRow.toLowerCase().includes(packetDisposition)) {
    findings.push({
      code: "source_wave_packet_disposition_mismatch",
      severity: "error",
      artifactId: artifact.artifactId,
      packetPath: artifact.path,
      contractPath: ledgerReference,
      message: `${artifact.path} records Source wave packet disposition ${packetDisposition} but ${ledgerReference} does not match that disposition in the impacted packet row.`
    });
  }
}

function discoverConcreteTaskPacketCandidates(repoRoot) {
  const packetDir = path.resolve(repoRoot, TASK_PACKET_DIRECTORY);
  if (!fs.existsSync(packetDir)) {
    return [];
  }

  return fs
    .readdirSync(packetDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .filter((entry) => path.extname(entry.name).toLowerCase() === ".md")
    .filter((entry) => !TASK_PACKET_DISCOVERY_EXCLUDED_FILES.has(entry.name))
    .map((entry) => ({
      relativePath: `${TASK_PACKET_DIRECTORY}/${entry.name}`,
      absolutePath: path.join(packetDir, entry.name)
    }))
    .filter(({ absolutePath }) => looksLikeConcreteTaskPacket(fs.readFileSync(absolutePath, "utf8")))
    .map(({ relativePath }) => relativePath);
}

function looksLikeConcreteTaskPacket(content) {
  if (!content) {
    return false;
  }

  const hasRequiredMarkers = TASK_PACKET_DISCOVERY_REQUIRED_MARKERS.every((marker) => content.includes(marker));
  if (!hasRequiredMarkers) {
    return false;
  }

  return (
    content.includes("| Active profile dependencies |") ||
    content.includes("| Active profile dependency |")
  );
}

function createDiscoveredTaskPacketArtifact(packetPath) {
  return {
    artifactId: `discovered:${packetPath}`,
    path: packetPath
  };
}

function validateRequiredSections(projectionName, content, findings) {
  for (const section of REQUIRED_SECTIONS[projectionName] ?? []) {
    if (!content.includes(section)) {
      findings.push({
        code: "required_section_missing",
        severity: "error",
        projectionName,
        section,
        message: `${projectionName} is missing required section ${section}.`
      });
    }
  }
}

function validateProjectionState(store, projectionName, content, findings) {
  const projection = store.getGenerationState(projectionName);
  if (!projection) {
    findings.push({
      code: "generation_state_missing",
      severity: "error",
      projectionName,
      message: `${projectionName} has no generation_state row.`
    });
    return;
  }

  const checksum = calculateChecksum(content);
  if (projection.checksum !== checksum) {
    findings.push({
      code: "checksum_mismatch",
      severity: "error",
      projectionName,
      message: `${projectionName} checksum does not match generation_state.`
    });
  }
}

function validateDecisionParity(store, content, findings) {
  const openDecisions = store.listDecisions({ status: "open", decisionNeeded: true });
  const summaryCount = extractSummaryCount(content, "## Decision Required Summary");
  const detailCount = countTableRows(content, "## Decision Required Detail");

  if (summaryCount !== openDecisions.length) {
    findings.push({
      code: "generated_docs_parity_mismatch",
      severity: "error",
      projectionName: CURRENT_STATE_DOC,
      message: `Decision summary count ${summaryCount} does not match DB count ${openDecisions.length}.`
    });
  }

  if (summaryCount !== detailCount) {
    findings.push({
      code: "count_detail_parity_mismatch",
      severity: "error",
      projectionName: CURRENT_STATE_DOC,
      message: `Decision summary count ${summaryCount} does not match detail row count ${detailCount}.`
    });
  }
}

function validateRiskParity(store, content, findings) {
  const openRisks = store.listGateRisks({ status: "open" });
  const summaryCount = extractSummaryCount(content, "## Blocked / At Risk Summary");
  const detailCount = countTableRows(content, "## Blocked / At Risk Detail");

  if (summaryCount !== openRisks.length) {
    findings.push({
      code: "generated_docs_parity_mismatch",
      severity: "error",
      projectionName: TASK_LIST_DOC,
      message: `Blocked/risk summary count ${summaryCount} does not match DB count ${openRisks.length}.`
    });
  }

  if (summaryCount !== detailCount) {
    findings.push({
      code: "count_detail_parity_mismatch",
      severity: "error",
      projectionName: TASK_LIST_DOC,
      message: `Blocked/risk summary count ${summaryCount} does not match detail row count ${detailCount}.`
    });
  }
}

function validateSourceRefs(store, repoRoot, findings) {
  const releaseState = store.getReleaseState("current");
  const entries = [
    ...wrapSourceRefs("release_state", releaseState ? [releaseState] : []),
    ...wrapSourceRefs("work_item_registry", store.listWorkItems()),
    ...wrapSourceRefs("decision_registry", store.listDecisions()),
    ...wrapSourceRefs("gate_risk_registry", store.listGateRisks()),
    ...wrapSourceRefs("handoff_log", store.listRecentHandoffs(50)),
    ...wrapSourceRefs("artifact_index", store.listArtifacts())
  ];

  for (const entry of entries) {
    if (!entry.sourceRef) {
      continue;
    }

    const resolved = path.resolve(repoRoot, entry.sourceRef);
    if (!fs.existsSync(resolved)) {
      findings.push({
        code: "source_ref_unresolved",
        severity: "error",
        rowType: entry.rowType,
        rowId: entry.rowId,
        sourceRef: entry.sourceRef,
        message: `${entry.rowType}:${entry.rowId} points to missing source_ref ${entry.sourceRef}.`
      });
    }
  }
}

function validateFreshness(store, findings) {
  const latestSourceChange = store.getLatestOperationalTimestamp();
  if (!latestSourceChange) {
    return;
  }

  for (const projectionName of [CURRENT_STATE_DOC, TASK_LIST_DOC]) {
    const projection = store.getGenerationState(projectionName);
    if (!projection) {
      continue;
    }

    if (projection.generatedAt < latestSourceChange) {
      findings.push({
        code: "freshness_drift_detected",
        severity: "error",
        projectionName,
        message: `${projectionName} is stale relative to the latest DB mutation timestamp.`
      });
    }
  }
}

function extractSummaryCount(content, sectionHeading) {
  const section = sliceSection(content, sectionHeading);
  if (!section) {
    return -1;
  }

  const firstBullet = section
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("- "));
  if (!firstBullet) {
    return -1;
  }

  const match = firstBullet.match(/(\d+)/);
  return match ? Number(match[1]) : -1;
}

function countTableRows(content, sectionHeading) {
  const section = sliceSection(content, sectionHeading);
  if (!section) {
    return -1;
  }

  const lines = section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|"));

  if (lines.length < 3) {
    return 0;
  }

  const dataRows = lines.slice(2);
  if (dataRows.length === 1 && isEmptyPlaceholderRow(dataRows[0])) {
    return 0;
  }

  return dataRows.length;
}

function sliceSection(content, sectionHeading) {
  const start = content.indexOf(sectionHeading);
  if (start === -1) {
    return null;
  }

  const afterStart = content.slice(start + sectionHeading.length).trimStart();
  const nextHeadingMatch = afterStart.match(/\n##\s+/);
  if (!nextHeadingMatch) {
    return afterStart;
  }

  return afterStart.slice(0, nextHeadingMatch.index).trimEnd();
}

function wrapSourceRefs(rowType, rows) {
  return rows.map((row) => ({
    rowType,
    rowId:
      row.releaseId ??
      row.workItemId ??
      row.decisionId ??
      row.riskId ??
      row.handoffId ??
      row.artifactId ??
      "unknown",
    sourceRef: row.sourceRef ?? null
  }));
}

function isEmptyPlaceholderRow(row) {
  const cells = row
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);

  return cells[0] === "-";
}
