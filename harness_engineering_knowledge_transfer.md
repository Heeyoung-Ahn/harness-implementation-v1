# 하네스 엔지니어링 지식 이전 패키지 (Full Edition)

> **검토 범위**: `repo_harness_template` 전체  
> 아티팩트 14종 + 구현 코드(PMW, DB layer, scripts) + 워크플로우 8종 + 스킬 18종  
> 근거 문서: `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`, `WALKTHROUGH.md`, `PROJECT_HISTORY.md`, `DECISION_LOG.md`, `PREVENTIVE_MEMORY.md`, `PROTOTYPE_CLOSEOUT.md`, `GREENFIELD_CHARTER.md`, `REVIEW_REPORT.md`, `DEPLOYMENT_PLAN.md`, `TASK_LIST.md`, `CURRENT_STATE.md`, `HANDOFF_ARCHIVE.md` + 구현 소스

---

## Part 1. 하네스 엔지니어링의 핵심 가치와 구현 방향

### 1-1. 출발점: 어떤 문제를 풀려고 했는가

이 프로젝트가 해결하려 한 문제는 세 가지였다 (`REQUIREMENTS.md > Product Goal`에서 승인됨).

1. **상태 분산 문제**: 진행 상태와 맥락 정보가 여러 Markdown 파일에 흩어져 있어, 한 번의 상태 변경에 여러 파일을 중복 수정해야 했다.
2. **가시성 부족 문제**: 사람과 AI 에이전트 모두 "지금 무엇을 결정해야 하는지"를 한눈에 볼 창구가 없었다. PMW(Project Monitor Web)가 단순 요약 대시보드 수준에 머물러 있어 실제 artifact는 파일 탐색으로 다시 찾아야 했다.
3. **정합도 관리 문제**: 운영 상태를 Markdown 문서로 직접 관리하다 보니 정합도 검증과 UI 소비 모델이 함께 비대해졌다.

**핵심 명제 — 한 번의 상태 변경은 하나의 truth surface만 수정하면 된다.**

---

### 1-2. 승인된 아키텍처: 이중 Truth 구조

`CR-11` (2026-04-12) + `CR-12` (2026-04-15)로 승인·검증된 구조.

#### Truth 소유권 분리

| Truth 종류 | 소유권 | 수정 주체 | 비고 |
|---|---|---|---|
| **Hot-state** (task 상태, lock, blocker, next action, stage) | repo-local embedded DB (SQLite) | 에이전트 / 스크립트 commit | 유일한 write surface |
| **맥락 문서** (요구사항, 아키텍처, 판단 근거, 리뷰, 타임라인 등) | Markdown 정본 (`.agents/artifacts/*.md`) | 에이전트 / 사람 | Git diff 가능, human review 가능 |
| **상태 요약** (`CURRENT_STATE.md`, `TASK_LIST.md`) | Generated docs | DB 기반 생성 스크립트 | 사람이 직접 편집하는 구조가 아님 |

#### 실제 구현된 DB 스키마 (`operating_state.schema.json`)

9개 테이블이 구현됐다.

| 테이블 | PMW Surface | 핵심 필드 설계 포인트 |
|---|---|---|
| `project_registry` | Settings | 프로젝트 등록·선택 |
| `role_registry` | (내부) | 에이전트 역할 continuity |
| `release_state` | Current Focus | `current_stage`, `release_gate_state`, `current_focus`, `release_goal` |
| `work_item_registry` | Next Action | `status`, `source_ref`, `next_action`, `domain_hint`, `risk_hint` |
| `decision_registry` | Decision Required | `decision_needed`, `impact_summary`, `no_response_behavior`, `due_at` |
| `gate_risk_registry` | Blocked / At Risk | `severity`, `unblock_condition`, `next_escalation` |
| `handoff_log` | (내부) | append-only, `supersedes_handoff_id`로 chain 관리 |
| `artifact_index` | Artifact Browser | `path`, `category`, `render_hash` |
| `generation_state` | (내부) | 생성 시각, checksum — drift 탐지 기반 |

> **모든 mutable row는 `version` 필드와 optimistic concurrency (`expected_version`)로 갱신**한다 — 이것이 split truth 방지의 핵심 구현 기둥이다.

#### Command Surface (store adapter interface)

```
set_release_state / upsert_work_item / transition_work_item
record_decision / record_gate_risk / append_handoff / refresh_projection
```

