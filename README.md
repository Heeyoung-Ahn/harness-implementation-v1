# harness-implementation-v1

이 폴더는 `repo_harness_template` prototype에서 검증한 경험과 설계 계약만 가져와, 구현을 백지에서 다시 시작하는 thin workspace입니다.

## 포함 범위
- `REQUIREMENTS.md`
- `ARCHITECTURE_GUIDE.md`
- `IMPLEMENTATION_PLAN.md`
- `UI_DESIGN.md`
- `PROTOTYPE_REFERENCE.md`

## 의도적으로 제외한 것
- 기존 PMW 코드
- 기존 runtime / validator / migration 스크립트
- 기존 harness workflow / handoff / review / deploy 체계
- starter scaffold 전체

## 시작 순서
1. `PROTOTYPE_REFERENCE.md`로 carry-forward contract를 읽는다.
2. `REQUIREMENTS.md`를 승인 가능한 baseline으로 다듬는다.
3. `ARCHITECTURE_GUIDE.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN.md`를 같은 기준선으로 맞춘다.
4. 그 다음에만 구현을 시작한다.