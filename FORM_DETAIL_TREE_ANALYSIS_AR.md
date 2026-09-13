# تحليل تفصيلي لشجرة النظام من النصوص المستخرجة

## النطاق ومصدر البيانات

تم تحليل الملفات النصية الناتجة من قراءة Oracle dump:

```text
form_detail_data.csv
ias_form_name_data.csv
system_tree_nodes.csv
```

التحليل الحالي يعتمد فقط على أوامر `INSERT` المكتملة وغير المعلّقة التي ظهرت كنص واضح داخل الـdump. لذلك فهو **تحليل مؤكد للجزء النصي القابل للقراءة**، وليس ادعاءً بأن هذه كل صفوف جدول `FORM_DETAIL`؛ فجزء من بيانات Data Pump مخزن ثنائيًا.

## الإحصاءات

| المؤشر | النتيجة |
|---|---:|
| صفوف `FORM_DETAIL` المستخرجة نصيًا | 39 |
| أرقام Forms مميزة | 39 |
| صفوف `IAS_FORM_NAME` المستخرجة | 686 |
| أرقام Forms التي لها اسم واحد على الأقل | 578 |
| اللغة 2 | 257 اسمًا |
| اللغة 3 | 429 اسمًا |
| أنظمة `SYS_NO` الظاهرة | 4 |
| روابط Form إلى كتالوج Onyx | 31 من 39 |
| Forms بلا اسم مستخرج | 3 |
| Forms بلا تطابق في كتالوج Onyx | 8 |
| صفوف مكررة لنفس Form واللغة | 0 |

## نموذج البيانات المؤكد

### `FORM_DETAIL`

```text
F_SYS          المجال أو النظام المختصر
SYS_NO         رقم النظام
FORM_NO        رقم الشاشة
F_PARENT_NO    رقم الشاشة الأب
F_FILE_NAME    اسم ملف الـForm
F_BT_PRIV      هل للشاشة صلاحية على مستوى الزر/العنصر
F_INACTIVE     هل الشاشة غير فعالة
F_ORDER_NO     ترتيب العرض
SCR_ORGNL      الشاشة الأصلية أو المرجعية
SCR_THEME_NO   المظهر أو النمط
SCR_TYP        نوع الشاشة
DOC_TYP        نوع المستند
```

### `IAS_FORM_NAME`

```text
LANG_NO
FORM_NO
FORM_NAME
```

العلاقة الأساسية هي:

```text
FORM_DETAIL.FORM_NO = IAS_FORM_NAME.FORM_NO
```

وتُستخدم `LANG_NO` لاختيار اسم الشاشة حسب اللغة.

## الأنظمة الظاهرة في الجزء المستخرج

| `SYS_NO` | `F_SYS` | عدد العقد | النشطة | غير النشطة | لها اسم | لها ملف Form |
|---:|---|---:|---:|---:|---:|---:|
| 60 | ARS | 18 | 0 | 18 | 15 | 18 |
| 61 | SAL | 2 | 0 | 2 | 2 | 2 |
| 35 | BGT | 1 | 1 | 0 | 1 | 1 |
| 185 | STN | 18 | 18 | 0 | 18 | 4 |

### ملاحظة مهمة

الجزء المستخرج يبين أن عقد ARS وSAL الظاهرة كلها `F_INACTIVE=1`، بينما عقد BGT وSTN الظاهرة فعالة. لا يجوز تعميم هذه النتيجة على كامل النظام قبل استيراد الـdump، لأنها ناتجة عن الصفوف النصية المتاحة فقط.

## العلاقات الهرمية المستخرجة

### مجموعة ARS — `SYS_NO=60`

```text
64
├── 820  ARSS011  Return Sales Request Types
├── 823  COMS001  Commission Customer Encoding
├── 824  COMS002  Commission SalesMan Encoding
├── 826  COMS003  Commission Collectors Encoding
└── 827  COMS004  الاسم غير ظاهر في النص المستخرج

138
├── 813  ARSI018  Medical Network Details
├── 814  ARSI019  The Beneficiaries Of The Insurance
├── 815  ARSI020  Insurance Company Details
└── 816  ARSI021  Insurance Details For Joint

139
├── 817  ARST021  Insurances Company Claim
├── 828  COMT001  Commission Customer Calculation
├── 829  COMT002  Commission SalesMan Calculation
├── 830  COMT003  Commission Collectors Calculation
└── 831  COMT004  الاسم غير ظاهر في النص المستخرج

140
├── 832  COMR001  Commission Customer Reports
├── 833  COMR002  Commission SalesMan Reports
├── 834  COMR003  Commission Collectors Reports
└── 835  COMR004  الاسم غير ظاهر في النص المستخرج
```

### مجموعة SAL — `SYS_NO=61`

