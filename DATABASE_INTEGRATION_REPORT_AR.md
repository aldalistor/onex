# تقرير ربط قاعدة بيانات Onyx مع ملفات وكتالوجات المشروع

## 1. نطاق الفحص

تم فحص الأرشيف المرفق:

```text
Onyxv620261_20260831.rar
└── Onyx v620261_20260831.dmp
```

تم استخراج ملف الـOracle dump في مساحة معزولة دون استيراده أو تشغيل أي كود منه. الملف هو Oracle Data Pump/Export بصيغة ثنائية، وليس ملف SQL نصيًا مباشرًا.

**بصمة المحتوى القابل للقراءة بعد الاستخراج:**

```text
f35508b28650358c2038d2a148586f397bfdad30d445b661bd1c20f49fcecdc3
```

## 2. النتائج المؤكدة

| العنصر | العدد/الحالة |
|---|---:|
| الجداول المستخرجة من DDL | 925 |
| الـViews المستخرجة | 177 |
| Sequences | 13 |
| مؤشرات `ALTER TABLE` والقيود | 9,498 مؤشرًا نصيًا |
| مؤشرات `INSERT` | 6,437 مؤشرًا نصيًا |
| أسماء الكائنات المستخرجة من كتالوجات Onyx | 189,666 |
| روابط كتالوج ↔ جدول/كائن قاعدة بيانات | 4,295 |
| تطابقات أسماء مباشرة | 911 |
| ملفات Form المرتبطة بالنافذة `ERP_LOGIN` | 3 نسخ مفهرسة |

نجاح استخراج DDL لا يعني أن كل بيانات الصفوف أصبحت متاحة نصيًا؛ Data Pump يخزن جزءًا من البيانات في كتل ثنائية لا يمكن استعادة صفوفها بدقة كاملة باستخدام `strings` فقط.

## 3. بنية شجرة النظام الفعلية

تم تأكيد وجود جدولين محوريين لبناء الشجرة:

### `FORM_DETAIL`

```text
F_SYS
SYS_NO
FORM_NO
F_PARENT_NO
F_FILE_NAME
F_BT_PRIV
F_INACTIVE
F_ORDER_NO
SCR_ORGNL
SCR_THEME_NO
SCR_TYP
DOC_TYP
```

وهذا يثبت أن الشجرة تعتمد على علاقة:

```text
FORM_NO       = معرف الشاشة
F_PARENT_NO   = الأب
F_FILE_NAME   = اسم ملف Form أو الوحدة
F_ORDER_NO    = ترتيب العرض
SYS_NO        = النظام/المجال
F_INACTIVE    = حالة التعطيل
SCR_TYP       = نوع الشاشة
DOC_TYP       = نوع المستند عند وجوده
```

### `IAS_FORM_NAME`

```text
LANG_NO
FORM_NO
FORM_NAME
```

هذا الجدول يوفر اسم الشاشة حسب اللغة ويرتبط بـ`FORM_DETAIL.FORM_NO`.

### الحزمة المؤكدة: `YS_SCR_PKG`

استخرجت من الـdump توقيعات وظائف واضحة:

```plsql
GET_SCR_NM
GET_SCR_DOC_TYP
GET_SCR_NO
GET_SCR_PARENT_NO
GET_SCR_SYS_NO
GET_SCR_ORGNL
GET_FORM_NO_FOR_SYS_NO
```

هذه الحزمة تؤكد أن النظام القديم يملك طبقة مركزية لقراءة اسم الشاشة، الأب، النظام، الأصل، ونوع المستند، بدل أن تكون الشجرة مجرد بنية داخل Forms.

## 4. الصلاحيات المرتبطة بالشجرة

### `PRIVILEGE`

```text
U_ID
FORM_NO
INCLUDE_FLAG
AD_FLAG
DEL_FLAG
MOD_FLAG
VIEW_FLAG
PRINT_FLAG
VWREP_FLAG
VRFY_FLAG
PST_FLAG
F_ORDER_NO
AD_DATE
AD_U_ID
UP_DATE
UP_U_ID
```

وهذا يحدد صلاحيات المستخدم على مستوى الشاشة، ومنها العرض والإضافة والتعديل والحذف والطباعة والتحقق والترحيل.

### `IAS_FRM_FLD_PRIV`

```text
U_ID
FORM_NO
TAB_NAME
FLD_NAME
PRIV_FLAG
F_ORDER_NO
AD_DATE
AD_U_ID
UP_DATE
UP_U_ID
```

