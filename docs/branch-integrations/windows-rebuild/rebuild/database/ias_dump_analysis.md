# تقرير فحص ملف `ias.dmp`

**التاريخ:** 11 سبتمبر 2026  
**النطاق:** فحص ثنائي آمن وربط أولي مع نظام Oracle Forms/ERP السابق  
**لم يتم:** تشغيل الملف أو استيراده أو الاتصال بقاعدة بيانات

## الخلاصة

الملف `ias.dmp` هو **Oracle Legacy Export** بصيغة يظهر رأسها `EXPORT:V11.01.00`، وليس ملف Data Pump حديثًا يمكن تشغيله مباشرة عبر `impdp`. حجمه **641,024 بايت** فقط، وبصمته SHA-256 هي:

```text
6b62053cf320ec2e6a1956ced842005f7b53af0442941d00dcae89ef2f8be89f
```

يظهر في الرأس مؤشر قاعدة/مستخدم باسم `DIAS_SYS`، ومؤشر تصدير شامل أو نمط تصدير قديم. كما تظهر مسارات ملفات Oracle على Windows وقائمة كبيرة من Tablespaces وأدوار Oracle النظامية.

**الاستنتاج الأولي:** الملف يبدو أقرب إلى **تصدير Metadata/تعريفات نظام Oracle وتهيئة** منه إلى نسخة كاملة من بيانات تطبيق IAS. لم تظهر في المؤشرات النصية أسماء جداول تطبيقية واضحة مثل `IAS_BILL_MST` أو `IAS_BILL_DTL` أو `IAS_POS_BILL_MST`. لا يمكن الجزم بعدم وجود بيانات مضغوطة أو أجزاء غير قابلة للاستخراج دون أداة Oracle `imp` متوافقة أو بيئة Oracle اختبارية.

## المؤشرات المستخرجة

| المؤشر | النتيجة |
|---|---:|
| الحجم | 641,024 بايت |
| السلاسل القابلة للقراءة الفريدة تقريبًا | 6,170 |
| مستخدمو Oracle ظاهرون | 36 |
| أدوار Oracle ظاهرة | 46 |
| Tablespaces ظاهرة | 126–128 حسب تكرار تعاريف الإنشاء |
| أوامر إنشاء Sequence الظاهرة | 193 تقريبًا |
| أوامر إنشاء Tables غير Tablespace | 14 مؤشرا نصيًا |
| أنواع Oracle الظاهرة | 740 تقريبًا |
| أجسام Type ظاهرة | 1 على الأقل |
| Packages تطبيقية قابلة للإثبات | لم يظهر تعريف مباشر |
| Forms/PLX تطبيقية قابلة للإثبات | لم يظهر تعريف مباشر |

الأعداد الأخيرة هي أعداد مؤشرات نصية داخل ملف Binary Export، وليست عدد كائنات يمكن اعتمادها بدل قاموس قاعدة البيانات. بعض الأسطر تتكرر أو تمثل صلاحيات النظام أو أنواع Oracle الداخلية.

## المستخدمون والمخططات الظاهرة

تظهر أسماء مثل:

- `IAS_SYS`.
- `YSPOS1`.
- `IAS20101`, `IAS20111`, `IAS20121`, `IAS20122`, `IAS20131`, `IAS20141`, `IAS20171`, `IAS20241`, `IAS20252`, و`IAS20271`.
- مستخدمو Oracle الافتراضيون مثل `SYS`, `SYSTEM`, `SCOTT`, `HR`, `OE`, `SH`, `APEX_PUBLIC_USER`, `SYSMAN`, و`WKSYS`.

قد تكون أسماء `IAS20xxx` نسخ شركات أو سنوات أو مخططات تشغيلية، لكن لا يجوز اعتبارها جداول أو بيانات AR دون فحص Metadata الفعلية عبر `DBA_OBJECTS`, `DBA_TABLES`, و`DBA_TAB_COLUMNS` في بيئة استعادة.

## Tablespaces وربطها بالنظام

يظهر تقسيم تخزين واسع متوافق مع النظام الذي ظهر في Forms وLib:

