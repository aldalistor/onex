# المرحلة الأولى: استيراد قاعدة Onyx واستخراج النموذج الكامل

## الهدف

تهدف هذه الحزمة إلى استيراد ملف Data Pump في **Oracle Test Schema معزول**، ثم استخراج بنية النظام وبيانات الشاشات والصلاحيات والحزم والجداول التشغيلية. لا تستخدم هذه الخطوات على قاعدة الإنتاج، ولا تضع كلمات المرور داخل الملفات أو Git.

## الملفات المطلوبة

ضع الملف التالي داخل Oracle `DATA_PUMP_DIR` أو داخل المجلد المسموح به في الخادم:

```text
Onyx v620261_20260831.dmp
```

لا تنقل ملف الـdump إلى مستودع GitHub. النسخة الموجودة في جهاز التحليل ليست بديلًا عن نسخة احتياطية رسمية.

## المتطلبات

يحتاج التنفيذ إلى:

| المتطلب | الغرض |
|---|---|
| Oracle Database اختبارية | عزل الاستيراد عن الإنتاج |
| Oracle Data Pump `impdp` | استيراد الـdump |
| SQL*Plus أو SQLcl | تنفيذ الاستعلامات والتصدير |
| حساب DBA مؤقت | إنشاء المستخدم والمجلد فقط |
| حساب قراءة `ONYX_READ` | استخراج البيانات دون صلاحيات تعديل |
| مساحة تخزين كافية | بيانات الجداول وملفات CSV وDDL |

## سياسة الأمان

يجب تنفيذ الاستيراد في قاعدة اختبارية، مع استبعاد المستخدمين والأدوار والمنح العامة من الـdump. يجب مراجعة أسماء الـSchema وTablespace قبل التشغيل. لا تستخرج أعمدة كلمات المرور إلى ملفات CSV؛ ملف `USER_R` يجب أن يصدر بحقول تعريفية وتشغيلية منقحة فقط.

## التسلسل التنفيذي

### 1. تجهيز المجلد وDirectory Object

ينفذ DBA الخطوات التالية على قاعدة الاختبار:

```sql
CREATE OR REPLACE DIRECTORY ONYX_DP_DIR AS '/oracle/backup/onyx';
GRANT READ, WRITE ON DIRECTORY ONYX_DP_DIR TO SYSTEM;
```

يجب استبدال المسار بمسار الخادم الفعلي. المسار المحلي على جهاز المستخدم لا يكون مرئيًا لخادم Oracle.

### 2. إنشاء Schema اختبارية

يمكن استخدام Schema موجودة أو إنشاء Schema جديدة. مثال مبدئي:

```sql
CREATE USER ONYX_READ IDENTIFIED BY "ضع_كلمة_مرور_مؤقتة_خارج_الملف";
GRANT CREATE SESSION TO ONYX_READ;
```

كلمة المرور تكتب تفاعليًا أو عبر Vault، ولا تُحفظ في هذا المستودع.

### 3. استيراد Data Pump

استخدم ملف المعلمات `impdp_onyx_test.par.example` بعد نسخه إلى ملف محلي وإكمال القيم غير الحساسة:

```bash
impdp system@ONYX_TEST \
  parfile=impdp_onyx_test.par \
  logfile=onyx_import_test.log
```

الاستيراد الأول يجب أن يكون Metadata + Data. إذا فشل بسبب إصدار Oracle أو Tablespaces، نفذ معاينة `SQLFILE` أولًا، ثم عدل `REMAP_TABLESPACE` أو `EXCLUDE` بعد مراجعة الأخطاء.

### 4. فحص ما بعد الاستيراد

نفذ:

```bash
sqlplus -L ONYX_READ@ONYX_TEST @01_preflight.sql
```

لا تنتقل للاستخراج إذا ظهرت جداول أساسية ناقصة أو أخطاء Invalid Objects غير مفهومة.

### 5. استخراج شامل

نفذ الملفات بالترتيب:

```bash
sqlplus -L ONYX_READ@ONYX_TEST @02_extract_metadata.sql
sqlplus -L ONYX_READ@ONYX_TEST @03_extract_security.sql
sqlplus -L ONYX_READ@ONYX_TEST @04_extract_forms_tree.sql
sqlplus -L ONYX_READ@ONYX_TEST @05_extract_business.sql
sqlplus -L ONYX_READ@ONYX_TEST @06_extract_packages.sql
```

ينتج التنفيذ ملفات CSV وDDL داخل مجلد `ONYX_EXTRACT` الذي يجب إنشاؤه على الخادم ومنحه صلاحية كتابة لحساب الاستخراج فقط.

## الجداول التي يجب استخراجها

### الشجرة والنوافذ

```text
FORM_DETAIL
IAS_FORM_NAME
IAS_FAVORITE_SCR
S_SCR_LBL
IAS_MNDTRY_SCR_FIELDS
```

### المستخدمون والصلاحيات

```text
USER_R                 -- بدون PASSWORD وPASSWORD2
IAS_USER_GROUP
PRIVILEGE
PRIVILEGE_FIXED
PRIVILEGE_CC
PRIVILEGE_GC
PRIVILEGE_WH
IAS_FRM_FLD_PRIV
S_USR_TP_PRV
S_BRN_USR_PRIV
S_FLAGS_PRIV
IAS_DATE_LOCK_USER_SCR
IAS_USR_LGN_HSTRY
```

### المبيعات والمشتريات

