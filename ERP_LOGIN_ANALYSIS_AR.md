# تحليل نافذة `ERP_LOGIN`

## النطاق والحكم الفني

تم تحليل جميع النسخ الموجودة في مستودع `aldalistor/onex`:

- `ERP_LOGIN.fmx`
- `ERP_LOGIN - Copy.fmx`
- `ERP_LOGIN_TST.fmx`

**الحكم:** لا توجد ملفات `FMB` أو `PLL` أو `PKS/PKB` أصلية للنافذة داخل المستودع. المعلومات التالية هي أدلة مستخرجة من ملفات FMX/PLX المجمعة وكتالوجات منقحة، إضافة إلى ملفات PL/SQL وForms مولدة وموسومة بوضوح بأنها `SCAFFOLD_ONLY`. لذلك لا يجوز اعتبار الملفات المولدة استعادة للكود الأصلي أو نشرها على قاعدة الإنتاج.

## بطاقة النافذة

| العنصر | ERP_LOGIN | ERP_LOGIN_TST |
|---|---:|---:|
| المجال | other | other |
| حجم FMX المفهرس | 19,840,676 bytes | 19,832,996 bytes |
| السلاسل المستخرجة | 2,281 | 2,295 |
| مؤشرات SQL | 104 | 104 |
| مؤشرات الإجراءات/الدوال | 26 | 27 |
| مؤشرات Triggers | 5 | 5 |
| المكتبات | 11 | 11 |
| Forms مرتبطة | 7 | 7 |
| مؤشرات الجداول/الكائنات | 244 | 261 |
| مخاطر مرصودة | credentials, ddl_privilege, destructive, windows_native, session_control | نفس المخاطر + network |
| حالة المصدر | FMB/PLL not found | FMB/PLL not found |
| حالة الاعتماد | NOT_READY_FOR_PRODUCTION | NOT_READY_FOR_PRODUCTION |

## الوظيفة المستنتجة من الأدلة

النافذة ليست نافذة محاسبية أو مخزنية مباشرة؛ هي نافذة دخول وتحكم بالجلسة، وتبدو مرتبطة بتحميل شجرة النظام وقائمة الوحدات والصلاحيات بعد تسجيل الدخول. المؤشرات الموجودة تشمل:

- التحقق من المستخدم وكلمة المرور.
- فك/تشفير أو التعامل مع بيانات اعتماد النظام.
- التحقق من حالة المستخدم وصلاحياته.
- التحقق من الجهاز/الجلسة/المحطة.
- التحقق من الكائنات أو إصدار النظام.
- تسجيل تاريخ الدخول.
- تحميل شجرة أو قائمة النوافذ.
- تغيير كلمة المرور عند الحاجة.
- استدعاء كائنات أو نوافذ النظام.
- الخروج من النافذة وإنهاء الجلسة.

هذه الوظائف **استنتاج من أسماء المؤشرات والسلاسل** وليست تنفيذًا مؤكدًا للكود الأصلي حتى يتم توفير FMB وPKS/PKB وDDL وقاعدة اختبارية.

## الإجراءات والحزم ذات الصلة

تظهر في كتالوج `ERP_LOGIN_TST` مؤشرات الإجراءات/الحزم التالية، مع اختلافات طفيفة بين النسخة الأساسية ونسخة الاختبار:

```text
ACTIVE_CODE_PRC
CALL_OBJCT_PKG
CALL_OBJ_PRC
COMM_PKG
EXIT_PRC
FILL_OBJ_CALL_PRC
FIND_IN_TREE_PRC
GEN_PKG
IAS_DBS_SYS_PKG
IAS_DBS_SYS_PKGIAS20142ALTR_DBSI
IAS_DBS_SYS_PKGIAS20142CHECK_OBJECTI
IAS_DBS_SYS_PKGIAS20142CHECK_ST_OBJI
IAS_ENCDEC_PKG
IAS_ENCDEC_PKGIAS_SYS
IAS_ENCDEC_PKGIAS_SYSIAS_CALL_ENC_DATAIA
IAS_ENCDEC_PKGIAS_SYSIAS_GET_DEC_DATAIAS
IAS_ENCDEC_PKGIAS_SYSIAS_RAW_DEC
IAS_GEN_PKG
IAS_GEN_PKGIAS20142GET_CURDATEIA
IAS_GEN_PKGIAS20142GET_FLD_VALUE
IAS_GEN_PKGIAS20142GET_MSGIA
IAS_GEN_PKGIAS20142GET_PROMPTIA
IAS_GEN_PKGIAS20142GET_USR_NMIAS
IAS_GET_ENC_PASS_FNC
IAS_GET_ENC_PASS_FNCIAS20142IAS_GET_ENC_PASS_FNC
IAS_USR_PKG
IAS_USR_PKGIAS20142CHK_USR_FRM_PRVIA
IAS_USR_PKGIAS20142GET_USR_APPRV
IAS_USR_PKGIAS20142GET_USR_NMIAS
INSRT_INTO_LGN_HSTY_PRC
LNG_LOGIN_PRC
LOAD_TREE_PRC
REFRESH_DATA_PRC
SETUP_PKG
SET_DIR_PRC
TRAC_PKG
TRAC_PKGIAS20142SET_USRT
YS_GEN_PKG
YS_GEN_PKGIAS20142CHK_ACTV_SYSTEMYS_
YS_GEN_PKGIAS20142GET_PROMPT
YS_GEN_PKGIAS20142GET_USR_FLD_PRVYS_
YS_SCR_PKG
YS_SCR_PKGIAS20142GET_SCR_PARENT_NOY
YS_SCR_PKGIAS20142GET_SCR_SYS_NO
```

> القائمة أعلاه تجمع مؤشرات الأسماء الموجودة في سجل النافذة، ولا تعني أن كل اسم يمثل Package مستقلًا أو أن توقيعه الأصلي معروف. بعض الأسماء ناتجة عن دمج اسم الحزمة مع اسم الإجراء أثناء استخراج FMX.

## الحقول والسلاسل المهمة

من المؤشرات المستخرجة تظهر عناصر مرتبطة مباشرة بالدخول والصلاحيات والجلسة، منها:

```text
USER / USR / USRNM / USRCRED
PWD / V_PWD / L_PWD / N PWD indicators
ALTER_PASS
CHNG_PASSWD
CHNG_PASSWD_AFTR_LGN
V_CHNG_PASSWD_AFTR_LGN
V_USER_PRIV
V_USR_TYPE
BRN_USR / V_BRNUSR
V_CMP / V_CMP_NO
V_TRMNL_LGN / V_TRMNL_NM
V_CONN_DTR_TRMNL
V_CONN_NOT_MOR_ONE
V_OSUSER
CLIENTNAME
SYSTEM
SYS_NO
LANG / V_LANG
LOGIN / IASLOGIN
LOGIN_ALERT
ERR_PWD_CNT
```

الأسماء أعلاه مؤشرات مستخرجة وليست بالضرورة أسماء Items نهائية في FMB؛ يجب تأكيدها من ملف المصدر أو من لقطة تشغيلية موثقة.

## الاعتماديات والملحقات

### مكتبات أمنية وتشغيلية مرصودة

تظهر مكتبة `IASLIBSEC.plx` مؤشرات مهمة مرتبطة بالنافذة، منها:

```text
CHECK_EXE
CHK_CRC_MD5
PARAMETER.CRC
CALL_LOGON_SCREEN
ERP_LOGIN
GET_PROMPT
SHOW_MY_ERROR
LOGIN_ALERT
IASLOGIN
REINFORCE_SEC
REGISTER_SESSION_VALS
DBMS_APPLICATION_INFO
SET_MODULE
```

كما تظهر مؤشرات إلى:

```text
D2KWUTIL
YSERP_LIB
YSERP_MNU
WIN_API
WIN_API_ENVIRONMENT
WIN_API_UTILITY
YS_DONGLE_PKG
```

### Forms مرتبطة

الكتالوج يسجل **7 Forms مرتبطة**، لكن أسماء الارتباطات التفصيلية تحتاج قراءة مباشرة من FMB/قائمة تشغيل أو استخراج أكثر دقة من المصدر. الارتباطات المؤكدة في تقرير الربط تشمل:

```text
othr004.fmx
othr005.fmx
```

وهما مذكوران كـForms موجودة ومرتبطة بكل من:

```text
ERP_LOGIN.fmx
ERP_LOGIN - Copy.fmx
ERP_LOGIN_TST.fmx
```

### كائنات وجداول ومؤشرات SQL