| المجال | Tablespaces الظاهرة |
|---|---|
| النظام والإدارة | `IAS_SYS_DATA`, `IAS_SYS_INDX`, `IAS_ADM_DATA`, `IAS_ADM_INDX`, `IAS_GEN`, `IAS_INX_GEN` |
| الأستاذ العام | `IAS_GL_INPT`, `IAS_GL_DATA_TRNS`, `IAS_GL_INX_TRNS`, `IAS_DATA_JV`, `IAS_INX_JV` |
| الذمم المدينة | `IAS_AR_INPT`, `IAS_AR_DATA_TRNS`, `IAS_AR_INX_TRNS` |
| الذمم الدائنة | `IAS_AP_INPT`, `IAS_AP_DATA_TRNS`, `IAS_AP_INX_TRNS` |
| المخزون | `IAS_INV_INPT`, `IAS_INV_DATA_TRNS`, `IAS_INV_INX_TRNS`, `IAS_ITMSER_TRNS` |
| الفواتير | `IAS_DATA_BILLS`, `IAS_INX_BILLS`, `IAS_DATA_PI`, `IAS_INX_PI`, `IAS_DATA_RTBI`, `IAS_INX_RTBI` |
| POS | `IAS_POS_INPT`, `IAS_DATA_POS`, `IAS_INX_POS`, `IAS_DATA_POS_HISTORY`, `IAS_INX_POS_HISTORY` |
| التدقيق | `IAS_DATA_AUDIT`, `IAS_INX_AUDIT`, `IAS_DATA_AUD_SYS`, `IAS_INX_AUD_SYS` |
| الأرشيف والتاريخ | `IAS_ARCHV`, `IAS_DATA_HISTORY`, `IAS_INX_HISTORY` |
| التصنيع والتخطيط | `MRP_INPUT`, `MRP_DATA_TRNS`, `MRP_INDX_TRNS`, `MRP_DATA_MOV`, `MRP_INDX_MOV` |
| الموارد البشرية | `HRS_INPT`, `HRS_DATA_TRNS`, `HRS_INDX_TRNS`, `HRS_STP` |
| الأصول والمالية | `FAS_INPUT`, `FAS_DATA_TRNS`, `FAS_INDX_TRNS`, `FAS_DATA_DEPR`, `FAS_INDX_DEPR` |

هذا التقسيم يطابق ما ظهر في `Forms.zip`: النظام يفصل بيانات AR وAP وGL والمخزون وPOS والتدقيق إلى مساحات تخزين مختلفة. وهو دليل معماري مهم عند تصميم خطة الاستعادة أو طبقة API، لكنه ليس دليلًا على وجود البيانات داخل هذا الملف بعينه.

## الأدوار والصلاحيات

يحتوي الملف على أدوار Oracle نظامية كثيرة، منها:

- `DATAPUMP_EXP_FULL_DATABASE` و`DATAPUMP_IMP_FULL_DATABASE`.
- `SELECT_CATALOG_ROLE` و`EXECUTE_CATALOG_ROLE`.
- `DELETE_CATALOG_ROLE`.
- `SCHEDULER_ADMIN`.
- `JAVA_ADMIN`, `JAVA_DEPLOY`, `JAVADEBUGPRIV`.
- `XDBADMIN` و`XDB_WEBSERVICES`.
- `OEM_ADVISOR` و`OEM_MONITOR`.
- `SPATIAL_CSW_ADMIN` و`SPATIAL_WFS_ADMIN`.

ظهور هذه الأدوار لا يثبت أن حساب تطبيق IAS يملكها، لكنه يثبت أن الملف يتضمن أجزاء من Metadata النظام أو تصديرًا شاملاً لمكونات Oracle. كما ظهرت صيغ `IDENTIFIED BY [REDACTED_SECRET]` لبعض الأدوار، وهي **قيم تجزئة اعتماد وليست كلمات مرور صريحة**، لكنها حساسة ويجب عدم نشرها.

## مسارات ملفات حساسة

يظهر في الملف ما يشبه:

- `C:\APP\1\ORADATA\MAXCELL2\...`.
- `C:\ORAYS\IAS_...ORA`.
- `C:\orant\...` في سياقات Oracle/Forms التاريخية.

هذه المسارات تكشف بنية جهاز وقاعدة بيانات قديمة، لذلك تم حجبها في التقرير المنقح. يجب عدم رفع الملف الأصلي إلى مستودع GitHub العام `onex`.

## الربط مع Forms وLib

### الربط مع النوافذ

- `ARST004` يستخدم جداول وحزمًا تدل على فواتير البيع والمخزون والـAR.
- `ARST006` يستخدم جداول مردود البيع وحركة الأصناف.
- `APST005` يستخدم فواتير الشراء وأوامر الشراء والاستلام.
- `POST001` يستخدم جداول POS والمدفوعات والفواتير المعلقة.
- `GLST001` و`GLST002` يستخدمان حزم الترحيل والربط مع المجالات.

