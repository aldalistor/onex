import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type WindowKind = "transaction" | "inquiry" | "report";
export type WindowPhase = "idle" | "opening" | "initializing" | "ready" | "dirty" | "committing" | "committed" | "closing" | "closed" | "error";
export type WindowAction = "new" | "save" | "delete" | "query" | "print" | "cancel" | "help";

export type WindowRecord = {
  id: string;
  label: string;
  module: string;
  kind: WindowKind;
  formName?: string;
};

export type WindowSession = WindowRecord & {
  minimized: boolean;
  phase: WindowPhase;
  dirty: boolean;
  openedAt: number;
  lastError?: string;
};

export type WindowLifecycleHandlers = {
  beforeOpen?: (window: WindowRecord) => void | Promise<void>;
  onInit?: (window: WindowSession) => void | Promise<void>;
  afterCommit?: (window: WindowSession) => void | Promise<void>;
  onClose?: (window: WindowSession) => void | Promise<void>;
};

type WindowManagerValue = {
  sessions: WindowSession[];
  activeId: string | null;
  activeWindow: WindowSession | null;
  openWindow: (window: WindowRecord, handlers?: WindowLifecycleHandlers) => Promise<boolean>;
  activateWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  closeWindow: (id: string) => Promise<boolean>;
  markDirty: (id?: string) => void;
  markClean: (id?: string) => void;
  setPhase: (phase: WindowPhase, id?: string, error?: string) => void;
  commitWindow: (id?: string) => Promise<void>;
  getHandlers: (id: string) => WindowLifecycleHandlers | undefined;
};

const WindowManagerContext = createContext<WindowManagerValue | null>(null);

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<WindowSession[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const handlersRef = useRef(new Map<string, WindowLifecycleHandlers>());
  const activeWindow = useMemo(() => sessions.find((session) => session.id === activeId) ?? null, [sessions, activeId]);

  const setPhase = useCallback((phase: WindowPhase, id = activeId ?? undefined, error?: string) => {
    if (!id) return;
    setSessions((current) => current.map((session) => session.id === id ? { ...session, phase, lastError: error } : session));
  }, [activeId]);

  const openWindow = useCallback(async (window: WindowRecord, handlers: WindowLifecycleHandlers = {}) => {
    try {
      await handlers.beforeOpen?.(window);
      handlersRef.current.set(window.id, handlers);
      setSessions((current) => {
        const existing = current.find((session) => session.id === window.id);
        if (existing) return current.map((session) => session.id === window.id ? { ...session, minimized: false, phase: "initializing" } : session);
        return [...current, { ...window, minimized: false, phase: "initializing", dirty: false, openedAt: Date.now() }];
      });
      setActiveId(window.id);
      return true;
    } catch (error) {
      setPhase("error", window.id, error instanceof Error ? error.message : "تعذر فتح النافذة");
      return false;
    }
  }, [setPhase]);

  useEffect(() => {
    if (!activeWindow || activeWindow.phase !== "initializing") return;
    const handlers = handlersRef.current.get(activeWindow.id);
    let cancelled = false;
    Promise.resolve(handlers?.onInit?.(activeWindow)).then(() => {
      if (!cancelled) setPhase("ready", activeWindow.id);
    }).catch((error) => {
      if (!cancelled) setPhase("error", activeWindow.id, error instanceof Error ? error.message : "فشلت تهيئة النافذة");
    });
    return () => { cancelled = true; };
  }, [activeWindow, setPhase]);

  const activateWindow = useCallback((id: string) => {
    setSessions((current) => current.map((session) => session.id === id ? { ...session, minimized: false } : session));
    setActiveId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => setSessions((current) => current.map((session) => session.id === id ? { ...session, minimized: true } : session)), []);
  const restoreWindow = useCallback((id: string) => { activateWindow(id); }, [activateWindow]);
  const markDirty = useCallback((id = activeId ?? undefined) => id && setSessions((current) => current.map((session) => session.id === id ? { ...session, dirty: true, phase: "dirty" } : session)), [activeId]);
  const markClean = useCallback((id = activeId ?? undefined) => id && setSessions((current) => current.map((session) => session.id === id ? { ...session, dirty: false, phase: "ready" } : session)), [activeId]);

  const commitWindow = useCallback(async (id = activeId ?? undefined) => {
    if (!id) return;
    const session = sessions.find((item) => item.id === id);
    if (!session) return;
    setPhase("committing", id);
    try {
      await handlersRef.current.get(id)?.afterCommit?.(session);
      markClean(id);
      setPhase("committed", id);
      window.setTimeout(() => setPhase("ready", id), 700);
    } catch (error) {
      setPhase("error", id, error instanceof Error ? error.message : "فشل الحفظ");
      throw error;
    }
  }, [activeId, markClean, sessions, setPhase]);

  const closeWindow = useCallback(async (id: string) => {
    const session = sessions.find((item) => item.id === id);
    if (!session) return true;
    if (session.dirty && !window.confirm("توجد تغييرات غير محفوظة. هل تريد إغلاق النافذة؟")) return false;
    setPhase("closing", id);
    await handlersRef.current.get(id)?.onClose?.(session);
    handlersRef.current.delete(id);
    setSessions((current) => current.filter((item) => item.id !== id));
    setActiveId((current) => current === id ? (sessions.find((item) => item.id !== id)?.id ?? null) : current);
    return true;
  }, [sessions, setPhase]);

  const value = useMemo<WindowManagerValue>(() => ({ sessions, activeId, activeWindow, openWindow, activateWindow, minimizeWindow, restoreWindow, closeWindow, markDirty, markClean, setPhase, commitWindow, getHandlers: (id) => handlersRef.current.get(id) }), [sessions, activeId, activeWindow, openWindow, activateWindow, minimizeWindow, restoreWindow, closeWindow, markDirty, markClean, setPhase, commitWindow]);
  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>;
}

export function useWindowManager() {
  const value = useContext(WindowManagerContext);
  if (!value) throw new Error("useWindowManager must be used inside WindowManagerProvider");
  return value;
}

export function useWindowLifecycle(handlers: WindowLifecycleHandlers) {
  return handlers;
}