يوجد **104 مؤشر SQL** و**244 مؤشر جدول/كائن** في النسخة الأساسية، و**261** في نسخة الاختبار. من الأسماء المهمة التي تظهر في الأدلة:

```text
V$SESSION
DBA_TABLESPACES
DBA_TAB_COLS
IASLIBSEC
IASLOGIN
ERP_LOGIN
IAS_SYS / IAS_USR-related indicators
LOGIN history indicators
SYSTEM / security / privilege indicators
```

لا يجوز إنشاء DDL بناءً على هذه الأسماء وحدها. يجب استخراج `ALL_TAB_COLUMNS` و`ALL_ARGUMENTS` و`DBA_DEPENDENCIES` من قاعدة Oracle اختبارية أو الحصول على DDL الأصلي.

## الكود المرفق في المستودع

### 1. مواصفة إعادة البناء

[ERP_LOGIN.rebuild.md](rebuild/rebuild_source/forms/all_window_specs/ERP_LOGIN.rebuild.md)

[ERP_LOGIN_TST.rebuild.md](rebuild/rebuild_source/forms/all_window_specs/ERP_LOGIN_TST.rebuild.md)

[ERP_LOGIN - Copy.rebuild.md](rebuild/rebuild_source/forms/all_window_specs/ERP_LOGIN%20-%20Copy.rebuild.md)

### 2. Package Specification مولد

[ERP_LOGIN.pks.sql](rebuild/rebuild_source/generated_code/plsql_specs/ERP_LOGIN.pks.sql)

[ERP_LOGIN_TST.pks.sql](rebuild/rebuild_source/generated_code/plsql_specs/ERP_LOGIN_TST.pks.sql)

[ERP_LOGIN - Copy.pks.sql](rebuild/rebuild_source/generated_code/plsql_specs/ERP_LOGIN%20-%20Copy.pks.sql)

الـWrapper المولد يعرّف إجراءات عامة مثل:

```text
initialize
validate_before_save
save_document
update_document
delete_document
post_document
reverse_document
print_document
is_valid
status
```

هذه واجهة عامة مولدة آليًا وليست توقيعات الحزم الأصلية لنافذة الدخول.

### 3. Package Body مولد

[ERP_LOGIN.pkb.sql](rebuild/rebuild_source/generated_code/plsql_bodies/ERP_LOGIN.pkb.sql)

[ERP_LOGIN_TST.pkb.sql](rebuild/rebuild_source/generated_code/plsql_bodies/ERP_LOGIN_TST.pkb.sql)

[ERP_LOGIN - Copy.pkb.sql](rebuild/rebuild_source/generated_code/plsql_bodies/ERP_LOGIN%20-%20Copy.pkb.sql)

الـBody الحالي يغيّر حالة داخلية مثل `READY` و`SAVED` و`POST_REQUESTED`، لكنه لا ينفذ المصادقة أو قراءة المستخدم أو تحميل الشجرة فعلًا. يحتوي على `TODO` صريحة، ولذلك هو Scaffold فقط.

### 4. Forms Triggers مولدة

[ERP_LOGIN.triggers.sql](rebuild/rebuild_source/generated_code/forms_triggers/ERP_LOGIN.triggers.sql)

[ERP_LOGIN_TST.triggers.sql](rebuild/rebuild_source/generated_code/forms_triggers/ERP_LOGIN_TST.triggers.sql)

[ERP_LOGIN - Copy.triggers.sql](rebuild/rebuild_source/generated_code/forms_triggers/ERP_LOGIN%20-%20Copy.triggers.sql)

هذه الملفات تقترح Triggers مثل `PRE-FORM` و`WHEN-NEW-FORM-INSTANCE` و`KEY-COMMIT` و`KEY-EXIT` و`WHEN-VALIDATE-RECORD` وأزرار الحفظ والترحيل والعكس والطباعة. لكنها لا تثبت أن هذه هي Triggers الأصلية للنافذة، وتحتاج مطابقة مع FMB.

## الحوادث التشغيلية المسجلة

سجل التشغيل المنقح يحتوي على حادثتين على الأقل مرتبطة بالنافذة:

```text
FORM/BLOCK/FIELD: ERP_LOGIN:LOGIN.CLOSE
Last Trigger: WHEN-BUTTON-PRESSED - (Execution Suspended)
Last Builtin: EXIT_FORM - (Successfully Completed)
```

