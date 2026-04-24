import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const SCHEMA_VERSION = 1;
export const CORE_TABLES = [
  "artifact_index",
  "decision_registry",
  "gate_risk_registry",
  "generation_state",
  "handoff_log",
  "release_state",
  "work_item_registry"
];
export const DEFAULT_DB_PATH = ".harness/operating_state.sqlite";
export const GENERATED_DOCS = ["CURRENT_STATE.md", "TASK_LIST.md"];

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS release_state (
  release_id TEXT PRIMARY KEY,
  current_stage TEXT NOT NULL,
  release_gate_state TEXT NOT NULL,
  current_focus TEXT NOT NULL,
  release_goal TEXT NOT NULL,
  source_ref TEXT,
  updated_by TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS work_item_registry (
  work_item_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  next_action TEXT,
  source_ref TEXT,
  domain_hint TEXT,
  risk_hint TEXT,
  owner TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS decision_registry (
  decision_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  decision_needed INTEGER NOT NULL CHECK (decision_needed IN (0, 1)),
  impact_summary TEXT NOT NULL,
  no_response_behavior TEXT,
  due_at TEXT,
  source_ref TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS gate_risk_registry (
  risk_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  unblock_condition TEXT,
  next_escalation TEXT,
  source_ref TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS handoff_log (
  handoff_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  handoff_summary TEXT NOT NULL,
  from_role TEXT,
  to_role TEXT,
  source_ref TEXT,
  supersedes_handoff_id TEXT REFERENCES handoff_log(handoff_id),
  payload_json TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS artifact_index (
  artifact_id TEXT PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  source_ref TEXT,
  render_hash TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS generation_state (
  projection_name TEXT PRIMARY KEY,
  checksum TEXT NOT NULL,
  generated_at TEXT NOT NULL,
  source_revision TEXT,
  freshness_state TEXT NOT NULL DEFAULT 'fresh',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  version INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_work_item_status
  ON work_item_registry(status);

CREATE INDEX IF NOT EXISTS idx_decision_status
  ON decision_registry(status, decision_needed);

CREATE INDEX IF NOT EXISTS idx_gate_risk_status
  ON gate_risk_registry(status, severity);

CREATE INDEX IF NOT EXISTS idx_handoff_created_at
  ON handoff_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_artifact_category
  ON artifact_index(category);
`;

export class OptimisticConcurrencyError extends Error {
  constructor(message) {
    super(message);
    this.name = "OptimisticConcurrencyError";
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export function createOperatingStateStore(options = {}) {
  return new OperatingStateStore(options);
}

export class OperatingStateStore {
  constructor({ dbPath = DEFAULT_DB_PATH, now = defaultNow } = {}) {
    this.now = now;
    this.dbPath = resolveDbPath(dbPath);

    if (this.dbPath !== ":memory:") {
      fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    }

    this.db = new DatabaseSync(this.dbPath);
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec(SCHEMA_SQL);
    this.db.exec(`PRAGMA user_version = ${SCHEMA_VERSION};`);
  }

  close() {
    this.db.close();
  }

  getSchemaVersion() {
    return this.db.prepare("PRAGMA user_version;").get().user_version;
  }

  listCoreTables() {
    const rows = this.db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      )
      .all();
    return rows.map((row) => row.name);
  }

  getReleaseState(releaseId = "current") {
    const row = this.db
      .prepare("SELECT * FROM release_state WHERE release_id = ?")
      .get(releaseId);
    return row ? mapReleaseStateRow(row) : null;
  }

  getWorkItem(workItemId) {
    const row = this.db
      .prepare("SELECT * FROM work_item_registry WHERE work_item_id = ?")
      .get(workItemId);
    return row ? mapWorkItemRow(row) : null;
  }

  listWorkItems() {
    return this.db
      .prepare("SELECT * FROM work_item_registry ORDER BY updated_at DESC, work_item_id ASC")
      .all()
      .map(mapWorkItemRow);
  }

  getDecision(decisionId) {
    const row = this.db
      .prepare("SELECT * FROM decision_registry WHERE decision_id = ?")
      .get(decisionId);
    return row ? mapDecisionRow(row) : null;
  }

  listDecisions({ status, decisionNeeded } = {}) {
    const clauses = [];
    const params = [];

    if (status) {
      clauses.push("status = ?");
      params.push(status);
    }

    if (decisionNeeded != null) {
      clauses.push("decision_needed = ?");
      params.push(decisionNeeded ? 1 : 0);
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    return this.db
      .prepare(
        `SELECT * FROM decision_registry ${where} ORDER BY due_at IS NULL, due_at ASC, decision_id ASC`
      )
      .all(...params)
      .map(mapDecisionRow);
  }

  getGateRisk(riskId) {
    const row = this.db
      .prepare("SELECT * FROM gate_risk_registry WHERE risk_id = ?")
      .get(riskId);
    return row ? mapGateRiskRow(row) : null;
  }

  listGateRisks({ status } = {}) {
    const clauses = [];
    const params = [];

    if (status) {
      clauses.push("status = ?");
      params.push(status);
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    return this.db
      .prepare(
        `SELECT * FROM gate_risk_registry ${where} ORDER BY severity DESC, updated_at DESC, risk_id ASC`
      )
      .all(...params)
      .map(mapGateRiskRow);
  }

  getArtifactByPath(artifactPath) {
    const normalizedPath = normalizeRelativePath(artifactPath, "artifactPath");
    const row = this.db
      .prepare("SELECT * FROM artifact_index WHERE path = ?")
      .get(normalizedPath);
    return row ? mapArtifactRow(row) : null;
  }

  listArtifacts({ category } = {}) {
    const clauses = [];
    const params = [];

    if (category) {
      clauses.push("category = ?");
      params.push(category);
    }

    const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    return this.db
      .prepare(`SELECT * FROM artifact_index ${where} ORDER BY category ASC, path ASC`)
      .all(...params)
      .map(mapArtifactRow);
  }

  getGenerationState(projectionName) {
    const row = this.db
      .prepare("SELECT * FROM generation_state WHERE projection_name = ?")
      .get(projectionName);
    return row ? mapGenerationRow(row) : null;
  }

  listGenerationStates() {
    return this.db
      .prepare("SELECT * FROM generation_state ORDER BY projection_name ASC")
      .all()
      .map(mapGenerationRow);
  }

  listRecentHandoffs(limit = 10) {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    return this.db
      .prepare("SELECT * FROM handoff_log ORDER BY created_at DESC LIMIT ?")
      .all(safeLimit)
      .map(mapHandoffRow);
  }

  getLatestMutationTimestamp() {
    const timestamps = [];
    const tables = [
      ["release_state", "updated_at"],
      ["work_item_registry", "updated_at"],
      ["decision_registry", "updated_at"],
      ["gate_risk_registry", "updated_at"],
      ["handoff_log", "created_at"],
      ["artifact_index", "updated_at"],
      ["generation_state", "updated_at"]
    ];

    for (const [tableName, columnName] of tables) {
      const row = this.db
        .prepare(`SELECT MAX(${columnName}) AS ts FROM ${tableName}`)
        .get();
      if (row?.ts) {
        timestamps.push(row.ts);
      }
    }

    return timestamps.sort().at(-1) ?? null;
  }

  getLatestOperationalTimestamp() {
    const timestamps = [];
    const tables = [
      ["release_state", "updated_at"],
      ["work_item_registry", "updated_at"],
      ["decision_registry", "updated_at"],
      ["gate_risk_registry", "updated_at"],
      ["handoff_log", "created_at"],
      ["artifact_index", "updated_at"]
    ];

    for (const [tableName, columnName] of tables) {
      const row = this.db
        .prepare(`SELECT MAX(${columnName}) AS ts FROM ${tableName}`)
        .get();
      if (row?.ts) {
        timestamps.push(row.ts);
      }
    }

    return timestamps.sort().at(-1) ?? null;
  }

  setReleaseState(payload, { expectedVersion } = {}) {
    const releaseId = requiredText(payload.releaseId ?? "current", "releaseId");
    const currentStage = requiredText(payload.currentStage, "currentStage");
    const releaseGateState = requiredText(payload.releaseGateState, "releaseGateState");
    const currentFocus = requiredText(payload.currentFocus, "currentFocus");
    const releaseGoal = requiredText(payload.releaseGoal, "releaseGoal");
    const sourceRef = optionalRelativePath(payload.sourceRef, "sourceRef");
    const updatedBy = optionalText(payload.updatedBy);
    const metadataJson = toJson(payload.metadata);
    const existing = this.getReleaseState(releaseId);
    const timestamp = this.now();

    assertExpectedVersion(existing, expectedVersion, `release_state:${releaseId}`);

    if (existing) {
      this.db
        .prepare(
          `UPDATE release_state
             SET current_stage = ?, release_gate_state = ?, current_focus = ?, release_goal = ?,
                 source_ref = ?, updated_by = ?, metadata_json = ?, version = ?, updated_at = ?
           WHERE release_id = ?`
        )
        .run(
          currentStage,
          releaseGateState,
          currentFocus,
          releaseGoal,
          sourceRef,
          updatedBy,
          metadataJson,
          existing.version + 1,
          timestamp,
          releaseId
        );
    } else {
      this.db
        .prepare(
          `INSERT INTO release_state (
             release_id, current_stage, release_gate_state, current_focus, release_goal,
             source_ref, updated_by, metadata_json, version, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          releaseId,
          currentStage,
          releaseGateState,
          currentFocus,
          releaseGoal,
          sourceRef,
          updatedBy,
          metadataJson,
          1,
          timestamp,
          timestamp
        );
    }

    return this.getReleaseState(releaseId);
  }

  upsertWorkItem(payload, { expectedVersion } = {}) {
    const workItemId = requiredText(payload.workItemId, "workItemId");
    const title = requiredText(payload.title, "title");
    const status = requiredText(payload.status, "status");
    const nextAction = optionalText(payload.nextAction);
    const sourceRef = optionalRelativePath(payload.sourceRef, "sourceRef");
    const domainHint = optionalText(payload.domainHint);
    const riskHint = optionalText(payload.riskHint);
    const owner = optionalText(payload.owner);
    const metadataJson = toJson(payload.metadata);
    const existing = this.getWorkItem(workItemId);
    const timestamp = this.now();

    assertExpectedVersion(existing, expectedVersion, `work_item_registry:${workItemId}`);

    if (existing) {
      this.db
        .prepare(
          `UPDATE work_item_registry
             SET title = ?, status = ?, next_action = ?, source_ref = ?, domain_hint = ?,
                 risk_hint = ?, owner = ?, metadata_json = ?, version = ?, updated_at = ?
           WHERE work_item_id = ?`
        )
        .run(
          title,
          status,
          nextAction,
          sourceRef,
          domainHint,
          riskHint,
          owner,
          metadataJson,
          existing.version + 1,
          timestamp,
          workItemId
        );
    } else {
      this.db
        .prepare(
          `INSERT INTO work_item_registry (
             work_item_id, title, status, next_action, source_ref, domain_hint, risk_hint,
             owner, metadata_json, version, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          workItemId,
          title,
          status,
          nextAction,
          sourceRef,
          domainHint,
          riskHint,
          owner,
          metadataJson,
          1,
          timestamp,
          timestamp
        );
    }

    return this.getWorkItem(workItemId);
  }

  transitionWorkItem({ workItemId, ...updates }, { expectedVersion } = {}) {
    const existing = this.getWorkItem(workItemId);
    if (!existing) {
      throw new ValidationError(`Cannot transition missing work item: ${workItemId}`);
    }

    return this.upsertWorkItem(
      {
        ...existing,
        ...updates,
        workItemId
      },
      { expectedVersion: expectedVersion ?? existing.version }
    );
  }

  recordDecision(payload, { expectedVersion } = {}) {
    const decisionId = requiredText(payload.decisionId, "decisionId");
    const title = requiredText(payload.title, "title");
    const decisionNeeded = typeof payload.decisionNeeded === "boolean" ? payload.decisionNeeded : true;
    const impactSummary = requiredText(payload.impactSummary, "impactSummary");
    const noResponseBehavior = optionalText(payload.noResponseBehavior);
    const dueAt = optionalText(payload.dueAt);
    const sourceRef = optionalRelativePath(payload.sourceRef, "sourceRef");
    const status = requiredText(payload.status ?? "open", "status");
    const metadataJson = toJson(payload.metadata);
    const existing = this.getDecision(decisionId);
    const timestamp = this.now();

    assertExpectedVersion(existing, expectedVersion, `decision_registry:${decisionId}`);

    if (existing) {
      this.db
        .prepare(
          `UPDATE decision_registry
             SET title = ?, decision_needed = ?, impact_summary = ?, no_response_behavior = ?,
                 due_at = ?, source_ref = ?, status = ?, metadata_json = ?, version = ?, updated_at = ?
           WHERE decision_id = ?`
        )
        .run(
          title,
          decisionNeeded ? 1 : 0,
          impactSummary,
          noResponseBehavior,
          dueAt,
          sourceRef,
          status,
          metadataJson,
          existing.version + 1,
          timestamp,
          decisionId
        );
    } else {
      this.db
        .prepare(
          `INSERT INTO decision_registry (
             decision_id, title, decision_needed, impact_summary, no_response_behavior, due_at,
             source_ref, status, metadata_json, version, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          decisionId,
          title,
          decisionNeeded ? 1 : 0,
          impactSummary,
          noResponseBehavior,
          dueAt,
          sourceRef,
          status,
          metadataJson,
          1,
          timestamp,
          timestamp
        );
    }

    return this.getDecision(decisionId);
  }

  recordGateRisk(payload, { expectedVersion } = {}) {
    const riskId = requiredText(payload.riskId, "riskId");
    const title = requiredText(payload.title, "title");
    const severity = requiredText(payload.severity, "severity");
    const status = requiredText(payload.status ?? "open", "status");
    const unblockCondition = optionalText(payload.unblockCondition);
    const nextEscalation = optionalText(payload.nextEscalation);
    const sourceRef = optionalRelativePath(payload.sourceRef, "sourceRef");
    const metadataJson = toJson(payload.metadata);
    const existing = this.getGateRisk(riskId);
    const timestamp = this.now();

    assertExpectedVersion(existing, expectedVersion, `gate_risk_registry:${riskId}`);

    if (existing) {
      this.db
        .prepare(
          `UPDATE gate_risk_registry
             SET title = ?, severity = ?, status = ?, unblock_condition = ?, next_escalation = ?,
                 source_ref = ?, metadata_json = ?, version = ?, updated_at = ?
           WHERE risk_id = ?`
        )
        .run(
          title,
          severity,
          status,
          unblockCondition,
          nextEscalation,
          sourceRef,
          metadataJson,
          existing.version + 1,
          timestamp,
          riskId
        );
    } else {
      this.db
        .prepare(
          `INSERT INTO gate_risk_registry (
             risk_id, title, severity, status, unblock_condition, next_escalation,
             source_ref, metadata_json, version, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          riskId,
          title,
          severity,
          status,
          unblockCondition,
          nextEscalation,
          sourceRef,
          metadataJson,
          1,
          timestamp,
          timestamp
        );
    }

    return this.getGateRisk(riskId);
  }

  appendHandoff(payload) {
    const handoffId = requiredText(payload.handoffId, "handoffId");
    const handoffSummary = requiredText(payload.handoffSummary, "handoffSummary");
    const fromRole = optionalText(payload.fromRole);
    const toRole = optionalText(payload.toRole);
    const sourceRef = optionalRelativePath(payload.sourceRef, "sourceRef");
    const supersedesHandoffId = optionalText(payload.supersedesHandoffId);
    const createdAt = payload.createdAt ? requiredText(payload.createdAt, "createdAt") : this.now();
    const payloadJson = toJson(payload.payload);

    if (supersedesHandoffId) {
      const parent = this.db
        .prepare("SELECT handoff_id FROM handoff_log WHERE handoff_id = ?")
        .get(supersedesHandoffId);
      if (!parent) {
        throw new ValidationError(
          `Cannot append handoff ${handoffId}: supersedes_handoff_id ${supersedesHandoffId} does not exist`
        );
      }
    }

    this.db
      .prepare(
        `INSERT INTO handoff_log (
           handoff_id, created_at, handoff_summary, from_role, to_role,
           source_ref, supersedes_handoff_id, payload_json
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        handoffId,
        createdAt,
        handoffSummary,
        fromRole,
        toRole,
        sourceRef,
        supersedesHandoffId,
        payloadJson
      );

    const row = this.db
      .prepare("SELECT * FROM handoff_log WHERE handoff_id = ?")
      .get(handoffId);
    return mapHandoffRow(row);
  }

  upsertArtifact(payload, { expectedVersion } = {}) {
    const artifactId = requiredText(payload.artifactId, "artifactId");
    const artifactPath = normalizeRelativePath(payload.path, "path");
    const category = requiredText(payload.category, "category");
    const title = requiredText(payload.title, "title");
    const sourceRef = optionalRelativePath(payload.sourceRef, "sourceRef");
    const renderHash = optionalText(payload.renderHash);
    const metadataJson = toJson(payload.metadata);
    const existing = this.db
      .prepare("SELECT * FROM artifact_index WHERE artifact_id = ?")
      .get(artifactId);
    const timestamp = this.now();

    assertExpectedVersion(existing ? mapArtifactRow(existing) : null, expectedVersion, `artifact_index:${artifactId}`);

    if (existing) {
      this.db
        .prepare(
          `UPDATE artifact_index
             SET path = ?, category = ?, title = ?, source_ref = ?, render_hash = ?,
                 metadata_json = ?, version = ?, updated_at = ?
           WHERE artifact_id = ?`
        )
        .run(
          artifactPath,
          category,
          title,
          sourceRef,
          renderHash,
          metadataJson,
          existing.version + 1,
          timestamp,
          artifactId
        );
    } else {
      this.db
        .prepare(
          `INSERT INTO artifact_index (
             artifact_id, path, category, title, source_ref, render_hash,
             metadata_json, version, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          artifactId,
          artifactPath,
          category,
          title,
          sourceRef,
          renderHash,
          metadataJson,
          1,
          timestamp,
          timestamp
        );
    }

    return this.getArtifactByPath(artifactPath);
  }

  refreshProjection(payload, { expectedVersion } = {}) {
    const projectionName = requiredText(payload.projectionName, "projectionName");
    const checksum = requiredText(payload.checksum, "checksum");
    const generatedAt = payload.generatedAt ? requiredText(payload.generatedAt, "generatedAt") : this.now();
    const sourceRevision = optionalText(payload.sourceRevision);
    const freshnessState = requiredText(payload.freshnessState ?? "fresh", "freshnessState");
    const metadataJson = toJson(payload.metadata);
    const existing = this.getGenerationState(projectionName);
    const timestamp = this.now();

    assertExpectedVersion(existing, expectedVersion, `generation_state:${projectionName}`);

    if (existing) {
      this.db
        .prepare(
          `UPDATE generation_state
             SET checksum = ?, generated_at = ?, source_revision = ?, freshness_state = ?,
                 metadata_json = ?, version = ?, updated_at = ?
           WHERE projection_name = ?`
        )
        .run(
          checksum,
          generatedAt,
          sourceRevision,
          freshnessState,
          metadataJson,
          existing.version + 1,
          timestamp,
          projectionName
        );
    } else {
      this.db
        .prepare(
          `INSERT INTO generation_state (
             projection_name, checksum, generated_at, source_revision, freshness_state,
             metadata_json, version, created_at, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          projectionName,
          checksum,
          generatedAt,
          sourceRevision,
          freshnessState,
          metadataJson,
          1,
          timestamp,
          timestamp
        );
    }

    return this.getGenerationState(projectionName);
  }
}

function resolveDbPath(dbPath) {
  if (dbPath === ":memory:") {
    return dbPath;
  }
  return path.resolve(dbPath);
}

function defaultNow() {
  return new Date().toISOString();
}

function requiredText(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`${fieldName} must be a non-empty string`);
  }
  return value.trim();
}

function optionalText(value) {
  if (value == null) {
    return null;
  }
  return requiredText(value, "optionalText");
}

function optionalRelativePath(value, fieldName) {
  if (value == null) {
    return null;
  }
  return normalizeRelativePath(value, fieldName);
}

function normalizeRelativePath(value, fieldName) {
  const raw = requiredText(value, fieldName).replaceAll("\\", "/");
  const normalized = path.posix.normalize(raw);
  if (path.isAbsolute(raw) || normalized === ".." || normalized.startsWith("../")) {
    throw new ValidationError(`${fieldName} must be a repo-relative path`);
  }
  return normalized.startsWith("./") ? normalized.slice(2) : normalized;
}

function toJson(value) {
  return JSON.stringify(value ?? {});
}

function fromJson(value) {
  return value ? JSON.parse(value) : {};
}

function assertExpectedVersion(existing, expectedVersion, rowLabel) {
  if (expectedVersion == null) {
    return;
  }

  if (!existing) {
    throw new OptimisticConcurrencyError(
      `Expected version ${expectedVersion} for ${rowLabel}, but no row exists`
    );
  }

  if (existing.version !== expectedVersion) {
    throw new OptimisticConcurrencyError(
      `Expected version ${expectedVersion} for ${rowLabel}, found ${existing.version}`
    );
  }
}

function mapReleaseStateRow(row) {
  return {
    releaseId: row.release_id,
    currentStage: row.current_stage,
    releaseGateState: row.release_gate_state,
    currentFocus: row.current_focus,
    releaseGoal: row.release_goal,
    sourceRef: row.source_ref,
    updatedBy: row.updated_by,
    metadata: fromJson(row.metadata_json),
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapWorkItemRow(row) {
  return {
    workItemId: row.work_item_id,
    title: row.title,
    status: row.status,
    nextAction: row.next_action,
    sourceRef: row.source_ref,
    domainHint: row.domain_hint,
    riskHint: row.risk_hint,
    owner: row.owner,
    metadata: fromJson(row.metadata_json),
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapDecisionRow(row) {
  return {
    decisionId: row.decision_id,
    title: row.title,
    decisionNeeded: Boolean(row.decision_needed),
    impactSummary: row.impact_summary,
    noResponseBehavior: row.no_response_behavior,
    dueAt: row.due_at,
    sourceRef: row.source_ref,
    status: row.status,
    metadata: fromJson(row.metadata_json),
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapGateRiskRow(row) {
  return {
    riskId: row.risk_id,
    title: row.title,
    severity: row.severity,
    status: row.status,
    unblockCondition: row.unblock_condition,
    nextEscalation: row.next_escalation,
    sourceRef: row.source_ref,
    metadata: fromJson(row.metadata_json),
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapHandoffRow(row) {
  return {
    handoffId: row.handoff_id,
    createdAt: row.created_at,
    handoffSummary: row.handoff_summary,
    fromRole: row.from_role,
    toRole: row.to_role,
    sourceRef: row.source_ref,
    supersedesHandoffId: row.supersedes_handoff_id,
    payload: fromJson(row.payload_json)
  };
}

function mapArtifactRow(row) {
  return {
    artifactId: row.artifact_id,
    path: row.path,
    category: row.category,
    title: row.title,
    sourceRef: row.source_ref,
    renderHash: row.render_hash,
    metadata: fromJson(row.metadata_json),
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapGenerationRow(row) {
  return {
    projectionName: row.projection_name,
    checksum: row.checksum,
    generatedAt: row.generated_at,
    sourceRevision: row.source_revision,
    freshnessState: row.freshness_state,
    metadata: fromJson(row.metadata_json),
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
