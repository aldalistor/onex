from pathlib import Path
p = Path('/home/ubuntu/onex-windows-rebuild/client/src/pages/Home.tsx')
s = p.read_text()
s = s.replace('function StatusPill({ status }: { status: string }) {\n  const tone = status.includes("مكتملة") ? "success" : status === "مواصفة" ? "warning" : "neutral";', 'function StatusPill({ status }: { status: string }) {\n  const tone = status.includes("مكتملة") || status.includes("verified") ? "success" : status.includes("مواصفة") || status.includes("catalog") ? "warning" : "neutral";')
s = s.replace('<StatusPill status={selectedWindow?.buildState ?? "مفهرسة"} />', '<StatusPill status={selectedWindow?.rebuildLevel ?? selectedWindow?.buildState ?? "مفهرسة"} />')
needle = '<div><span>صلاحية الشركة أو الفرع</span><b>{selectedWindow.companyBranchPermission}</b></div></div>'
replacement = '<div><span>صلاحية الشركة أو الفرع</span><b>{selectedWindow.companyBranchPermission}</b></div><div><span>مستوى إعادة البناء</span><b>{selectedWindow.rebuildLevel ?? "catalog_specification"}</b></div><div><span>حالة المصدر</span><b>{selectedWindow.sourceStatus ?? "FMB_PLL_not_found"}</b></div><div><span>الإجراءات المرصودة</span><b>{selectedWindow.observedProcedures ?? 0}</b></div><div><span>الـTriggers المرصودة</span><b>{selectedWindow.observedTriggers ?? 0}</b></div><div><span>مؤشرات الجداول</span><b>{selectedWindow.observedTableIndicators ?? 0}</b></div><div><span>الأدلة المطلوبة التالية</span><b>{selectedWindow.nextRequiredEvidence ?? "FMB/PLL/PKS/PKB/DDL/Forms Builder"}</b></div></div>'
if needle not in s: raise SystemExit('detail marker missing')
s = s.replace(needle, replacement)
s = s.replace('<p>{selectedWindow?.formName ?? "تظهر هنا هوية الشاشة وعلاقاتها وصلاحياتها"}</p>', '<p>{selectedWindow?.formName ?? "تظهر هنا هوية الشاشة وعلاقاتها وصلاحياتها"}</p><p className="detail-source-note">مصدر الحالة: manifest/all_windows_rebuild_status.csv</p>')
p.write_text(s)
print('patched manifest UI')