이 7개 command 표면이 실제로 구현됐다 (`operating-state-store.js`, 32KB). 명령 이외의 경로로 hot-state를 직접 수정하는 것은 금지된 구조다.

---

### 1-3. PMW 4-Surface 운영 모델

에이전트와 사람이 공유하는 운영 창구. **Read-only**가 기본값이다.

| PMW Surface | Canonical Source File | Designated Section | 역할 |
|---|---|---|---|
| Hero / Problem Statement | `REQUIREMENTS.md` | `## Product Goal` | 프로젝트 목적 서술 |
| Decision Required | `CURRENT_STATE.md` | `## Decision Required Summary` | 지금 결정해야 할 항목 |
| Blocked / At Risk | `TASK_LIST.md` | `## Blocked / At Risk Summary` | 진행을 막는 항목 |
| Current Focus | `CURRENT_STATE.md` | `## Current Focus Summary` | 현재 집중 중인 작업 |
| Next Action | `IMPLEMENTATION_PLAN.md` | `## Operator Next Action` | 다음에 할 일 |

> **이 5가지 source-to-surface 매핑이 `CR-12`로 승인된 중심 계약이다.**  
> 이 매핑 없이 PMW를 만들면 raw technical prose가 그대로 노출되는 문제가 반복된다 (실제로 TST-07, TST-08에서 확인됨).

---

### 1-4. Layered Document Model (CR-12 핵심 혁신)

같은 Markdown 파일 안에서 두 독자를 동시에 섬긴다.

```
[상단: Technical Facts]   ← AI 에이전트가 빠르게 맥락 복원에 사용
[하단: User-Facing Section] ← PMW가 strong surface에 소비
```

**왜 separate user-only 문서를 만들지 않는가?**
- 문서 수 증가 → maintenance cost 2배
- AI context budget 增가
- 두 문서 간 drift 발생 필연적

**구현 규칙:**
- source 없는 항목은 raw copy를 그대로 투영하지 않고 `needs source` fallback
- user-facing section이 없으면 PMW는 `unknown` 또는 empty-state로 처리
- AI 에이전트는 문서 앞단 technical facts만 읽어도 맥락 복원이 가능해야 함

---

### 1-5. 실제 구현된 소프트웨어 구조

```
tools/project-monitor-web/
├── server.js                          # Express API server (loopback-only)
├── src/
│   ├── application/                   # Use-case orchestration layer
│   │   ├── build-dashboard-snapshot.js   (33KB) ← PMW 데이터 조립 핵심
│   │   ├── parse-current-state.js        (3.5KB)
│   │   ├── parse-task-list.js            (4KB)
│   │   ├── parse-implementation-plan.js  (2.4KB)
│   │   ├── parse-requirements.js         (1.3KB)
│   │   ├── load-artifact-library.js      (4.7KB)
│   │   ├── load-project-registry.js      (7.2KB)
│   │   └── state/
│   │       ├── operating-state-store.js  (33KB) ← DB command surface
│   │       ├── bootstrap-operating-state.js
│   │       ├── generate-state-docs.js
│   │       └── state-doc-generation.js   (34KB) ← generated docs writer
│   └── presentation/
│       ├── app.js                      (32KB) ← PMW UI 전체
│       ├── workspace-model.js          (18KB) ← surface mapping logic
│       ├── markdown-view.js             (6.4KB)
│       └── styles.css                  (18KB)
├── test/
│   ├── operating-state.test.js         (8.3KB)
│   ├── dashboard-snapshot.test.js      (9.4KB)
│   ├── workspace-model.test.js         (9.1KB)
│   └── markdown-view.test.js           (1.2KB)
└── runtime/
    └── [tst07/tst08 screenshot evidence]

.agents/
├── runtime/
│   ├── operating_state.sqlite          (124KB) ← 실제 DB
│   ├── operating_state.schema.json     ← 스키마 계약
│   └── generated-state-docs/           ← shadow mode 출력
└── scripts/
    ├── check_harness_docs.ps1          (86KB) ← 종합 validator
    ├── bootstrap_operating_state.ps1
    ├── generate_state_docs.ps1
    └── sync_template_docs.ps1
```

**검증 결과 (`TST-06` pass):**
- `node --test` 14/14 → 19/19 pass
- shadow generated docs: deterministic rerun hash stable
- mojibake scan clean, `check_harness_docs.ps1` 0 error

