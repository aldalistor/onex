# Oracle Forms modules

ضع ملفات المصدر هنا عند توفرها: `*.fmb`, `*.mmb`, `*.pll`.
الملفات الحالية في `reverse_engineering/focus_forms` هي مواصفات مستخرجة من FMX وليست بديلًا عن المصدر الثنائي.

## دورة البناء

1. افتح الوحدة في Forms Builder المتوافق.
2. اربط المكتبات `YSERP_LIB`, `YSPOS_LIB`, و`LYSERP_LIB` من نسخة آمنة.
3. اربط قاعدة اختبار Oracle.
4. قارن Triggers وProgram Units مع `docs/function_traceability.csv`.
5. نفذ اختبارات Golden Master قبل اعتماد الوحدة.
