# Prototype Reference

## 목적
이 문서는 `repo_harness_template` prototype에서 무엇을 살리고 무엇을 버릴지 고정하는 reference다.

## 그대로 가져갈 것
- hot-state는 repo-local DB가 유일한 write truth
- context / decision / review / deploy 문서는 Markdown canonical truth
- `CURRENT_STATE.md`, `TASK_LIST.md`는 generated docs라는 방향성
- PMW는 `Decision Required`, `Blocked / At Risk`, `Current Focus`, `Next Action` 4-surface와 artifact viewer를 가진 read-only operator surface
- strong surface는 designated user-facing summary만 consume
- source 없는 summary는 raw fallback 대신 `unknown` 또는 `needs source`
- count badge와 visible detail list는 1:1 대응
- non-blocking diagnostics는 first-view strong surface를 가리지 않음
- cutover는 `import -> shadow -> parity -> manual freeze -> flip -> rollback`

## 버릴 것
- 기존 `tools/project-monitor-web/*` 구현 구조
- current repo의 partial patch 흐름
- starter scaffold 기반의 무거운 운영 문서 체계
- 기존 runtime artifact와 screenshot을 구현 seed로 쓰는 방식

## prototype에서 확인한 실패 패턴
- summary/detail parity drift
- raw technical prose leakage
- diagnostics priority inversion
- UI fix lane과 cutover lane의 과도한 결합
- harness/process overhead dominance

## 새 workspace 원칙
- 문서부터 시작한다.
- 구현 코드는 복사하지 않는다.
- workflow는 필요한 만큼만 나중에 붙인다.
- 현재는 baseline 결정과 구조 설계가 우선이다.