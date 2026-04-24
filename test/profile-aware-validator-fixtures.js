import fs from "node:fs";
import path from "node:path";

const PACKET_TEMPLATE_FIXTURE = `# Work Item Packet Template

| Layer classification | core / optional profile / project packet | rationale | draft |
| Active profile dependencies | none / [profile ids] | rationale | draft |
| Profile evidence status | not-needed / pending / approved | rationale | draft |
| Shared-source wave status | not-needed / pending / approved | rationale | draft |

- Active profile references:
- Profile composition rationale:
- Active profile dependencies:
- Profile-specific evidence status:
- UX archetype reference:
- Environment topology reference:
- Domain foundation reference:
- Authoritative source intake reference:
- Impacted packet set scope:
- Authoritative source wave ledger reference:
- Source wave packet disposition:
- Packet exit quality gate reference:
- Improvement candidate reference:
- Primary admin entity / surface:
- Grid interaction model:
- Search / filter / sort / pagination behavior:
- Row action / bulk action rule:
- Edit / save / confirm / audit pattern:
- Source spreadsheet artifact:
- Workbook / sheet / tab / range trace:
- Header / column mapping:
- Row key / record identity rule:
- Source snapshot / version:
- Transformation / normalization assumptions:
- Reconciliation / overwrite rule:
- Transfer package / bundle artifact:
- Transfer medium / handoff channel:
- Checksum / integrity evidence:
- Offline dependency bundle status:
- Ingress verification / import step:
- Rollback package / recovery bundle:
- Manual custody / operator handoff:

| Layer classification agreement | yes / no | owner | pending | notes |
| Optional profile evidence approval | yes / no | owner | pending | notes |
`;

const PROFILE_FIXTURES = {
  "AUTHORITATIVE_SOURCE_WAVE_LEDGER.md": `# Authoritative Source Wave Ledger

## Approval Rule
- One authoritative source change that affects more than one open packet must be tracked as a shared-source wave.

## 4. Impacted Packet Set
| Packet path | Prior source snapshot | Required action | Rebaseline status | Notes |
|---|---|---|---|---|
| reference/packets/PKT-01_ACTIVE_PACKET.md | 2026-04-23-v1 | adjust | pending | example row |

## 8. Packet Citation Rule
- Impacted packets cite this ledger as Authoritative source wave ledger reference.
`,
  "PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md": `# Admin Grid Application Profile

## Approval Rule
- Active profile references:
- Primary admin entity / surface:
- Grid interaction model:
- Search / filter / sort / pagination behavior:
- Row action / bulk action rule:
- Edit / save pattern:
- Profile deviation / exception:

## 8. Required Packet Evidence
- Active profile references:
- Primary admin entity / surface:
- Grid interaction model:
- Search / filter / sort / pagination behavior:
- Row action / bulk action rule:
- Edit / save pattern:
- Profile deviation / exception:

## 10. Packet Citation Rule
- Active profile references:
`,
  "PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md": `# Authoritative Spreadsheet Source Profile

## Approval Rule
- Active profile references:
- Source spreadsheet artifact:
- Workbook / sheet / tab / range trace:
- Header / column mapping:
- Row key / record identity rule:
- Source snapshot / version:
- Transformation / normalization assumptions:
- Reconciliation / overwrite rule:
- Profile deviation / exception:

## 8. Required Packet Evidence
- Active profile references:
- Source spreadsheet artifact:
- Workbook / sheet / tab / range trace:
- Header / column mapping:
- Row key / record identity rule:
- Source snapshot / version:
- Transformation / normalization assumptions:
- Reconciliation / overwrite rule:
- Profile deviation / exception:

## 10. Packet Citation Rule
- Active profile references:
`,
  "PRF-03_AIRGAPPED_DELIVERY_PROFILE.md": `# Airgapped Delivery Profile

## Approval Rule
- Active profile references:
- Transfer package / bundle artifact:
- Transfer medium / handoff channel:
- Checksum / integrity evidence:
- Offline dependency bundle status:
- Ingress verification / import step:
- Rollback package / recovery bundle:
- Manual custody / operator handoff:
- Profile deviation / exception:

## 8. Required Packet Evidence
- Active profile references:
- Transfer package / bundle artifact:
- Transfer medium / handoff channel:
- Checksum / integrity evidence:
- Offline dependency bundle status:
- Ingress verification / import step:
- Rollback package / recovery bundle:
- Manual custody / operator handoff:
- Profile deviation / exception:

## 10. Packet Citation Rule
- Active profile references:
`
};