هذه طبقة صلاحيات دقيقة على مستوى الحقل والجدول، وليست صلاحية شاشة فقط.

### `S_USR_TP_PRV`

```text
U_ID
FORM_NO
OBJ_NM
TP_NM
PRV_FLG
AD_U_ID
AD_DATE
UP_U_ID
UP_DATE
```

تسمح بتقييد صلاحيات المستخدم على كائن أو نوع عنصر داخل الشاشة.

### `S_BRN_USR_PRIV`

```text
U_ID
BRN_NO
ADD_FLAG
VIEW_FLAG
FILL_FLAG
AD_U_ID
AD_DATE
UP_U_ID
```

تربط المستخدم بصلاحيات الفروع.

### `S_FLAGS_PRIV`

```text
U_ID
FLG_CODE
FLG_VALUE
PRIV_FLAG
AD_DATE
AD_U_ID
UP_DATE
UP_U_ID
```

تخزن أعلامًا أو إعدادات تشغيلية خاصة بالمستخدم.

### `IAS_DATE_LOCK_USER_SCR`

```text
U_ID
FORM_NO
UFD
UTD
LFD
LTD
AD_U_ID
AD_DATE
UP_U_ID
UP_DATE
UP_CNT
PR_REP
AD_TRMNL_NM
UP_TRMNL_NM
```

توضح وجود تقييد زمني للمستخدم على مستوى الشاشة، مثل فترات الإدخال أو العرض أو القفل.

## 5. المستخدم والجلسة وتسجيل الدخول

### `USER_R`

تم تأكيد وجود جدول المستخدمين الرئيسي، ويحتوي على حقول تشغيلية كثيرة، منها:

```text
U_ID
U_A_NAME
U_E_NAME
GROUP_NO
INACTIVE
USER_TYPE
ADMIN_USER
CHNG_PASSWD_AFTR_LGN
USER_ONLINE
CONN_WEB_SYS
TRMNL_NAME
TRMNL_LGN
LOGIN
LOGOUT
LOGGED_ON
LOGIN_CNT
CONN_BRN_NO
CONNECTION_TYPE
MACHINE_NO
W_CODE_DEF
CC_CODE_DEF
CASH_NO_DEF
EMP_NO
USE_RSLTN_SCR
```

ويحتوي كذلك على حقول اعتماد حساسة. **لم يتم نسخ قيمها أو عرضها في هذا التقرير**، ولا ينبغي وضعها في GitHub أو إرسالها غير منقحة.

### `IAS_USR_LGN_HSTRY`

```text
U_ID
TRMNL_NM
LGN_TYP
LGN_OUT_DATE
LNG_NO
CMP_NO
BRN_NO
BRN_YEAR
BRN_USR
APPL_NO
HSTRY_NO
```

وهذا يثبت أن النظام يسجل تاريخ الدخول والخروج، الطرفية، اللغة، الشركة، الفرع، السنة، والتطبيق.

### الحزمة `IAS_USR_PKG`

تم تأكيد وظائف المصادقة والصلاحيات التالية:

```plsql
CHK_USR(P_USR_NO, P_PASSWORD, P_LNG_NO) RETURN VARCHAR2
CHK_USR_APPRV
CHK_USR_BRN_PRV
CHK_USR_WC_PRV
CHK_USR_CST_PRV
CHK_USR_VNDR_PRV
CHK_USR_SMAN_PRV
CHK_USR_COLL_PRV
```

كما يوضح جسم `CHK_USR` المستخرج أنه يقرأ حالة المستخدم وفترة السماح من `USER_R` ويعيد رسائل مختلفة للحساب غير الفعال أو خارج الفترة أو حالة كلمة المرور. تم حجب أي قيم اعتماد أثناء التحليل.

## 6. الربط مع نافذة `ERP_LOGIN`

أصبحت علاقة `ERP_LOGIN` بقاعدة البيانات أوضح بكثير:

```text
ERP_LOGIN
  ├── IAS_USR_PKG.CHK_USR
  │     └── USER_R
  ├── IAS_USR_LGN_HSTRY
  ├── PRIVILEGE
  │     └── FORM_DETAIL.FORM_NO
  ├── IAS_FRM_FLD_PRIV
  ├── S_USR_TP_PRV
  ├── S_BRN_USR_PRIV
  ├── S_FLAGS_PRIV
  ├── IAS_DATE_LOCK_USER_SCR
  ├── YS_SCR_PKG
  │     ├── FORM_DETAIL
  │     └── IAS_FORM_NAME
  └── IAS_DBS_SYS_PKG
        ├── فحص الكائنات
        ├── فحص القيود
        ├── فحص Tablespace
        └── التحقق من النظام/المستخدم
```

