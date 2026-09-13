# ONEX Source Archives

This directory preserves the source archives used to reconstruct the ONEX/YS ERP window contracts.

## Why the large archive is split

GitHub rejects individual files larger than 100 MB. The original `YS_ERP-نسخة_2.7z` archive is approximately 262 MB, so it is stored as sequential 45 MiB parts. The smaller Oracle dump archive is stored whole.

## Reassemble the large archive

From the repository root, run:

```bash
bash source-archives/assemble_ys_erp.sh
```

The script joins the parts into `source-archives/reassembled/YS_ERP-نسخة_2.7z` and verifies its SHA-256 against `MANIFEST.sha256`.

## Contents

| File | Purpose |
|---|---|
| `YS_ERP-نسخة_2.7z.part-*` | Split source archive parts |
| `Onyxv620261_20260831.rar` | Oracle database dump container supplied with the project |
| `MANIFEST.sha256` | Checksums for the original archive and every stored part |
| `assemble_ys_erp.sh` | Deterministic reassembly and checksum verification script |

## Resume point

The active implementation branch is `feature/onex-complete-webapp`. The latest commit is recorded in `../docs/continuation-state.md`. The project already contains the extracted catalog, FMX analysis, runtime contracts, database-backed window routes, and UI test notes.