هذا يشير إلى وجود مسار خروج/إغلاق يستحق اختبارًا خاصًا، خصوصًا مع وجود خطر `windows_native` ومؤشرات `EXIT_FORM` و`CALL`.

## المخاطر الأمنية والتشغيلية

هذه النافذة حساسة جدًا لأنها تتعامل مع الدخول والصلاحيات:

1. **Credentials:** توجد مؤشرات كلمات مرور وتشفير/فك تشفير. يجب عدم نقل كلمات المرور الخام أو حفظها قابلًة للاسترجاع.
2. **Privilege/DDL:** توجد مؤشرات `DBA_*` وعمليات فحص كائنات/صلاحيات؛ يجب فصل حساب التشغيل عن حساب DBA.
3. **Session control:** توجد مؤشرات تسجيل الجلسة، الجهاز، المحطة، و`V$SESSION`.
4. **Destructive:** توجد مؤشرات حذف/تعديل أو أوامر على كائنات؛ يجب منع أي DDL من واجهة الدخول.
5. **Windows native/network:** يظهر خطر استدعاء مكونات Windows، وفي نسخة `ERP_LOGIN_TST` يظهر خطر الشبكة.
6. **License/security checks:** توجد مؤشرات `CHK_CRC_MD5` و`YS_DONGLE_PKG` و`REINFORCE_SEC`، ويجب عدم تجاوزها أو استبدالها قبل توثيق وظيفتها وملكيتها.

## ما يلزم لإحضار الكود الأصلي فعليًا

لتحويل هذا التحليل إلى تنفيذ موثوق، يلزم الحصول على:

```text
ERP_LOGIN.fmb
ERP_LOGIN_TST.fmb
ERP_LOGIN - Copy.fmb
PLLs المرتبطة، خصوصًا IASLIBSEC وYSERP_LIB وYSERP_MNU
PKS/PKB للحزم IAS_USR_PKG وIAS_ENCDEC_PKG وIAS_DBS_SYS_PKG وYS_SCR_PKG
DDL والجداول وViews الخاصة بالمستخدمين والجلسات وسجل الدخول
تعريفات LOV وRecord Groups وCanvas/Blocks/Items
صلاحيات Oracle وحسابات التشغيل
إصدار Forms Builder وOracle Database
```

## خطة التحقق الآمنة

1. تشغيل النسخة القديمة في بيئة اختبار مع بيانات وهمية.
2. تسجيل مسار دخول ناجح وفاشل، كلمة مرور خاطئة، مستخدم موقوف، تغيير كلمة المرور، اختلاف الشركة/الفرع، تكرار الجلسة، والخروج.
3. التقاط `DBMS_SESSION` و`DBMS_APPLICATION_INFO` وSQL Audit بدل تسجيل كلمات المرور.
4. استخراج توقيعات الحزم من `ALL_ARGUMENTS` وتبعياتها من `DBA_DEPENDENCIES`.
5. مطابقة كل Trigger وItem مع FMB.
6. بناء API مصادقة حديثة تستعمل Hash آمنًا لكلمات المرور، جلسات منتهية الصلاحية، وLeast Privilege.
7. عدم اعتماد أي ملف مولد قبل Golden Master مقارنة مع النظام القديم.

## الخلاصة

المستودع يوفر **خريطة قوية لنافذة الدخول**: 2,281 سلسلة، 104 مؤشرات SQL، 26 مؤشر إجراء، 5 Triggers، 11 مكتبة، 7 Forms مرتبطة، و244 مؤشر كائن في النسخة الأساسية. لكنه لا يحتوي على الكود الأصلي القابل لإعادة البناء. أهم الاعتماديات الظاهرة هي حزم المستخدمين والتشفير والنظام والجلسات، ومكتبات `IASLIBSEC` و`YSERP_LIB` و`YSERP_MNU`، مع ارتباطات مؤكدة بـ`othr004.fmx` و`othr005.fmx`.

**الخطوة الصحيحة التالية:** لا تبدأ بتنفيذ الـScaffold الحالي. احصل أولًا على FMB وPLL وPKS/PKB وDDL، ثم ابنِ اختبار دخول معزولًا يثبت المصادقة والصلاحيات والجلسة والخروج قبل ربط النافذة ببقية ERP.
