# ONEX UI Compatibility Test Report

## Test date

2026-09-13.

## Environment

The branch `feature/onex-complete-webapp` was run locally with `pnpm dev` on port 3000 and opened through the sandbox public URL. The tested route was `/workbench`.

## Executed scenarios

| Scenario | Result | Evidence |
|---|---|---|
| Load Workbench shell | Passed | Menubar, toolbar, RTL navigator, session area, status bar and module tree rendered. |
| Open `GLST001` | Passed | FMX namespace `NSPC6`, extracted fields, lifecycle procedures and Oracle-style toolbar rendered. |
| Execute F7 query | Passed | Toast confirmed: `تم تحديث سجلات GLST001 من قاعدة البيانات`. |
| Expand POS module | Passed | `POSLGN` and `POST001` appeared in the navigator. |
| Open `POST001` | Passed | Invoice fields, `NSPC11` namespace, procedures and POS contract rendered. |
| Dirty-state transition | Passed | Editing `DOC_NO` changed session phase from `ready` to `dirty`; save action became available. |
| Save `POST001` | Passed | Toast confirmed `تم حفظ POST001 · POST_FORMS_COMMIT_PRC · تسجيل أثر التدقيق`; phase returned to `ready`. |
| Expand Reports module | Passed | `GLSR001`, `ARSR041`, and `MRPREP001` appeared. |
| Open `GLSR001` | Passed | Report parameters, `NSPC0` contract, lifecycle procedures and report data source note rendered. |
| Automated checks | Passed | TypeScript check, production build, and 19 Vitest tests passed before this UI run. |

## Compatibility assessment

The new UI matches the old system's interaction model at the tested shell level: RTL Oracle Forms-style work area, module navigator, window sessions/tabs, lifecycle phases, FMX-derived field labels, keyboard/action semantics, query/save/cancel/print toolbar, and audit-oriented commit feedback.

This is a behavioral and structural compatibility result, not a claim of pixel-perfect equivalence to every legacy FMX screen. The original FMX binaries are not browser-renderable source layouts, and the current ONEX schema does not yet contain native HR tables equivalent to `S_EMP`; therefore `HRSI002` and `HRSR002` are contract-complete but still require the HR data layer for full live records.

## Follow-up items

1. Add browser automation to CI when a stable browser runner is selected.
2. Add ONEX HR tables and mutations for live `HRSI002` and `HRSR002` records.
3. Replace inferred controls with extracted item metadata as more FMX evidence is decoded.
4. Mark production readiness only after authorization, Oracle/MIDO integration, and migration tests are available.
