# Exhaustive ONEX UI Test

## Test date

2026-09-13.

## Authentication

The `/workbench` route is protected by the local authentication flow when `ENABLE_LOCAL_AUTH=true`. The test server was started with a configured username and password, the login screen was displayed, the password was submitted through the browser, and the UI confirmed `تم تسجيل الدخول بنجاح`. The session is stored in an `httpOnly` cookie and the server exposes login, logout, and session-check endpoints under `/api/local-auth/*`.

## Window coverage

Every menu entry in the workbench navigator was opened sequentially. The run covered 27 menu entries across nine modules and produced 26 open sessions because `ARSR041` appears in both the AR and Reports menus and is represented by one shared session ID.

| Module | Menu entries | Result |
|---|---:|---|
| ADMIN | 4 | All opened and reached `ready` |
| GL | 6 | All opened and reached `ready` |
| AR | 4 | All opened and reached `ready` |
| AP | 3 | All opened and reached `ready` |
| Inventory | 2 | All opened and reached `ready` |
| MRP | 1 | Opened and reached `ready` |
| HR | 2 | Opened and reached `ready` |
| POS | 2 | Opened and reached `ready` |
| Reports | 3 | All opened and reached `ready` |

The final browser state displayed 26 ready sessions and the `MRPREP001` FMX contract with its fields, lifecycle procedures, report filters, and data row. No window failed to open and no browser console error was observed during the run.

## Limitation

The local login is intentionally disabled unless `ENABLE_LOCAL_AUTH=true` is set. Production deployments should use the existing OAuth route or explicitly provision local credentials through environment secrets; the fallback test password is not embedded in production configuration.
