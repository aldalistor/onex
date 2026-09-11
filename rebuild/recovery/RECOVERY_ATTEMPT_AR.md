# تقرير محاولة استرجاع FMB/PLL وإعادة البناء البديلة

## نتيجة الاسترجاع

تم فحص أدوات التحويل والبناء القياسية، ولم توجد في البيئة الحالية أدوات `frmf2xml`, `frmxml2f`, `frmcmp_batch`, `frmcmp`, `imp`, `impdp`, أو `sqlplus`. كما تم البحث في كل الأرشيفات والمواد المفكوكة عن `FMB`, `MMB`, `PKS`, `PKB`, ومصادر Forms ولم توجد ملفات FMB/PLL المصدرية.

الملفات المتاحة هي ملفات Forms/Libraries مجمعة:

- 1,491 ملفًا بامتداد FMX/PLX/MMX في المواد المفكوكة.
- `calendar.pll` و`d2kwutil.pll` موجودان، لكنهما Binary Compiled PLL وليسا مصدرًا نصيًا.
- ملفات RDF الموجودة تقارير مجمعة وليست مصادر FMB.

## القرار

لا يمكن استعادة `FMB` أو `PLL` المصدرية الأصلية بصورة موثوقة أو إنشاء ملف Native صالح لـForms Builder من FMX/PLX في هذه البيئة. تمت المحافظة على الأصول المجمعة داخل الأرشيفات الأصلية، وتم الانتقال إلى إعادة بناء موثقة لا تدّعي أنها الأصل byte-for-byte.

## ما تم إنشاؤه

- `manifests/recovery_manifest.csv`: سجل كل نافذة من 1,490 نافذة وحالة الاسترجاع.
- `../docs/window_catalog.csv`: الكتالوج الكامل.
- `../docs/function_traceability.csv`: 6,077 أثرًا للدوال والمكونات وSQL.
- `../oracle_forms/modules/*.spec.md`: 18 مواصفة لوحدات حرجة.
- `forms/ARST004_rebuild_spec.md`: مواصفة أول Form قابل للتنفيذ يدويًا داخل Forms Builder.
- `plsql/YSERP_REBUILD_WRAPPERS.pls`: قالب طبقة wrappers لإعادة بناء PLL منطقيًا.
- `database/ARST004_required_objects.sql`: قائمة تحقق للجداول والحزم المطلوبة، وليست DDL مُخمنًا.

## لإنتاج FMB/PLL Native

يلزم تشغيل Forms Builder متوافق مع إصدار النظام على جهاز تطوير أو VM، ثم بناء الوحدات من المواصفات والـDDL/PKB المصدرية. ملفات FMX/PLX وحدها تعطي مؤشرات قوية، لكنها لا تحفظ كل خصائص Canvas/Items/LOV/Triggers المصدرية.
