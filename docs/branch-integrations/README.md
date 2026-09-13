# Integrated branch snapshots

This directory records non-destructive assets imported from the independent database-analysis and windows-rebuild branches.

## Merge policy

The current `feature/onex-complete-webapp` Workbench remains authoritative for application routing, authentication, window management, and the Oracle Forms visual shell. The compatible `origin/onex-web-2` branch was merged for its System Setup page and `/setup` route. Independent branch assets are stored below this directory to avoid replacing the active Workbench implementation.

| Source branch | Integration result |
|---|---|
| `origin/onex-web-2` | Merged; System Setup route added while `/` and `/workbench` remain the authenticated Workbench. |
| `origin/analysis/database-integration-phase1` | Analysis reports, extraction utilities, and database integration evidence copied to `database-analysis/`. |
| `origin/rebuild/windows-compatible-app` | Rebuild specifications, reports, source inventory, and scripts copied to `windows-rebuild/`. |
| `origin/main` | Common ancestor content already represented in the current branch; no separate overwrite performed. |

Future updates should be reviewed against this manifest and merged selectively, preserving the Workbench route and authentication gate.