### الربط مع Tablespaces

أسماء `IAS_AR_*`, `IAS_AP_*`, `IAS_GL_*`, `IAS_INV_*`, و`IAS_POS_*` في dump تتوافق مع فصل المجالات الذي يظهر من أسماء الجداول داخل Forms. لذلك يمكن استخدام dump كمرجع لتحديد طبقة التخزين عند بناء قاموس:

```text
Form
  → Package / Procedure
    → Table / View
      → Tablespace / Index Tablespace
        → Domain: AR/AP/GL/Inventory/POS
```

### ما لم يظهر

لم تظهر في الجزء القابل للقراءة تعريفات مباشرة قابلة للاعتماد لـ:

- `IAS_BILL_MST`.
- `IAS_BILL_DTL`.
- `IAS_PI_BILL_MST`.
- `IAS_POS_BILL_MST`.
- `IAS_POSTING_PKG`.
- `YSERP_LIB`.
- `YSPOS_LIB`.

هذا لا يعني أنها غير موجودة في قاعدة المصدر؛ بل يعني أن هذا الملف المحدود الحجم لا يعرضها كسلاسل ASCII متصلة أو أنه تصدير Metadata مختلف أو جزئي.

## لماذا لا يمكن استيراده الآن

لا توجد في البيئة الحالية أدوات Oracle `imp`, `impdp`, أو `sqlplus`. كما أن تشغيل `imp` يتطلب نسخة Oracle متوافقة مع صيغة `EXPORT:V11.01.00`، وقاعدة اختبار فارغة أو مخصصة، ومساحات Tablespace وملفات Datafile صحيحة.

يجب عدم تنفيذ استيراد مباشر، لأن dump يظهر أوامر إنشاء Tablespaces وامتيازات وأدوار ومسارات Datafile. الاستعادة الآمنة تكون داخل VM أو Oracle Docker/اختبار مع:

1. نسخة معزولة.
2. حساب غير إنتاجي.
3. تحويل مسارات Datafile إلى مساحة مؤقتة.
4. `FROMUSER/TOUSER` أو `REMAP_SCHEMA` بحسب الأداة.
5. عدم استيراد `SYS` و`SYSTEM` إلى قاعدة عمل.
6. فحص `SQLFILE` قبل التنفيذ إن كانت الأداة تدعم ذلك.
7. مراجعة DDL ثم استيراد Metadata/البيانات على مراحل.

## ما نحتاجه للخطوة التالية

للتأكد من أن dump يحتوي بيانات IAS الفعلية، نحتاج واحدًا من الآتي:

- تشغيل `imp` المتوافق على نسخة Oracle اختبارية.
- إخراج `imp SHOW=Y` أو ملف DDL ناتج من `imp`.
- نسخة `exp` أو `expdp` أكبر تحتوي مخططات `IAS_SYS` و`YSPOS1`.
- إخراج SQL آمن من:

```sql
SELECT owner, object_type, COUNT(*)
FROM dba_objects
WHERE owner IN ('IAS_SYS', 'YSPOS1')
GROUP BY owner, object_type;

SELECT owner, table_name, num_rows
FROM dba_tables
WHERE owner IN ('IAS_SYS', 'YSPOS1');
```

يجب إزالة قيم البيانات وأي Hash أو Password أو TNS قبل الإرسال.

## قرار الرفع إلى GitHub

لم يتم رفع `ias.dmp` إلى المستودع العام `aldalistor/onex` لأن الملف يحتوي Metadata وأسماء مستخدمين وأدوارًا وقيم اعتماد مجزأة ومسارات Datafile. يمكن لاحقًا رفع **التقرير المنقح والملخص JSON فقط** إذا طلب المستخدم ذلك، أما الملف الأصلي فيجب أن يبقى خاصًا أو في تخزين مشفر.

## المراجع

[1]: file:///home/ubuntu/upload/ias.dmp "ملف Oracle dump المرفق"
[2]: file:///home/ubuntu/work_ar_audit/ias_dump_inspection.txt "الفحص الثنائي الأولي للملف"
[3]: file:///home/ubuntu/work_ar_audit/ias_dump_metadata.json "ملخص Metadata المنقح بصيغة JSON"
[4]: file:///home/ubuntu/work_ar_audit/ias_dump_strings_sanitized.txt "السلاسل النصية المنقحة المستخرجة من dump"
[5]: file:///home/ubuntu/work_ar_audit/Unified_Forms_Lib_Analysis_AR.md "التقرير الموحد السابق لملفات Forms وLib"