وهذا يثبت أن مؤشرات المستودع السابقة مثل `LOAD_TREE_PRC` و`FIND_IN_TREE_PRC` و`YS_SCR_PKG` كانت مرتبطة فعلًا بنموذج قاعدة بيانات حقيقي، وليست أسماء عشوائية.

## 7. الجداول المحاسبية والمخزنية المؤكدة

بالإضافة إلى طبقة الدخول والشاشات، يحتوي الـdump على جداول تشغيلية واسعة يمكن ربطها بالنواة المقترحة في مستودع Onyx.

### المبيعات والفواتير

```text
IAS_BILL_MST
IAS_BILL_DTL
IAS_BILL_MST_BR
IAS_BILL_DTL_BR
IAS_RET_BILL_MST
IAS_RET_BILL_DTL
IAS_RT_BILL_MST
IAS_RT_BILL_DTL
IAS_SALES_TYPES
IAS_SALES_DISC
IAS_SALES_FREE_QTY
SALES_ORDER
```

### المشتريات

```text
IAS_PI_BILL_MST
IAS_PI_BILL_DTL
IAS_PR_BILL_MST
IAS_PR_BILL_DTL
IAS_PURCHS_MAN
IAS_PR_REQ_BILL_MST
IAS_PR_REQ_BILL_DTL
```

### المخزون والحركة

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
IAS_ITM_PERIODIC_COST
IAS_ITEM_SERIALNO
IAS_TRANSFER_IN_TMP
IAS_TRANSFER_OUT_TMP
IAS_WHTRNS_MST
IAS_WHTRNS_DTL
STK_ADJUSTMENT
STK_ADJUSTMENT_DET
```

### المحاسبة والقيود

```text
MASTER_JOURNAL_V
DETAIL_JOURNAL_V
GLS_VCHR_MST_ACCNT
GLS_RQ_VCHR_MST_ACCNT
IAS_PI_BILL_JRNL
IAS_AUDIT_DOC
IAS_DOC_PST_UNPST_TMP
```

### إعدادات الربط

```text
IAS_PARA_INV
IAS_PARA_AR
IAS_PARA_AP
IAS_PARA_GL
IAS_CONN_ACC_INV_BY_GL
```

هذه الأسماء توفر أساسًا قويًا لمقارنة النواة الجديدة `ONEX_AR_DOC` و`ONEX_GL_JOURNAL` مع نموذج Onyx الأصلي، لكن يجب استيراد الـdump في Oracle Test Schema لاستخراج المفاتيح والعلاقات والبيانات الصفية بشكل حتمي.

## 8. الحقول التشغيلية المهمة للمخزون

من DDL والكتالوجات ظهرت مفاهيم فعلية تشمل:

```text
I_CODE / ITEM CODE
W_CODE / WAREHOUSE CODE
QTY / QUANTITY
COST
UNIT COST
COSTING TYPE
SERIAL NO
BATCH NO
EXPIRY DATE
TRANSFER IN / TRANSFER OUT
STOCK ADJUSTMENT
ITEM MOVEMENT
```

ويؤكد ذلك أن استكمال دورة المخزون في مستودع Onyx يجب أن يطابق الجداول الأصلية، لا أن يبدأ من نموذج عام فقط. الخطوة التالية هي تحديد الأعمدة الفعلية في `ITEM_MOVEMENT` و`MASTER_INV` و`DETAIL_INV` و`COST_MASTER` و`COST_DETAIL`، ثم ربطها بالمستندات والقيود.

## 9. ما تم وضعه في مجلد التحليل

تم إنشاء حزمة آمنة داخل المستودع، ولا تحتوي على ملف الـdump الأصلي أو قيم كلمات المرور:

- [فهرس كل الجداول والحقول](database_analysis/table_columns.csv)
- [فهرس الجداول بصيغة JSON](database_analysis/table_columns.json)
- [روابط قاعدة البيانات مع كتالوجات Onyx](database_analysis/catalog_db_links.json)
- [الجداول المركزية للأمن والقوائم](database_analysis/focus_security_menu_tables.json)
- [أسماء النوافذ المستخرجة](database_analysis/ias_form_name_data.csv)
- [صفوف Form Detail القابلة للقراءة](database_analysis/form_detail_data.csv)
- [عقد الشجرة المستخرجة من النص القابل للقراءة](database_analysis/system_tree_nodes.csv)
- [إحصاءات الشجرة](database_analysis/system_tree_stats.json)
- [توقيعات الحزم الأساسية المنقحة](database_analysis/key_package_signatures.sql)

## 10. حدود الدقة الحالية

### ما أصبح مؤكدًا

أصبح لدينا الآن تعريفات DDL وأسماء جداول وحقول وقيود وعلاقات، وتوقيعات حزم فعلية، ونموذج واضح للشجرة والصلاحيات، وربط مباشر مع مؤشرات `ERP_LOGIN` و`YS_SCR_PKG` الموجودة في مستودع Forms.

### ما يحتاج استيراد Oracle فعليًا

لا يمكن من ملف Data Pump الثنائي وحده، دون تشغيل `impdp` على Oracle، ضمان استخراج:

- جميع صفوف `FORM_DETAIL`.
- جميع صفوف `IAS_FORM_NAME`.
- الشجرة كاملة بكل اللغات والأنظمة.
- صلاحيات كل مستخدم.
- القيم الفعلية لحركات المخزون والقيود.
- المفاتيح والفهارس المعروضة بدقة من قاموس البيانات بعد الإنشاء.
- النتائج التشغيلية للحزم والإجراءات.

الملف النصي القابل للقراءة أظهر 686 سجل اسم شاشة صريحًا و39 سجل `FORM_DETAIL` صريحًا، لكن هذا لا يمثل بالضرورة كامل البيانات؛ بقية بيانات Data Pump مخزنة في صورة ثنائية أو bind data.

## 11. الخطوة العملية التالية

يلزم إنشاء Oracle Test Schema معزول ثم تنفيذ استيراد Data Pump، مثلًا:

```bash
impdp system@TEST \
  directory=DATA_PUMP_DIR \
  dumpfile='Onyx v620261_20260831.dmp' \
  logfile=onyx_import.log \
  remap_schema=SOURCE_SCHEMA:ONYX_READ \
  remap_tablespace=OLD_TS:ONYX_TS \
  exclude=USER,ROLE,GRANT