**TST-08 결과 (prototype closeout 직전):**
- ✅ Pass: count/detail parity (`4 open` badge = `4 items`), diagnostics dock, artifacts drawer, settings drawer
- ❌ Fail: Hero 아래 release-goal line 노출, problem statement 폭 70% (전체 폭 아님)

---

### 1-6. 운영 프로세스 구조

#### 역할 분리 (8 Workflows)

| 역할 | 진입 | 핵심 산출물 |
|---|---|---|
| Planner | `/plan` | `REQUIREMENTS.md`, `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md` |
| Designer | `/design` | `UI_DESIGN.md`, mockup SVG |
| Developer | `/dev` | 코드, 스크립트, test |
| Tester | `/test` | `WALKTHROUGH.md`, browser evidence, screenshot |
| Reviewer | `/review` | `REVIEW_REPORT.md` |
| DevOps | `/deploy` | `DEPLOYMENT_PLAN.md` |
| Documenter | `/docu` | artifact sync, closeout package |
| Handoff | `/handoff` | `TASK_LIST.md > Handoff Log`, `CURRENT_STATE.md` |

#### 5-Gate Release Pipeline

```
Requirements Approved (REQUIREMENTS.md Status = Approved)
  → Design Approved (mockup + user confirmation)
    → Dev + Test Loop (implemented code + browser evidence)
      → Review Gate (REV-03)
        → Deployment Gate (REL-04)
          → Closeout / Greenfield Restart
```

> **각 gate는 이전 gate가 닫히지 않으면 열지 않는다.** 요구사항 미승인 상태에서 ARCHITECTURE_GUIDE.md를 새 기준선으로 선언하지 않는다. 이것은 Planner workflow에 하드코딩된 규칙이다.

#### Change Request 프로세스

```
CR-* ID 부여 → REQUIREMENTS.md 갱신 (FR-*, NFR-* 동시)
  → user 승인 → ARCHITECTURE_GUIDE.md + IMPLEMENTATION_PLAN.md + UI_DESIGN.md same-turn sync
    → downstream state docs sync (CURRENT_STATE.md, TASK_LIST.md)
```

이 프로젝트에서 실제로 진행된 CR: `CR-01`(프로파일) → `CR-02`(엔터프라이즈 팩) → `CR-03`~`CR-08`(하네스 강화) → `CR-11`(PMW 중심 재설계) → `CR-12`(사용자 facing 정보 계층)

---

### 1-7. Non-Negotiable Contracts (새 프로젝트에서도 반드시 유지)

| # | 계약 | 위반 시 결과 |
|---|---|---|
| 1 | Hot-state = DB single write truth | split truth, parity failure |
| 2 | Markdown = canonical context truth | DB로 장기 맥락 이전 시 diff 불가 |
| 3 | Generated docs determinism | Git churn, day-start 신뢰 저하 |
| 4 | PMW read-only boundary | 승인 없이 write enable 불가 |
| 5 | Designated summary consumption | raw prose leakage 반복 |
| 6 | Count/detail parity | badge 신뢰 붕괴 |
| 7 | Diagnostics secondary layer | warning이 first-view를 가림 |
| 8 | Cutover sequence fixed | `import→shadow→parity→freeze→flip→rollback` |
| 9 | Optimistic concurrency on mutable rows | race condition, 상태 오염 |
| 10 | source_ref resolve 필수 | 근거 없는 표면 claim |

---

## Part 2. 시행착오 전수

### 2-1. 기술 수준 실패 패턴 (구현 증거 포함)

#### ❌ 패턴 1: Raw Technical Prose Leakage

- **발생 증거**: `TST-07` fail — "현재 Focus", "Next Action" 카드에 raw file path, technical prose가 그대로 노출
- **근본 원인**: `build-dashboard-snapshot.js`가 `CURRENT_STATE.md`의 raw section을 direct projection. designated user-facing section 없이 fallback으로 tech prose를 그대로 올렸다.
- **`CR-12` 해결책**: `parse-current-state.js`에 `## Decision Required Summary`, `## Current Focus Summary` section parser 추가. section이 없으면 `needs source` fallback.
- **새 프로젝트 규칙**: **문서를 작성하는 시점부터** user-facing section을 먼저 준비한다. PMW 구현이 아니라 authoring 단계 규칙이다.

