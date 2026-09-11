# معمارية النسخة المحدثة

تظل الوحدات Oracle Forms هي المرجع الوظيفي أثناء مرحلة التوازي:

```text
Forms Builder / FMX القديم ─┐
                            ├── Oracle Test/Current DB
New Forms-compatible rebuild ┘

New API and audit layer (optional)
        ↓
Oracle packages, views, tables, sequences
```

الترقية يجب أن تكون **تدريجية**: Login ثم AR ثم AP ثم GL ثم Inventory ثم POS ثم بقية الوحدات. كل نافذة لها مواصفة، أثر SQL، صلاحيات، حالات مستند، ومقارنة نتائج.