```

يجب تعديل أسماء الاتصال و`DIRECTORY` واسم الـSchema حسب بيئة Oracle الفعلية. لا يُنفذ هذا على الإنتاج، ولا يجب استيراد المستخدمين أو الأدوار أو الصلاحيات العامة دون مراجعة.

بعد الاستيراد، تكون الاستعلامات الحاسمة:

```sql
SELECT * FROM FORM_DETAIL ORDER BY SYS_NO, F_PARENT_NO, F_ORDER_NO, FORM_NO;
SELECT * FROM IAS_FORM_NAME ORDER BY FORM_NO, LANG_NO;
SELECT * FROM PRIVILEGE WHERE U_ID = :USER_ID ORDER BY F_ORDER_NO, FORM_NO;
SELECT * FROM IAS_FRM_FLD_PRIV WHERE U_ID = :USER_ID ORDER BY FORM_NO, TAB_NAME, FLD_NAME;
SELECT * FROM IAS_USR_LGN_HSTRY WHERE U_ID = :USER_ID ORDER BY HSTRY_NO;
```

ثم تُصدر النتائج إلى ملفات منقحة وتُدمج مع `window_catalog.csv` و`form_field_trigger_catalog.jsonl` و`window_runtime_contracts.jsonl`.

## الخلاصة

القاعدة المرفقة غيّرت مستوى الفهم جذريًا. لم نعد نعتمد على مؤشرات FMX/PLX فقط؛ أصبح لدينا نموذج قاعدة حقيقي يثبت أن:

```text
FORM_DETAIL = عقد الشجرة وعلاقات الأب/الابن
IAS_FORM_NAME = أسماء الشاشات حسب اللغة
PRIVILEGE = صلاحيات الشاشة والعمليات
IAS_FRM_FLD_PRIV = صلاحيات الحقول
IAS_USR_PKG = التحقق من المستخدم والصلاحيات
YS_SCR_PKG = قراءة اسم الشاشة والأب والنظام والنوع
IAS_USR_LGN_HSTRY = سجل الدخول والخروج
USER_R = المستخدم والجلسة والإعدادات
```

وبذلك يمكن الآن ربط نافذة `ERP_LOGIN` وكتالوجات Forms مع قاعدة البيانات على مستوى الكيانات والحقول والحزم. للحصول على **الشجرة الكاملة وجميع القيم الفعلية**، يلزم فقط استيراد الـdump في Oracle Test Schema، وليس إرسال قاعدة الإنتاج أو كلمات مرورها.