#### ❌ 패턴 2: Count/Detail Parity Drift

- **발생 증거**: `TST-07` / `TST-08` — `9 open`, `GateRisk 8` 같은 badge 숫자가 실제 visible list와 달랐다. 최종 `TST-08`에서는 badge `4 open` = detail `4 items`로 pass됐지만 이를 만들기 위해 `CR-12` baseline 재설계가 필요했다.
- **근본 원인**: Decision Required와 Blocked/At Risk가 같은 source section (`CURRENT_STATE.md > Open Decisions / Blockers`)에서 중복 파생됐다. badge 계산 로직과 visible item list 렌더링이 다른 경로를 탔다.
- **해결책**: source section 자체를 분리 (CURRENT_STATE.md → `Decision Required Summary`, TASK_LIST.md → `Blocked / At Risk Summary`). badge는 visible item count에서 직접 파생.
- **새 프로젝트 규칙**: badge와 detail list를 **처음부터** 같은 data source에서 렌더링하도록 설계한다. 나중에 맞추려 하면 baseline 재설계 비용이 든다.

#### ❌ 패턴 3: Diagnostics Priority Inversion

- **발생 증거**: `TST-07` fail — non-blocking parse warning 2건이 home first view 상단 banner에 노출. 사용자가 핵심 판단 정보보다 경고를 먼저 봐야 했다.
- **근본 원인**: `build-dashboard-snapshot.js`의 parse warning을 blocking issue와 같은 수준으로 surfaced.
- **해결책**: `DEV-14`에서 warning count = 0이면 top banner 미노출, diagnostics dock으로 격리. (`warningChildCount=0` TST-08에서 pass 확인)
- **새 프로젝트 규칙**: parse/validation warning은 **secondary layer 기본값**. `severity=blocking`일 때만 strong banner 허용.

#### ❌ 패턴 4: Hero Surface Noise (미완성으로 prototype closeout)

- **발생 증거**: `TST-08` fail — Hero 아래 `approved \`CR-12\` source contract → ...` release-goal line 노출. 사용자 피드백: "왜 있는지 모르겠어". Problem statement 폭도 hero 대비 70%.
- **근본 원인**: `state-doc-generation.js`의 hero section이 `release_goal` DB 필드를 그대로 subtittle로 렌더링. CSS의 problem statement container에 max-width 제약 잔존.
- **미해결 이유**: `DEV-15`에서 수정 예정이었으나 user가 prototype closeout + greenfield restart를 선택해 carry-forward scope가 됨.
- **새 프로젝트 규칙**: hero에 노출되는 내용을 명시적으로 설계 — "release goal은 hero에 노출하지 않는다"를 UI_DESIGN.md와 구현 스펙에 명시한다.

---

### 2-2. 아키텍처 수준 실패 패턴

#### ❌ 패턴 5: UI Fix Lane과 Cutover Lane의 결합

- **발생 경위**: `DEV-14`(hero readability) + `DEV-15`(hero cleanup) + `DEV-13`(validator/cutover tooling)이 같은 milestone에 묶였다. TST-08 fail → 두 레인 중 어느 것도 닫지 못하고 prototype closeout으로 전환.
- **결과**: 두 레인 모두 greenfield carry-forward scope가 됨. `PROTOTYPE_CLOSEOUT.md`에 명시됨.
- **새 프로젝트 규칙**: **처음부터 레인을 분리**. "UI read model lane", "validator/cutover lane", "starter/rollout lane"은 별도 milestone. 같은 iteration에 묶으면 하나가 막힐 때 전체가 멈춘다.

#### ❌ 패턴 6: Prototype Lane에서 반복 기준선 재설계

- **발생 경위**: `TST-07` fail → `CR-12` baseline 재설계 → `TST-08` fail. 같은 feature surface(PMW home)를 두 번 redesign.
- **수치**: 구현(`DEV-09`~`DEV-14`) + 설계(`DSG-09`~`DSG-12` 4라운드) + 기준 변경(`CR-11` + `CR-12`) 모두 같은 repo에서 처리하다 결국 greenfield restart.
- **진단** (`DEC-20260415-01`, `PC-002`): mockup + 구현 + browser evidence 뒤에도 source contract 자체를 재설계해야 했다. 즉 "무엇을 만들지"가 구현 중에 흔들렸다.
- **새 프로젝트 규칙**: 같은 surface에서 source contract reset이 2회 이상 필요하면 **prototype-to-greenfield split trigger**를 발동할지 평가한다. 이 trigger를 사전에 문서화해 두면 closeout 결정이 빠르다.