```text
IAS_BILL_MST
IAS_BILL_DTL
IAS_RET_BILL_MST
IAS_RET_BILL_DTL
IAS_RT_BILL_MST
IAS_RT_BILL_DTL
IAS_PI_BILL_MST
IAS_PI_BILL_DTL
IAS_PR_BILL_MST
IAS_PR_BILL_DTL
SALES_ORDER
```

### المخزون والتكلفة

```text
ITEM_MOVEMENT
MASTER_INV
DETAIL_INV
ITEMS_COSTING
COST_MASTER
COST_DETAIL
WAREHOUSE_DETAILS
WAREHOUSE_GROUP
ITEM_BIN
IAS_ITEMS_ACTIVITY
IAS_ITEM_PERIODIC_COST
IAS_ITEM_SERIALNO
IAS_WHTRNS_MST
IAS_WHTRNS_DTL
STK_ADJUSTMENT
STK_ADJUSTMENT_DET
IAS_TRANSFER_IN_TMP
IAS_TRANSFER_OUT_TMP
```

### القيود والتدقيق والإعدادات

```text
MASTER_JOURNAL_V
DETAIL_JOURNAL_V
GLS_VCHR_MST_ACCNT
GLS_RQ_VCHR_MST_ACCNT
IAS_PI_BILL_JRNL
IAS_AUDIT_DOC
IAS_DOC_PST_UNPST_TMP
IAS_PARA_INV
IAS_PARA_AR
IAS_PARA_AP
IAS_PARA_GL
IAS_CONN_ACC_INV_BY_GL
```

## النتائج المطلوبة

لا تعتبر المرحلة مكتملة إلا إذا نتجت الملفات التالية:

```text
object_inventory.csv
column_inventory.csv
constraint_inventory.csv
index_inventory.csv
form_detail.csv
form_names.csv
system_tree.csv
user_groups.csv
screen_privileges.csv
field_privileges.csv
branch_privileges.csv
login_history.csv
package_specs.sql
package_bodies.sql
inventory_tables/*.csv
accounting_tables/*.csv
extraction_manifest.json
```

يجب أن يحتوي كل ملف على اسم المصدر وتاريخ الاستخراج واسم Schema، باستثناء أي قيمة سرية.

## قواعد التنقيح

يجب حذف أو حجب الأعمدة التالية قبل مشاركة النتائج:

```text
USER_R.PASSWORD
USER_R.PASSWORD2
أي مفاتيح تشفير
أي Connection String
أي Access Token
أي بيانات شخصية غير لازمة
```

يمكن الاحتفاظ بمؤشرات إحصائية مثل عدد المستخدمين أو عدد السجلات، لكن لا تشارك صفوف المستخدمين الخام قبل مراجعة الخصوصية.

## مخرجات المطابقة مع Onyx

بعد اكتمال CSV، تتم المطابقة مع:

```text
rebuild/docs/window_catalog.csv
rebuild/docs/function_traceability.csv
rebuild/oracle_forms/deep_catalog/form_field_trigger_catalog.jsonl
rebuild/oracle_forms/deep_catalog/window_runtime_contracts.jsonl
```

المفاتيح الأساسية للمطابقة هي:

```text
FORM_DETAIL.F_FILE_NAME ↔ window_catalog.file
FORM_DETAIL.FORM_NO ↔ IAS_FORM_NAME.FORM_NO
FORM_DETAIL.F_PARENT_NO ↔ FORM_DETAIL.FORM_NO
PRIVILEGE.FORM_NO ↔ FORM_DETAIL.FORM_NO
USER_R.U_ID ↔ PRIVILEGE.U_ID
```

## معيار قبول المرحلة

تنجح المرحلة الأولى عندما:

1. يكتمل الاستيراد في Schema اختبارية دون تعديل الإنتاج.
2. تظهر الجداول الأساسية وعدد صفوفها في `extraction_manifest.json`.
3. يمكن بناء شجرة `FORM_DETAIL` بلا عقد يتيمة أو دورات.
4. ترتبط أسماء الشاشات باللغات المتاحة.
5. يمكن استخراج صلاحيات مستخدم اختباري دون كلمات مرور.
6. يمكن ربط غالبية `F_FILE_NAME` بكتالوج Forms.
7. تحفظ مواصفات الحزم وتبعياتها مع تنقية الأسرار.
8. يمكن إعادة تشغيل الاستخراج وإنتاج نفس النتائج مع اختلاف وقت الاستخراج فقط.

## ما لا يمكن تنفيذه من جهاز التحليل الحالي

لا يحتوي جهاز التحليل الحالي على Oracle Database أو `impdp` أو بيانات اتصال بالخادم. لذلك تم إعداد حزمة التنفيذ فقط. يجب أن ينفذ DBA الاستيراد على خادم Oracle اختبارية، ثم يرسل ملفات CSV/DDL المنقحة أو يتيح اتصالًا آمنًا ببيئة الاختبار.

## الخطوة التالية بعد الاستخراج

بعد تسليم النتائج، يتم إنشاء نموذج موحد يربط:

```text
المستخدم
→ الشركة والفرع والسنة
→ الشاشة الأب والابن
→ اسم الشاشة واللغة
→ ملف Form
→ صلاحيات العمليات
→ صلاحيات الحقول
→ الحزم والإجراءات
→ الجداول المستخدمة
```

ثم يبدأ اختبار `ERP_LOGIN` وبناء شجرة مستخدم حقيقية قبل الانتقال إلى `ARST004` وحركة المخزون والترحيل المحاسبي.
