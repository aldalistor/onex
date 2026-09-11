# مصفوفة التتبع العميقة

## مستويات الدليل

| المستوى | المعنى | مصدره |
|---|---|---|
| L0 | اسم الملف والحجم والمجال | Forms index |
| L1 | strings وprocedure-like names وSQL-like indicators | FMX/PLX static extraction |
| L2 | مواصفة نافذة ودوال وروابط | generated specs |
| L3 | تنفيذ مطابق | FMB/PLL/PKB + Oracle test DB |
| L4 | قبول إنتاجي | Golden Master tests and owner sign-off |

## قاعدة التتبع

كل تغيير في نافذة يجب أن يربط بـ:

`window → block/item/trigger → procedure/package → table/view → transaction effect → test case`

## ما هو جاهز

- كتالوج كامل للنوافذ في `window_catalog.csv`.
- كتالوج الدوال والمؤشرات في `function_traceability.csv`.
- مواصفات مركزة لـ 18 نافذة حرجة.
- ربط سابق مع Lib.zip وias.dmp المنقح.

## ما يحتاج ملفات المصدر

لا يمكن ادعاء أن كل كود PL/SQL أو كل Trigger قد أُعيد بناؤه من FMX وحده. يجب إضافة FMB/PLL/PKS/PKB وDDL للحصول على مطابقة تنفيذية.