const DEFAULT_CONCRETE_TASK_PACKET = {
  header: {
    "Ready For Code": "approve",
    "User-facing impact": "high",
    "Layer classification": "project packet",
    "Active profile dependencies": "PRF-01 + PRF-02",
    "Profile evidence status": "approved",
    "UX archetype status": "approved",
    "UX deviation status": "none",
    "Environment topology status": "approved",
    "Domain foundation status": "approved",
    "Authoritative source intake status": "approved",
    "Shared-source wave status": "not-needed",
    "Packet exit gate status": "approved",
    "Improvement promotion status": "none",
    "Existing system dependency": "confirmed",
    "New authoritative source impact": "analyzed",
    "Risk if started now": "low"
  },
  fields: {
    "Layer classification": "project packet",
    "Required reading before code": "requirements, architecture, implementation plan, active packet",
    "Active profile references":
      "reference/profiles/PRF-01_ADMIN_GRID_APPLICATION_PROFILE.md, reference/profiles/PRF-02_AUTHORITATIVE_SPREADSHEET_SOURCE_PROFILE.md",
    "Profile composition rationale": "The work item combines admin-grid workflow and authoritative spreadsheet ingestion.",
    "Active profile dependencies": "PRF-01 + PRF-02",
    "Profile-specific evidence status": "approved",
    "Primary admin entity / surface": "budget line item grid",
    "Grid interaction model": "dense grid with inline detail drawer",
    "Search / filter / sort / pagination behavior": "server-backed search, filter, sort, and pagination",
    "Row action / bulk action rule": "row review and bulk approve are both available",
    "Edit / save / confirm / audit pattern": "explicit save with audit trail confirmation",
    "Source spreadsheet artifact": "reference/artifacts/source.xlsx",
    "Workbook / sheet / tab / range trace": "WorkbookA / Sheet1 / TabA / A1:H40",
    "Header / column mapping": "source columns mapped to packet fields",
    "Row key / record identity rule": "row id uses workbook primary key",
    "Source snapshot / version": "2026-04-23-v1",
    "Transformation / normalization assumptions": "trim whitespace and normalize dates",
    "Reconciliation / overwrite rule": "source workbook wins after operator review",
    "Profile deviation / exception": "none",
    "UX archetype reference": "reference/artifacts/PRODUCT_UX_ARCHETYPE.md",
    "Selected UX archetype": "admin-operations-surface",
    "Archetype deviation / approval": "none",
    "Environment topology reference": "reference/artifacts/DEPLOYMENT_PLAN.md",
    "Source environment": "local workstation",
    "Target environment": "staging",
    "Execution target": "staging application host",
    "Transfer boundary": "internal handoff",
    "Rollback boundary": "restore previous packet bundle",
    "Domain foundation reference": "reference/artifacts/DOMAIN_CONTEXT.md",
    "Schema impact classification": "additive",
    "Authoritative source refs": "reference/artifacts/source.xlsx",
    "Authoritative source intake reference": "reference/artifacts/AUTHORITATIVE_SOURCE_INTAKE.md",
    "Impacted packet set scope": "single-packet",
    "Authoritative source wave ledger reference": "none",
    "Source wave packet disposition": "none",
    "Authoritative source disposition": "implemented",
    "Existing plan conflict": "none",
    "Current implementation impact": "aligned after packet sync",
    "Existing schema source artifact": "reference/artifacts/schema.sql",
    "Table / column naming compatibility": "aligned with the existing program",
    "Data operation / ownership compatibility": "existing ownership model preserved",
    "Migration / rollback / cutover compatibility": "compatible with current rollback plan",
    "Packet exit quality gate reference": "reference/artifacts/PACKET_EXIT_QUALITY_GATE.md",
    "Exit recommendation": "approve",
    "Source parity result": "aligned",
    "Validation / security / cleanup evidence": "validator clean and docs updated"
  }
};

export function seedProfileAwareValidatorFixtures(repoRoot) {
  fs.mkdirSync(path.join(repoRoot, "reference", "packets"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "profiles"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "reference", "artifacts"), { recursive: true });

  fs.writeFileSync(
    path.join(repoRoot, "reference", "packets", "PKT-01_WORK_ITEM_PACKET_TEMPLATE.md"),
    PACKET_TEMPLATE_FIXTURE,
    "utf8"
  );

  fs.writeFileSync(
    path.join(repoRoot, "reference", "artifacts", "AUTHORITATIVE_SOURCE_WAVE_LEDGER.md"),
    PROFILE_FIXTURES["AUTHORITATIVE_SOURCE_WAVE_LEDGER.md"],
    "utf8"
  );

  for (const [fileName, content] of Object.entries(PROFILE_FIXTURES)) {
    if (fileName === "AUTHORITATIVE_SOURCE_WAVE_LEDGER.md") {
      continue;
    }
    fs.writeFileSync(path.join(repoRoot, "reference", "profiles", fileName), content, "utf8");
  }
}

export function writeConcreteTaskPacketFixture(
  repoRoot,
  { fileName = "PKT-01_ACTIVE_PACKET.md", header = {}, fields = {} } = {}
) {
  const resolvedHeader = { ...DEFAULT_CONCRETE_TASK_PACKET.header, ...header };
  const resolvedFields = { ...DEFAULT_CONCRETE_TASK_PACKET.fields, ...fields };
  const packetPath = path.join(repoRoot, "reference", "packets", fileName);

  fs.writeFileSync(packetPath, buildConcreteTaskPacketFixture(resolvedHeader, resolvedFields), "utf8");
  return `reference/packets/${fileName}`;
}

