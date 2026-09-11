# مشروع onex — Oracle Forms Development Rebuild

هذا مشروع إعادة بناء محدث يحافظ على نمط النظام القديم ويضيف تتبعًا عميقًا لكل نافذة ودالة ومرجع SQL يمكن استخراجه من الملفات المجمعة.

## النتيجة الحالية

- نوافذ مفهرسة: **1,490**.
- مواصفات مركزة مولدة: **18**.
- سجلات التتبع: **6,077**.
- المجالات: 12.

## الصدق التقني

المشروع جاهز كإطار Development وReverse Engineering ومواصفات بناء، وليس ادعاءً بوجود FMB/PLL مصدرية غير مرفقة. للحصول على نسخة قابلة للفتح في Forms Builder يجب توفير ملفات المصدر الأصلية أو استخراجها من بيئة التطوير.

## نقطة البداية

ابدأ من `ARST004` ثم `ARST006` ثم `ARST023`، مع ربطها بقاعدة Oracle اختبارية ومقارنة الترحيل إلى AR/GL/Inventory.

## الملفات

- `docs/window_catalog.csv`: كل النوافذ.
- `docs/function_traceability.csv`: كل المؤشرات المستخرجة للدوال والمكونات وSQL.
- `oracle_forms/modules/*.spec.md`: مواصفات الوحدات الحرجة.
- `database/ias_dump_analysis.md`: تحليل dump المنقح.
- `modernization/architecture.md`: خطة الحفاظ على قاعدة Oracle والتحديث التدريجي.
- `accounting_core/database/01_onex_accounting_core.sql`: DDL مرجعي لنواة Oracle المحاسبية.
- `accounting_core/packages/ONEX_ATOMIC_API.sql`: حد المعاملة الذرية والتدقيق وOutbox.
- `accounting_core/packages/ONEX_AR_WINDOW_API.sql`: API ذمم يربط ARST004/ARST006 بعملية الترحيل والعكس.
- `accounting_core/forms_compat/window_compatibility.csv`: ربط جميع النوافذ الأصلية وعددها 1,490 بالنواة والمجال.
- `oracle_forms/deep_catalog/form_field_trigger_catalog.jsonl`: الأدلة المستخلصة للحقول والـTriggers والجداول وSQL.
- `oracle_forms/deep_catalog/window_runtime_contracts.jsonl`: عقد تشغيل لكل نافذة يحافظ على الاسم الأصلي ويربطه بـAPI النواة.
