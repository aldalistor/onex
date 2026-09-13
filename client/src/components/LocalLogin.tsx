import { FormEvent, useState } from "react";
import { ShieldCheck, LogIn } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function LocalLogin() {
  const utils = trpc.useUtils();
  const [username, setUsername] = useState("1");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/local-auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error === "INVALID_CREDENTIALS" ? "بيانات الدخول غير صحيحة" : "تدفق الدخول المحلي غير مفعّل");
      await utils.auth.me.invalidate();
      toast.success("تم تسجيل الدخول بنجاح");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر تسجيل الدخول");
    } finally {
      setPending(false);
    }
  };

  return <main className="local-login-shell" dir="rtl"><section className="local-login-card"><div className="local-login-icon"><ShieldCheck size={28} /></div><p className="local-login-kicker">ONEX ERP · SECURE SESSION</p><h1>تسجيل الدخول إلى مساحة العمل</h1><p className="local-login-copy">استخدم حساب التشغيل المحلي المهيأ في بيئة الاختبار للدخول إلى النوافذ والعقود.</p><form onSubmit={submit}><label>اسم المستخدم<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label><label>كلمة المرور<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required /></label><button type="submit" disabled={pending}><LogIn size={16} />{pending ? "جارٍ التحقق..." : "دخول آمن"}</button></form><small>الجلسة محمية بملف تعريف httpOnly وتنتهي تلقائيًا بعد 8 ساعات.</small></section></main>;
}