function buildConcreteTaskPacketFixture(header, fields) {
  const activeProfileDependencies =
    header["Active profile dependencies"] ?? header["Active profile dependency"] ?? "none";
  const activeProfileReferences =
    fields["Active profile references"] ?? fields["Active profile reference"] ?? "none";

  return `# Concrete Task Packet

## Quick Decision Header
| Item | Proposed | Why | Status |
|---|---|---|---|
| Ready For Code | ${header["Ready For Code"]} | concrete packet validation | approved |
| User-facing impact | ${header["User-facing impact"]} | packet affects user-facing flow | approved |
| Layer classification | ${header["Layer classification"]} | packet boundary is explicit | approved |
| Active profile dependencies | ${activeProfileDependencies} | packet depends on reusable optional profiles | approved |
| Profile evidence status | ${header["Profile evidence status"]} | profile evidence state | approved |
| UX archetype status | ${header["UX archetype status"]} | UX contract state | approved |
| UX deviation status | ${header["UX deviation status"]} | deviation state | approved |
| Environment topology status | ${header["Environment topology status"]} | topology contract state | approved |
| Domain foundation status | ${header["Domain foundation status"]} | data-impact contract state | approved |
| Authoritative source intake status | ${header["Authoritative source intake status"]} | source-intake state | approved |
| Shared-source wave status | ${header["Shared-source wave status"]} | source-wave rebaseline state | approved |
| Packet exit gate status | ${header["Packet exit gate status"]} | closeout readiness | approved |
| Improvement promotion status | ${header["Improvement promotion status"]} | improvement state | approved |
| Existing system dependency | ${header["Existing system dependency"]} | integration dependency | approved |
| New authoritative source impact | ${header["New authoritative source impact"]} | source impact state | approved |
| Risk if started now | ${header["Risk if started now"]} | remaining ambiguity | approved |

## 8. UI/UX Detailed Design
- Active profile references: ${activeProfileReferences}
- Profile composition rationale: ${fields["Profile composition rationale"]}
- Profile-specific evidence status: ${fields["Profile-specific evidence status"]}
- Primary admin entity / surface: ${fields["Primary admin entity / surface"]}
- Grid interaction model: ${fields["Grid interaction model"]}
- Search / filter / sort / pagination behavior: ${fields["Search / filter / sort / pagination behavior"]}
- Row action / bulk action rule: ${fields["Row action / bulk action rule"]}
- Edit / save / confirm / audit pattern: ${fields["Edit / save / confirm / audit pattern"]}
- Source spreadsheet artifact: ${fields["Source spreadsheet artifact"]}
- Workbook / sheet / tab / range trace: ${fields["Workbook / sheet / tab / range trace"]}
- Header / column mapping: ${fields["Header / column mapping"]}
- Row key / record identity rule: ${fields["Row key / record identity rule"]}
- Source snapshot / version: ${fields["Source snapshot / version"]}
- Transformation / normalization assumptions: ${fields["Transformation / normalization assumptions"]}
- Reconciliation / overwrite rule: ${fields["Reconciliation / overwrite rule"]}
- Profile deviation / exception: ${fields["Profile deviation / exception"]}
- UX archetype reference: ${fields["UX archetype reference"]}
- Selected UX archetype: ${fields["Selected UX archetype"]}
- Archetype deviation / approval: ${fields["Archetype deviation / approval"]}

## 9. Data / Source Impact
- Layer classification: ${fields["Layer classification"]}
- Required reading before code: ${fields["Required reading before code"]}
- Active profile dependencies: ${fields["Active profile dependencies"]}
- Environment topology reference: ${fields["Environment topology reference"]}
- Source environment: ${fields["Source environment"]}
- Target environment: ${fields["Target environment"]}
- Execution target: ${fields["Execution target"]}
- Transfer boundary: ${fields["Transfer boundary"]}
- Rollback boundary: ${fields["Rollback boundary"]}
- Domain foundation reference: ${fields["Domain foundation reference"]}
- Schema impact classification: ${fields["Schema impact classification"]}
- Authoritative source refs: ${fields["Authoritative source refs"]}
- Authoritative source intake reference: ${fields["Authoritative source intake reference"]}
- Impacted packet set scope: ${fields["Impacted packet set scope"]}
- Authoritative source wave ledger reference: ${fields["Authoritative source wave ledger reference"]}
- Source wave packet disposition: ${fields["Source wave packet disposition"]}
- Authoritative source disposition: ${fields["Authoritative source disposition"]}
- Existing plan conflict: ${fields["Existing plan conflict"]}
- Current implementation impact: ${fields["Current implementation impact"]}
- Existing schema source artifact: ${fields["Existing schema source artifact"]}
- Table / column naming compatibility: ${fields["Table / column naming compatibility"]}
- Data operation / ownership compatibility: ${fields["Data operation / ownership compatibility"]}
- Migration / rollback / cutover compatibility: ${fields["Migration / rollback / cutover compatibility"]}

## 15. Packet Exit Quality Gate
- Packet exit quality gate reference: ${fields["Packet exit quality gate reference"]}
- Exit recommendation: ${fields["Exit recommendation"]}
- Source parity result: ${fields["Source parity result"]}
- Validation / security / cleanup evidence: ${fields["Validation / security / cleanup evidence"]}
`;
}