#### ❌ 패턴 7: Harness/Process Overhead Dominance

- **발생 증거** (`PC-001`): `TST-06` closeout에서 실제 검증보다 post-turn artifact sync/hygiene overhead가 더 큰 시간을 차지했다.
- **세부 원인**: cutover planning doc 갱신, parity check 재실행, handoff count 정리, `CURRENT_STATE.md` compact 작업이 acceptance-critical 검증과 같은 수준으로 묶였다.
- **새 프로젝트 규칙**: acceptance-critical sync와 non-blocking hygiene를 명시적으로 분리한다. `bootstrap → generate → verify` 의존 명령은 순차 실행으로 고정. hygiene는 promotion candidate로만 기록하고 task를 막지 않는다.

---

### 2-3. 프로세스 수준 실패 패턴 (`PREVENTIVE_MEMORY.md` rules)

#### ❌ 패턴 8: Shallow Interview 후 추정 요구사항 (PM-002)

- **발생 사건**: Planner가 deep interview 없이 추정으로 요구사항을 채우고, 미승인 기준선을 architecture/plan에 sync.
- **Promoted Rule**: `requirements_deep_interview` skill은 discovery-only turn과 승인 후 sync를 반드시 분리. 미승인이면 `Pending Requirement Approval` 상태 유지.
- **실제 구현**: `plan.md` workflow Step 2에 hard rule로 코딩됨. `REQUIREMENTS.md Status`가 `Approved`가 아니면 `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`를 새 기준선으로 sync하지 않는다.

#### ❌ 패턴 9: Starter/Reset Source 오염 (PM-001)

- **발생 사건**: live 운영 내용(실제 날짜, 승인 이력, handoff 원문)이 `templates_starter/` source에 섞였다.
- **Promoted Rule**: starter/reset artifact source는 clean scaffold만. concrete 운영 내용은 절대 포함하지 않는다.
- **실제 구현**: `template_repo.md` Section 4, `check_harness_docs.ps1` validator에서 오염 탐지.

---

### 2-4. 설계 결정의 분기점들 (DECISION_LOG 핵심)

#### 분기점 1: Prototype Closeout vs. 계속 진행 (DEC-20260415-01)

선택지가 3개였다:
1. 같은 repo에서 `DEV-15`, `DEV-13`, `REV-03`, `REL-04`까지 계속
2. 같은 repo에서 baseline만 다시 갈아엎고 새 milestone
3. 현재 repo를 prototype evidence bank로 closeout하고 sibling repo에서 greenfield 재시작

**결정: 3번**. 이유: "PMW surface patch와 validator/cutover lane이 같은 workspace에서 반복적으로 엮이며 implementation cleanup보다 contract realignment 비용이 더 커졌다."

> 이 결정이 가장 중요한 교훈이다 — 언제 "계속 밀기"보다 "cleanslate"가 더 나은지 판단하는 기준을 사전에 정해두지 않으면 판단이 늦어진다.

#### 분기점 2: DB Truth vs. Markdown Only (CR-11 핵심)

선택지: Markdown만 계속 사용 vs. DB + Markdown 이중 구조

**결정: DB + Markdown 분리**. 이유: hot-state(매번 바뀌는 값)와 context(장기 판단 근거)는 특성이 다르다. hot-state를 Markdown으로 관리하면 변경마다 여러 파일에 중복 수정 필연적.

#### 분기점 3: Separate User-Only Docs vs. Layered Model (CR-12 핵심)

선택지: 사용자용 별도 Markdown 세트 생성 vs. 같은 파일 안에서 layered model

**결정: Layered model**. 이유: 문서 수 증가 = maintenance cost 2배, AI context budget 증가, drift 필연적.

#### 분기점 4: Node Built-in SQLite vs. External Package

선택지: `better-sqlite3` 등 외부 패키지 vs. `node:sqlite` (`DatabaseSync`)

**결정: node:sqlite**. 이유: native addon 없이 동작, Windows friction 최소화. 단 Node.js >= 24 필요 (experimental warning 발생하지만 기능 정상).

---

