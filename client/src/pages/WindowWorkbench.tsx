import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Archive, BarChart3, BookOpen, Calculator, ChevronDown, ChevronLeft, CircleHelp, FileBarChart, FilePlus2, FolderTree, LayoutDashboard, Menu, Package, PanelLeft, Printer, Receipt, Search, Settings2, ShieldCheck, ShoppingCart, Users, X } from "lucide-react";
import { WindowManagerProvider, type WindowAction, type WindowRecord, useWindowManager } from "@/window-runtime/WindowManager";
import { WindowToolbar, WindowTitleBar } from "@/window-runtime/WindowToolbar";
import { getLegacyContract, type LegacyField } from "@/window-runtime/legacyContracts";

type ModuleKey = "admin" | "finance" | "sales" | "purchasing" | "inventory" | "mrp" | "hr" | "pos" | "reports";
type RuntimeWindow = WindowRecord & { module: ModuleKey };

const modules: Array<{ id: ModuleKey; label: string; code: string; icon: typeof Settings2; windows: RuntimeWindow[] }> = [
  { id: "admin", label: "الإدارة والنظام", code: "ADMIN", icon: Settings2, windows: [{ id: "ERP_DBA", label: "إدارة النظام", module: "admin", kind: "transaction" }, { id: "ERP_DBA_DFLT_DATA", label: "البيانات الافتراضية", module: "admin", kind: "transaction" }, { id: "ERP_JOURNAL", label: "سجل العمليات والتدقيق", module: "admin", kind: "inquiry" }, { id: "ADMT027", label: "المستخدمون والصلاحيات", module: "admin", kind: "transaction" }] },
  { id: "finance", label: "الحسابات العامة", code: "GL", icon: Calculator, windows: [{ id: "GLST001", label: "دليل الحسابات", module: "finance", kind: "transaction" }, { id: "GLST002", label: "القيد اليومي", module: "finance", kind: "transaction" }, { id: "GLST004", label: "السندات والقيود المالية", module: "finance", kind: "transaction" }, { id: "GLST005", label: "تفاصيل اليومية", module: "finance", kind: "inquiry" }, { id: "GLST006", label: "ملاحظات القيود", module: "finance", kind: "inquiry" }, { id: "GLSI001", label: "استعلام القيود", module: "finance", kind: "inquiry" }] },
  { id: "sales", label: "المبيعات والعملاء", code: "AR", icon: Receipt, windows: [{ id: "ARST003", label: "تعريف العملاء", module: "sales", kind: "transaction" }, { id: "ARST004", label: "فاتورة المبيعات", module: "sales", kind: "transaction" }, { id: "ARST006", label: "كشف حساب العميل", module: "sales", kind: "inquiry" }, { id: "ARSR041", label: "كشف حساب عميل", module: "sales", kind: "report" }] },
  { id: "purchasing", label: "المشتريات والموردون", code: "AP", icon: ShoppingCart, windows: [{ id: "APST003", label: "فاتورة المشتريات", module: "purchasing", kind: "transaction" }, { id: "APST005", label: "كشف حساب المورد", module: "purchasing", kind: "inquiry" }, { id: "APSI002", label: "الموردون", module: "purchasing", kind: "transaction" }] },
  { id: "inventory", label: "المخزون", code: "INV", icon: Package, windows: [{ id: "INVT003", label: "بطاقة الصنف", module: "inventory", kind: "transaction" }, { id: "INVT004", label: "حركة المخزون", module: "inventory", kind: "inquiry" }] },
  { id: "mrp", label: "التخطيط والتصنيع", code: "MRP", icon: BarChart3, windows: [{ id: "MRPACS004", label: "إعدادات التخطيط والتصنيع", module: "mrp", kind: "transaction" }] },
  { id: "hr", label: "الموارد البشرية", code: "HR", icon: Users, windows: [{ id: "HRSI002", label: "ملف الموظف", module: "hr", kind: "transaction" }, { id: "HRSR002", label: "تقارير الموظفين", module: "hr", kind: "report" }] },
  { id: "pos", label: "نقطة البيع", code: "POS", icon: LayoutDashboard, windows: [{ id: "POSLGN", label: "تشغيل نقطة البيع", module: "pos", kind: "transaction" }, { id: "POST001", label: "مبيعات نقطة البيع", module: "pos", kind: "transaction" }] },
  { id: "reports", label: "التقارير", code: "RPT", icon: FileBarChart, windows: [{ id: "GLSR001", label: "تقارير الحسابات", module: "reports", kind: "report" }, { id: "ARSR041", label: "سجل فواتير المبيعات", module: "reports", kind: "report" }, { id: "MRPREP001", label: "تقارير التخطيط والمخزون", module: "reports", kind: "report" }] },
];
const kindLabel = { transaction: "معاملة", inquiry: "استعلام", report: "تقرير" };

