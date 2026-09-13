# إعادة بناء جميع النوافذ

تم توليد مواصفات مستقلة لـ **1,490 نافذة**.

## معنى الإنجاز

- كل نافذة لها ملف مواصفة باسمها.
- كل مواصفة مرتبطة بصفها في `docs/window_catalog.csv`.
- الحالة الحالية `catalog_specification` وليست `FMB_compiled`.
- الكود الأصلي لا يمكن اختراعه من FMX؛ يلزم FMB/PLL/PKB/DDL وForms Builder.

## مستويات التنفيذ

| المستوى | الوصف |
|---|---|
| catalog_specification | مواصفة مولدة من التحليل الساكن |
| source_reconstruction | إعادة كتابة من المصدر أو Oracle Packages |
| forms_builder_build | تجميع FMB/PLL عبر Forms Builder |
| golden_master_verified | مطابقة مع النظام القديم |
| production_ready | اعتماد وتشغيل |

## سجل الحالة

`rebuild_source/manifests/all_windows_rebuild_status.csv` هو المصدر المنظم للحالة والتقدم.