```text
345
└── 821  ARST023  Sale Return Requst

346
└── 822  ARSR023  Sales Return Order Invoice
```

وتظهر هنا علاقة عملية واضحة بين طلب مردودات البيع (`ARST023`) وفاتورة مردودات البيع (`ARSR023`) من خلال البنية الهرمية ومسميات Forms.

### مجموعة BGT — `SYS_NO=35`

```text
75
└── 465  BGTR004  Budget Approvel Reports
```

### مجموعة STN — `SYS_NO=185`

```text
360  Oil Stations System
├── 1600  Configuration
│   ├── 1602  STNS002  Periods Setup
│   ├── 1603  STNS003  Fuel Types
│   └── 1604  STNS004  Counters Setup
├── 1650  Inputs
│   └── 1651  STNI001  Coupon Details
├── 1700  Operations
│   ├── 1701  STNT001  Exchange Credit Card Bills
│   ├── 1702  STNT002  Coupon Sales
│   ├── 1703  STNT003  Employee Sales
│   └── 1704  STNT004  Post To Onyx System
└── 1750  Reports
    ├── 1751  STNR001  Counters Reports
    ├── 1752  STNR002  Coupon Reports
    ├── 1753  STNR003  Exchange Credit Card Bills Reports
    ├── 1754  STNR004  Coupon Sales Reports
    └── 1755  STNR005  Employee Sales Reports
```

هذه المجموعة هي أوضح جزء هرمي مستخرج؛ فيها عقد جذرية وطبقات إعدادات ومدخلات وعمليات وتقارير، كما أن أسماء الـForms متطابقة مع كتالوج Onyx في معظم الحالات.

## تحليل الحقول التشغيلية

### `F_PARENT_NO`

يمثل الأب المباشر، وليس رقم النظام. مثلًا:

```text
FORM_NO 1600 → PARENT 360
FORM_NO 1601 → PARENT 1600
FORM_NO 1602 → PARENT 1601
```

وهذا يثبت أن بناء الشجرة يتم بتكرار العلاقة:

```text
CONNECT BY PRIOR FORM_NO = F_PARENT_NO
```

أو ما يعادلها برمجيًا في `YS_SCR_PKG` و`ERP_LOGIN`.

### `F_ORDER_NO`

يستخدم لترتيب الإخوة تحت الأب. في مجموعة STN، الترتيب يطابق البنية المنطقية تقريبًا:

```text
Configuration → 1601
Inputs        → 1650
Operations    → 1700
Reports       → 1700
```

توجد ملاحظة يجب مراجعتها: عقدة `1750 Reports` لها `F_ORDER_NO=1700` مثل `Operations`، وهو قد يكون مقصودًا أو خطأ في بيانات النظام القديم.

### `F_INACTIVE`

القيمة `1` تعني أن العقدة غير فعالة، والقيمة `0` تعني فعالة في السجلات الظاهرة. هذا الحقل يجب أن يدخل في بناء شجرة المستخدم؛ فالعقدة غير الفعالة لا ينبغي فتحها حتى لو كانت لها صلاحية.

### `F_BT_PRIV`

القيمة `1` تظهر في العقد التي لها حماية على مستوى الأزرار أو العناصر، بينما القيمة `0` تظهر في بعض العقد التجميعية أو التقارير. لا تعني هذه القيمة وحدها أن المستخدم يملك الصلاحية؛ بل تحدد أن الشاشة تحتاج طبقة صلاحيات إضافية.

### `SCR_TYP`

القيم الظاهرة:

| القيمة | العدد |
|---:|---:|
| 0 | 5 |
| 1 | 16 |
| 2 | 5 |
| 3 | 5 |
| 4 | 8 |

المعنى الوظيفي الدقيق لكل رقم يحتاج مطابقة مع Forms أو كود `YS_SCR_PKG`، لكن القيم ترتبط عمليًا بعقد الإدخال والعمليات والتقارير في البيانات الظاهرة.

### `DOC_TYP`

ظهر في بعض العقد، مثل:

```text
ARST023 → DOC_TYP 136
```

هذا يربط عقدة الشاشة بنوع مستند، ويمكن استخدامه لاستدعاء الشاشة المناسبة عبر:

```text
YS_SCR_PKG.GET_SCR_NO(DOC_TYP)
```

## ربط الشجرة بكتالوج Onyx

تمت مطابقة أسماء `F_FILE_NAME` مع الحقل `file` في `rebuild/docs/window_catalog.csv` بعد إضافة `.fmx`.

النتيجة:

- **31 Form** لها سجل مطابق في كتالوج Onyx.
- **8 Forms** لم يظهر لها تطابق في الكتالوج الحالي.
- بعض Forms بلا اسم عربي/إنجليزي مستخرج، لكن لها ملف معروف وكتالوج مطابق.