function FieldControl({ field, onChange }: { field: LegacyField; onChange: () => void }) {
  if (field.type === "select") return <select defaultValue="all" onChange={onChange}><option value="all">الكل</option><option>الرئيسي</option><option>فرع صنعاء</option></select>;
  return <input type={field.type} required={field.required} onChange={onChange} placeholder={field.id} />;
}

function WindowBody({ window, onAction, records }: { window: RuntimeWindow; onAction: (action: WindowAction) => void; records: Array<{ docNo?: string; status?: string; grandTotal?: number | string }> }) {
  const contract = getLegacyContract(window.id);
  const fields: LegacyField[] = contract?.fields ?? ["رقم المستند", "التاريخ", "الحالة", "ملاحظات"].map((label) => ({ id: label, label, type: "text" as const, evidence: "inferred" as const }));
  return <div className="legacy-window-body"><div className="legacy-form-caption"><span>{window.label}</span><code>{window.id}.fmx</code></div><div className="contract-field-note">عقد FMX: {contract ? `${contract.source.namespace} · ${contract.fields.filter((field) => field.evidence === "extracted").length} حقول مستخرجة` : "لا يوجد عقد تفصيلي بعد"}</div><div className="legacy-form-fields">{fields.map((field) => <label key={field.id}><span>{field.label}{field.required ? " *" : ""}</span><FieldControl field={field} onChange={() => onAction("query")} /></label>)}</div><div className="legacy-grid"><div className="legacy-grid-head"><span>#</span><span>البيان</span><span>القيمة</span><span>الحالة</span></div>{(contract?.source.procedures.slice(0, 3) ?? ["تهيئة النافذة", "التحقق قبل الحفظ", "الأثر المحاسبي"]).map((item, i) => <div className="legacy-grid-row" key={item}><span>{i + 1}</span><span>{item}</span><span>{i === 2 ? "0.00" : "—"}</span><span className="state-ready">مربوط</span></div>)}{records.slice(0, 3).map((record, i) => <div className="legacy-grid-row" key={`${record.docNo}-${i}`}><span>R{i + 1}</span><span>{record.docNo || "سجل"}</span><span>{record.grandTotal ?? "0.00"}</span><span className="state-ready">{record.status || "DRAFT"}</span></div>)}</div><div className="legacy-form-footer"><span>F6 جديد</span><span>F7 استعلام</span><span>F10 حفظ</span><span>Esc إلغاء</span><strong>{contract?.notes ?? "دورة النافذة: تهيئة ← إدخال ← تحقق ← حفظ ← تدقيق"}</strong></div></div>;
}