## Part 3. 초기 설계와 진행에 꼭 반영할 요소들

### 3-1. Day 0에 반드시 결정하고 고정할 4가지

> "새 repo는 코드가 아니라 문서부터 시작한다." — `GREENFIELD_CHARTER.md`

**결정 1: Truth Ownership Split**
- Hot-state와 Context의 경계를 명확히 그어라
- "이 정보는 매번 바뀌는가?" → Yes면 DB, No면 Markdown
- 애매한 정보는 Markdown으로 두고 DB 이전은 나중에 결정

**결정 2: PMW Source-to-Surface Mapping**
- 5개 PMW surface 각각의 canonical source file + designated section을 Day 0에 결정
- 이 결정이 없으면 구현 중 "어디서 데이터를 가져올 것인가"로 계속 흔들린다
- 각 surface마다 fallback rule도 함께 결정 (`needs source` vs `unknown` vs `empty state`)

**결정 3: Development Lane 분리**
처음부터 3개 레인을 독립 milestone으로:
- **Lane A**: UI read model (PMW 화면, 4-surface, detail panel)
- **Lane B**: State infrastructure (DB, generated docs, validator, cutover tooling)  
- **Lane C**: Rollout (starter promotion, downstream sync)

Lane A와 B를 같은 milestone에 묶으면 TST-08처럼 하나가 막혔을 때 전체가 멈춘다.

**결정 4: Prototype-to-Greenfield Trigger 사전 정의**
아래 기준 중 하나라도 충족하면 "같은 repo를 계속 밀 것인가"를 즉시 평가한다:

| Trigger | 설명 |
|---|---|
| Source contract reset ≥ 2회 | 같은 surface의 "무엇을 보여줄지"를 두 번 이상 재정의 |
| UI fix + cutover가 같은 iteration에 묶임 | 두 레인이 한 번에 막힘 |
| Harness overhead > actual work 감지 | artifact sync가 구현보다 비용이 큼 |
| browser evidence 이후 contract 재설계 | 구현이 끝나도 "무엇을 만들지"가 흔들림 |

---

### 3-2. 초기 Artifact 작성 순서 (검증된 순서)

```
1. REQUIREMENTS.md         requirements_deep_interview skill 후 작성
   → 승인 후에만 ↓

2. ARCHITECTURE_GUIDE.md   truth ownership + layer boundaries + forbidden paths
   → 동시에 ↓

3. IMPLEMENTATION_PLAN.md  phased order + lane 분리 + cutover sequence + task packets
   → UI scope 확인 후 ↓

4. UI_DESIGN.md            4-surface model + summary authoring contract + mockup
   + mockup SVG 작성 + user confirmation
   → 승인 후에만 구현 시작
```

**절대 건너뛰면 안 되는 것**: Requirements 승인 전 arch/plan sync, Design approval 전 구현 시작.

---

### 3-3. 파일별 역할 고정 매트릭스 (CR-12 File Role)

새 프로젝트에서 파일별 역할을 Day 0에 고정하면 "어디에 무엇을 쓴다"는 판단 비용이 없어진다.

| 파일 | Technical Facts (상단) | User-Facing Section (하단) | PMW Usage Rule |
|---|---|---|---|
| `REQUIREMENTS.md` | baseline, scope, FR/NFR, constraints | Product Goal, Problem Statement | Hero source. raw FR/NFR을 card copy로 직접 쓰지 않는다 |
| `ARCHITECTURE_GUIDE.md` | structure, ownership, layer contracts | (선택적) boundary summary | source trace / deep detail 전용. user copy 직접 추출 금지 |
| `IMPLEMENTATION_PLAN.md` | task packets, invariants, gates | `## Operator Next Action` | designated section 있을 때만 "Next Action" consume |
| `UI_DESIGN.md` | component hierarchy, design constraints | PMW IA/copy rule | PMW label/copy contract truth |
| `CURRENT_STATE.md` | generated resume facts, sync status | `## Decision Required Summary`, `## Current Focus Summary` | generated fallback. 둘을 같은 prose에서 중복 파생 금지 |
| `TASK_LIST.md` | task rows, blockers, handoff log | `## Blocked / At Risk Summary` | badge는 visible row와 1:1 대응 시에만 |
| `WALKTHROUGH.md` | test evidence structure | raw user feedback | PMW detail 보조 source, home copy direct source 금지 |
| `DECISION_LOG.md` | append-only decision rationale | recent decision summary (선택) | history source, open decision queue 아님 |
| `PREVENTIVE_MEMORY.md` | recurring harness friction rules | (없음) | PMW home source 아님, day_start에서 읽음 |
| `PROJECT_HISTORY.md` | long-term timeline | (없음) | history/reference only |