أمثلة على التطابق:

```text
COMS001 → COMS001.fmx
COMS002 → COMS002.fmx
COMT001 → COMT001.fmx
COMR001 → COMR001.fmx
ARSI018 → ARSI018.fmx
ARST023 → ARST023.fmx
ARSR023 → ARSR023.fmx
STNS002 → STNS002.fmx
STNT004 → STNT004.fmx
STNR005 → STNR005.fmx
```

## ما يمكن استنتاجه عن آلية `ERP_LOGIN`

التدفق المرجح والمؤيد بتصميم الجداول والحزم هو:

```text
تسجيل الدخول
  ↓
IAS_USR_PKG.CHK_USR
  ↓
تحديد U_ID وLANG_NO وCMP_NO وBRN_NO وBRN_YEAR
  ↓
قراءة FORM_DETAIL
  ↓
تصفية F_INACTIVE
  ↓
تصفية PRIVILEGE حسب U_ID وFORM_NO
  ↓
إضافة العقد الأب اللازمة للوصول إلى الأبناء
  ↓
ترجمة FORM_NAME من IAS_FORM_NAME
  ↓
ترتيب الإخوة بواسطة F_ORDER_NO
  ↓
فتح F_FILE_NAME عند اختيار العقدة
  ↓
تطبيق IAS_FRM_FLD_PRIV وS_USR_TP_PRV على العناصر
```

وهذا يفسر المؤشرات التي ظهرت سابقًا في `ERP_LOGIN`:

```text
LOAD_TREE_PRC
FIND_IN_TREE_PRC
FILL_OBJ_CALL_PRC
CALL_OBJ_PRC
REFRESH_DATA_PRC
YS_SCR_PKG.GET_SCR_PARENT_NO
YS_SCR_PKG.GET_SCR_SYS_NO
```

## المشكلات والبيانات الناقصة

1. السجلات النصية الكاملة لـ`FORM_DETAIL` المتاحة حاليًا هي 39 فقط، ولذلك لا تظهر الجذور العامة لكل الأنظمة.
2. يوجد 686 اسم شاشة، لكن 578 رقم Form فقط مميز؛ وهذا يعني أن كثيرًا من الأسماء لا يقابله `FORM_DETAIL` ظاهر في الجزء النصي.
3. اللغات الظاهرة هي `2` و`3`، ويجب استخراج قاموس اللغة من جدول إعدادات النظام قبل تسميتهما عربيًا أو إنجليزيًا.
4. ثلاثة Forms من السجلات الظاهرة ليس لها اسم نصي: `827` و`831` و`835`.
5. بعض العقد التجميعية لا تحتوي على `F_FILE_NAME`، وهذا متوقع إذا كانت مجلدات فقط.
6. `F_ORDER_NO` مكرر بين بعض العقد، ويجب اعتماد كاسر تعادل مثل `FORM_NO`.
7. لا يمكن تحديد الشجرة المخصصة لمستخدم بعينه دون استخراج `PRIVILEGE` وبيانات المستخدم من القاعدة المستوردة.

## الملفات الناتجة

- [العقد الموسعة بالأسماء](database_analysis/tree_analysis/nodes_enriched.csv)
- [ملخص الأنظمة](database_analysis/tree_analysis/system_summary.csv)
- [تقرير الأبناء والعلاقات](database_analysis/tree_analysis/parent_child_report.md)
- [كل أسماء الشاشات حسب اللغة](database_analysis/tree_analysis/screen_names_by_language.csv)
- [ربط العقد بكتالوج Onyx](database_analysis/tree_analysis/nodes_catalog_links.csv)
- [إحصاءات التحليل](database_analysis/tree_analysis/stats.json)

## الخلاصة

تمكنت الملفات النصية من إثبات نموذج شجرة النظام بدقة على مستوى **البنية والحقول والعلاقات**:

```text
FORM_DETAIL.FORM_NO       = العقدة
FORM_DETAIL.F_PARENT_NO   = الأب
FORM_DETAIL.F_FILE_NAME   = الـForm المفتوح
FORM_DETAIL.SYS_NO        = النظام
FORM_DETAIL.F_ORDER_NO    = ترتيب العرض
IAS_FORM_NAME.FORM_NAME   = الاسم حسب اللغة
PRIVILEGE                 = صلاحيات المستخدم على العقدة
```

أوضح هيكل مكتمل حاليًا هو نظام محطات الوقود `STN`، بينما بيانات ARS وSAL وBGT المتاحة هي أجزاء فرعية. وللحصول على الشجرة الكاملة لكل أنظمة Onyx، يجب استيراد الـdump في Oracle Test Schema واستخراج جميع صفوف `FORM_DETAIL` و`IAS_FORM_NAME`، ثم إعادة تشغيل نفس التحليل على البيانات الكاملة.