function WorkbenchContent() {
  const [, setLocation] = useLocation();
  const manager = useWindowManager();
  const [expanded, setExpanded] = useState<ModuleKey | null>("finance");
  const [query, setQuery] = useState("");
  const [sidebar, setSidebar] = useState(true);
  const windowCatalog = trpc.windows.list.useQuery({ search: query || undefined, limit: 80 });
  const activeContract = trpc.windows.contract.useQuery({ legacyForm: manager.activeId ?? "__none__" }, { enabled: Boolean(manager.activeId) });
  const records = trpc.windows.records.useQuery({ legacyForm: manager.activeId ?? "__none__", search: query || undefined, limit: 10 }, { enabled: Boolean(manager.activeId) });
  const masterData = trpc.masterData.useQuery();
  const createInvoice = trpc.invoices.create.useMutation();
  const saveCustomer = trpc.windows.saveCustomer.useMutation();
  const saveSupplier = trpc.windows.saveSupplier.useMutation();
  const saveItem = trpc.windows.saveItem.useMutation();
  const saveJournal = trpc.windows.saveJournal.useMutation();
  const filteredModules = useMemo(() => modules.map((module) => ({ ...module, windows: module.windows.filter((w) => `${w.id} ${w.label}`.toLowerCase().includes(query.toLowerCase())) })).filter((module) => module.windows.length || module.label.includes(query)), [query]);

  const openWindow = async (window: RuntimeWindow) => {
    const contract = getLegacyContract(window.id);
    const ok = await manager.openWindow(window, {
      beforeOpen: () => { toast.info(`فتح ${window.id} · ${contract?.source.namespace ?? "GENERIC"} · فحص الصلاحيات والسياق`); },
      onInit: () => { toast.success(`تمت تهيئة ${window.id} · ${contract?.source.procedures[0] ?? "ON_INIT"}`); },
      afterCommit: () => { toast.success(`تم حفظ ${window.id} · POST_FORMS_COMMIT_PRC · تسجيل أثر التدقيق`); },
      onClose: () => { toast.info(`إغلاق ${window.id} · ${contract?.source.procedures.at(-1) ?? "EXIT_PROC"}`); },
    });
    if (!ok) toast.error(`تعذر فتح ${window.id}`);
  };

  const saveDraft = async () => {
    const active = manager.activeWindow;
    if (!active) return;
    const customer = masterData.data?.customers?.[0]; const warehouse = masterData.data?.warehouses?.[0]; const item = masterData.data?.items?.[0];
    if (!customer || !warehouse || !item) { toast.info("الحفظ محليًا جاهز؛ يلزم ربط قاعدة الاختبار للترحيل الفعلي"); await manager.commitWindow(active.id); return; }
    const done = () => void manager.commitWindow(active.id);
    if (active.id === "ARST003") return saveCustomer.mutate({ id: customer.id, companyId: customer.companyId, code: customer.code, legalName: customer.legalName, currencyCode: customer.currencyCode, status: customer.status }, { onSuccess: done, onError: (error) => toast.error(error.message) });
    if (active.id === "APST003") { const supplier = masterData.data?.customers?.[0]; if (supplier) return saveSupplier.mutate({ companyId: supplier.companyId, code: `SUP-${supplier.code}`, legalName: supplier.legalName, currencyCode: supplier.currencyCode, status: "ACTIVE" }, { onSuccess: done, onError: (error) => toast.error(error.message) }); }
    if (active.id === "INVT003") return saveItem.mutate({ id: item.id, companyId: item.companyId, code: item.code, description: item.description, stockFlag: item.stockFlag, unitCost: item.unitCost, revenueAccount: item.revenueAccount, inventoryAccount: item.inventoryAccount, cogsAccount: item.cogsAccount, active: item.active }, { onSuccess: done, onError: (error) => toast.error(error.message) });
    if (["GLST002", "GLST004"].includes(active.id)) return saveJournal.mutate({ journalNo: `${active.id}-${Date.now()}`, entryType: active.id, actor: "workbench.user", lines: [{ accountCode: "1100", accountName: "حساب تجريبي", description: "قيد من عقد FMX", debit: "100", credit: "0" }, { accountCode: "4100", accountName: "إيراد تجريبي", description: "قيد من عقد FMX", debit: "0", credit: "100" }] }, { onSuccess: done, onError: (error) => toast.error(error.message) });
    if (["ARST004", "POST001"].includes(active.id)) return createInvoice.mutate({ docNo: `${active.id}-${Date.now()}`, customerId: customer.id, warehouseId: warehouse.id, actor: "workbench.user", lines: [{ itemId: item.id, quantity: "1", unitPrice: "100", taxAmount: "15" }] }, { onSuccess: done, onError: (error) => toast.error(error.message) });
    await manager.commitWindow(active.id);
  };

  const handleAction = async (action: WindowAction) => {
    const id = manager.activeId; if (!id) return;
    if (action === "save") return saveDraft();
    if (action === "cancel") return manager.markClean(id);
    if (action === "query") { await records.refetch(); return toast.success(`تم تحديث سجلات ${id} من قاعدة البيانات`); }
    if (action === "new") return toast.info(`سجل جديد في ${id}`);
    if (action === "delete") return toast.info(`الحذف يتطلب تأكيد السجل في ${id}`);
    if (action === "print") return toast.info(`تجهيز تقرير ${id}`);
    return toast.info(`مساعدة ${id}: دورة النافذة متاحة في عقد التشغيل`);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F10") { event.preventDefault(); void handleAction("save"); }
      if (event.key === "F7") { event.preventDefault(); void handleAction("query"); }
      if (event.key === "Escape" && manager.activeId) { event.preventDefault(); void manager.closeWindow(manager.activeId); }
      if (event.ctrlKey && event.key.toLowerCase() === "p") { event.preventDefault(); void handleAction("print"); }
    };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  });

  const active = manager.activeWindow;
  return <div className="workbench-shell" dir="rtl"><header className="workbench-menubar"><button className="workbench-brand" onClick={() => setLocation("/")}><span className="brand-mark">ON</span><span><b>YS ERP</b><small>Oracle Forms Workbench</small></span></button><button className="menubar-item"><Menu size={15} /> النظام</button><button className="menubar-item"><FolderTree size={15} /> النوافذ</button><button className="menubar-item"><FileBarChart size={15} /> التقارير</button><button className="menubar-item" onClick={() => setLocation("/setup")}><Settings2 size={15} /> تهيئة</button><span className="menubar-spacer" /><span className="connection-state"><i /> نواة دورة الحياة</span><button className="icon-button" title="مساعدة"><CircleHelp size={17} /></button></header><div className="workbench-toolbar"><button className="toolbar-main" onClick={() => setSidebar((v) => !v)}><PanelLeft size={16} /> شجرة النظام</button><span className="toolbar-path">النظام الرئيسي <ChevronLeft size={14} /> مساحة تشغيل النوافذ</span><span className="toolbar-spacer" /><label className="window-search"><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث عن نافذة أو رمز..." /></label></div><div className="workbench-layout">{sidebar && <aside className="workbench-sidebar"><div className="sidebar-title"><div><span>قائمة النظام</span><small>MODULE NAVIGATOR</small></div><button className="icon-button"><ChevronDown size={15} /></button></div><div className="tree-root"><BookOpen size={17} /><div><b>YS Enterprise Resource Planning</b><small>الإصدار 6.20 · بيئة التشغيل</small></div></div>{filteredModules.map((module) => { const Icon = module.icon; const isOpen = expanded === module.id; return <div className="module-tree" key={module.id}><button className="module-row" onClick={() => setExpanded(isOpen ? null : module.id)}><Icon size={16} /><span><b>{module.label}</b><small>{module.code} · {module.windows.length} نوافذ معروضة</small></span>{isOpen ? <ChevronDown size={15} /> : <ChevronLeft size={15} />}</button>{isOpen && <div className="module-children">{module.windows.map((window) => <button key={window.id} className={`tree-window ${active?.id === window.id ? "selected" : ""}`} onClick={() => void openWindow(window)}><span className="window-dot" /><span><b>{window.label}</b><small>{window.id} · {kindLabel[window.kind]}</small></span><FilePlus2 size={13} /></button>)}</div>}</div>})}</aside>}<main className="workbench-main"><div className="open-tabs">{manager.sessions.map((session) => <button key={session.id} className={`open-tab ${manager.activeId === session.id ? "active" : ""}`} onClick={() => manager.restoreWindow(session.id)}><span className="tab-icon"><Archive size={13} /></span><span>{session.id}</span><small>{session.phase}</small><X size={13} onClick={(event) => { event.stopPropagation(); void manager.closeWindow(session.id); }} /></button>)}<span className="open-tabs-spacer" /><span className="session-label"><ShieldCheck size={14} /> جلسة آمنة · {manager.sessions.length} نافذة</span></div><div className="window-stage">{active && !active.minimized ? <section className="legacy-window"><WindowTitleBar label={active.label} id={active.id} kind={kindLabel[active.kind]} onMinimize={() => manager.minimizeWindow(active.id)} onClose={() => void manager.closeWindow(active.id)} /><div className="contract-ribbon">{activeContract.isLoading ? "جارٍ تحميل عقد النافذة..." : `${activeContract.data?.coreApi || "ONEX_WINDOW_API"} · ${active.phase} · ${activeContract.data?.status || "NOT_READY"}`} {windowCatalog.isFetching ? " · تحديث الفهرس" : ""}</div><WindowToolbar phase={active.phase} onAction={handleAction} onClose={() => void manager.closeWindow(active.id)} disabled={createInvoice.isPending} /><WindowBody window={active as RuntimeWindow} onAction={() => manager.markDirty(active.id)} records={(records.data || []) as Array<{ docNo?: string; status?: string; grandTotal?: number | string }>} /></section> : <div className="empty-workbench"><LayoutDashboard size={44} /><h2>مساحة تشغيل النظام</h2><p>{active?.minimized ? "النافذة مصغرة؛ اختر تبويبها لاستعادتها." : "اختر نافذة من شجرة النظام لفتحها في جلسة العمل."}</p></div>}</div><footer className="workbench-status"><span><i className="status-green" /> {active?.phase === "error" ? active.lastError : active?.phase === "committed" ? "تم الحفظ" : active?.phase === "dirty" ? "تعديلات غير محفوظة" : "جاهز"}</span><span>المستخدم: administrator</span><span>الفرع: الرئيسي</span><span className="status-spacer" /><span>F7 استعلام</span><span>F10 حفظ</span><span>الإصدار 6.20</span></footer></main></div></div>;
}

export default function WindowWorkbench() { return <WindowManagerProvider><WorkbenchContent /></WindowManagerProvider>; }
