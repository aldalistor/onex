# الكود المولد لجميع النوافذ

تم إنشاء كود مبدئي مستقل لكل **1,490 نافذة**:

- `plsql_specs/`: 1,490 Package Specifications (`.pks.sql`).
- `plsql_bodies/`: 1,490 Package Bodies (`.pkb.sql`).
- `forms_triggers/`: 1,490 ملفات Triggers بصيغة Oracle Forms.
- `metadata/generated_code_manifest.csv`: سجل الربط بين النافذة والكود المولد.

## تحذير التنفيذ

هذا الكود **Skeleton/Scaffold مولد من الكتالوج** وليس استرجاعًا للكود الأصلي. لا يحتوي على DML مخمن ولا أسماء أعمدة غير مؤكدة. الدوال ترجع حالات آمنة وتحتوي TODO حتى تتم إضافة توقيعات PKS/PKB وDDL من قاعدة الاختبار.

قبل التجميع أو التشغيل يجب:

1. استخراج Package Specs/Bodies الحقيقية من Oracle Test DB.
2. مطابقة Blocks وItems من FMB أو لقطة تشغيلية.
3. استبدال `NULL` والـTODO بمنطق موثق.
4. اختبار الصلاحيات والترحيل والعكس والتدقيق.
5. تنفيذ Golden Master مقارنة مع Forms القديم.