---

### 3-4. DB Schema 설계 기준 (검증된 필드 설계)

새 프로젝트에서 DB를 새로 설계할 때 이 프로토타입의 9-table 구조를 참고하되, 아래 설계 원칙은 반드시 유지:

1. **모든 mutable row에 `version` 필드** — optimistic concurrency 필수
2. **`source_ref` grammar 고정** — `<repo-relative-path>[#<fragment>]` 형식
3. **`handoff_log`는 append-only** — `supersedes_handoff_id`로 chain
4. **`generation_state` 테이블 필수** — checksum 기반 drift 탐지
5. **`artifact_index`는 파일 스캔으로 채움** — Markdown truth와 별도 관리
6. **command surface 먼저 고정** — 7개 명령 표면을 implementation 전에 vocabulary freeze

---

### 3-5. Generated Docs Cutover Sequence (절대 변경 금지)

```
1. import       현재 Markdown state에서 DB bootstrap
2. shadow       generated docs를 shadow 경로에 미리 생성
3. parity       required-field equality 검증 (prose similarity 아님)
4. freeze       manual editing 중단 선언
5. flip         generated docs가 tracked docs를 overwrite
6. rollback     flip 후 validator failure 시 pre-flip snapshot 복원
```

> **parity 기준은 field equality다** — 문장 유사도로 판단하면 false negative 발생. 검증 필드: `current_stage`, `release_gate_state`, `current_focus`, `release_goal`, `next_role`, `next_action`, active work item IDs, open gate IDs, `updated_at`.

---

### 3-6. PMW UI 설계 기준 (DSG-12 Approved Baseline)

새 repo에서 PMW를 다시 구현할 때의 UI 설계 기준 (user가 승인한 최종 기준):

**Hero 영역:**
- project title: 현재보다 20~30% 작게
- problem statement: full-width numbered list (한 줄에 하나씩)
- `solo` / last update strip: Refresh/Artifacts/Settings 아래 utility strip으로
- release-goal line: hero strong surface에 노출하지 않음

**Top 4-Card Rail:**
- short summary만 노출 (항목당 20자 이내 기준)
- Decision Required + Blocked/At Risk: strong accent, 나머지는 secondary
- raw technical prose, raw file path, parser 설명 직접 노출 금지
- card 간 hierarchy 일관성 유지

**Detail Panel:**
- badge count = visible item count (1:1 parity 필수)
- heading typography: hero보다 20~30% 작게
- decision/blocker 항목: type / reason / impact / related artifact / source trace 포함
- diagnostics: secondary layer (dock), blocking일 때만 strong banner

**Design Tokens (검증됨):**
- Font: `Noto Serif KR` (hero), `IBM Plex Sans KR` (UI), `JetBrains Mono` (source trace)
- Color: paper `#f4efe6`, ink `#1d2424`, teal `#214b52`, copper `#b76a3c`
- Concept: editorial operations desk

---

### 3-7. Validator 설계 기준

`check_harness_docs.ps1` (86KB)이 실제 구현됐다. 새 프로젝트의 validator는 최소한 다음을 커버해야 한다:

| 검사 항목 | 이유 |
|---|---|
| Required section presence | designated summary section 누락 탐지 |
| Generated docs parity (required fields) | DB와 generated docs drift 탐지 |
| artifact_index coverage | `.agents/artifacts/*.md` 누락 탐지 |
| source_ref resolve | 존재하지 않는 경로 참조 탐지 |
| UTF-8 without BOM | Korean mojibake 탐지 (Windows 환경 필수) |
| schema version check | DB schema mismatch 탐지 |
| count/detail parity | badge와 visible list 불일치 탐지 |
| starter source pollution | live 운영 내용이 template source에 오염됐는지 탐지 |

---

### 3-8. Acceptance Criteria (새 repo의 Done 기준)

`GREENFIELD_CHARTER.md`에서 승인된 acceptance 기준:

- [ ] Generated docs: deterministic 재실행 hash 일치 + required-field parity pass
- [ ] PMW first view: 30초 안에 Decision/Blocked/Focus/Next 파악 가능
- [ ] Summary/detail/source trace/count parity pass
- [ ] Raw technical prose direct projection 없음 확인
- [ ] Validator가 drift, missing source, mojibake, cutover mismatch 탐지
- [ ] Migration preview와 rollback path가 문서·스크립트·검증에서 일치
- [ ] Hero에서 release-goal line 미노출 + problem statement full-width

---

### 3-9. 하지 말아야 할 것 (검증된 Non-Goals)

| Non-Goal | 이유 |
|---|---|
| 현재 repo PMW 코드를 그대로 복사 | reference-only. greenfield에서 approved contract 기준으로 재구현 |
| PMW write boundary를 초기 버전부터 열기 | 별도 change request와 rollback rule 없이 불가 |
| Separate user-only duplicate docs 생성 | maintenance cost 2배, drift 필연 |
| starter/downstream rollout을 첫 milestone에 묶기 | self-hosting 검증 후 별도 CR |
| Remote DB, external SaaS, multi-user realtime sync | 이번 버전 명시적 out-of-scope |
| archive/starter/reset artifact를 기본 viewer 범위에 包含 | first-release out-of-scope |

---

## 요약: 새 프로젝트를 위한 완전 체크리스트

### Phase 0: Day 0 결정 (코드 없이)
- [ ] Truth split 결정: hot-state (→DB) vs context (→Markdown) 경계
- [ ] PMW 5-surface source mapping 결정 + fallback rule
- [ ] Lane 분리: UI read model / State infrastructure / Rollout을 별도 milestone
- [ ] Prototype-to-greenfield trigger 기준을 문서에 명시
- [ ] DB schema 9-table 구조 + command surface 7개 vocabulary freeze

### Phase 1: 문서 기반선 (구현 전)
- [ ] `requirements_deep_interview` skill 수행 후 REQUIREMENTS.md 작성
- [ ] user 승인 후 ARCHITECTURE_GUIDE.md (truth ownership + forbidden paths)
- [ ] IMPLEMENTATION_PLAN.md (lane 분리 + cutover sequence + task packets)
- [ ] UI_DESIGN.md + mockup SVG + user confirmation
- [ ] 4문서가 decision-complete baseline이 되기 전에 코드 시작 금지

### Phase 2: State Infrastructure (Lane B)
- [ ] DB schema + bootstrap + optimistic concurrency
- [ ] Generated docs writer (deterministic shadow mode)
- [ ] Required-field parity validator
- [ ] UTF-8 safety + mojibake scan
- [ ] Cutover sequence: shadow → parity → freeze → flip → rollback

### Phase 3: PMW UI (Lane A, Lane B 안정화 후)
- [ ] 4-card top surface (designated section consumption만)
- [ ] Detail panel (count/detail parity, source trace)
- [ ] Diagnostics dock (non-blocking warning은 secondary layer)
- [ ] Artifact browser + markdown viewer
- [ ] Hero: release-goal line 미노출, problem statement full-width

### Phase 4: Release Gate
- [ ] Review gate (truth ownership, read-only boundary, split truth 없음)
- [ ] Deployment gate (self-hosting cutover 결정)
- [ ] Starter/downstream rollout은 별도 CR

### 항상 회피할 것
- [ ] 요구사항 승인 전 architecture/plan을 새 기준선으로 선언
- [ ] Design approval 전 구현 시작
- [ ] Raw prose를 PMW strong surface에 direct projection
- [ ] Badge count와 visible list를 다른 경로에서 관리
- [ ] Non-blocking warning을 first-view banner 기본값으로
- [ ] UI fix lane과 cutover lane을 같은 iteration에 묶기
- [ ] Starter source에 live 운영 내용(날짜, 승인 이력, handoff 원문) 포함

---

*검토한 소스 파일 전체*  
아티팩트 14종 | PMW 구현 소스 (`build-dashboard-snapshot.js` 33KB, `operating-state-store.js` 33KB, `state-doc-generation.js` 34KB, `app.js` 32KB, `workspace-model.js` 18KB, `styles.css` 18KB, `check_harness_docs.ps1` 86KB 등) | 워크플로우 8종 | 스킬 18종 | 스크립트 5종 | DB schema + 실제 SQLite 파일  
*작성 기준일: 2026-04-16*
