import {
  createContext, useContext, useState,
  useCallback, useEffect,
} from "react";

/**
 * AdminContext — completely separate from the user AuthContext.
 *
 * - Uses its own in-memory state (never localStorage)
 * - Shares the same httpOnly cookie as the user (the server sets it on login)
 * - On mount, silently checks /auth/me — if the cookie belongs to an admin,
 *   hydrates the admin session; otherwise stays null
 * - Logging in/out here never touches the user session and vice-versa
 */

const AdminContext = createContext(null);

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiFetch = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: isFormData ? { ...options.headers } : { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export function AdminProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading,   setLoading]   = useState(true);

  const isAdminLoggedIn = !!adminUser;

  // ── On mount: check if a valid admin cookie already exists ───────────
  // This handles the case where the admin refreshes the page
  useEffect(() => {
    apiFetch("/auth/me")
      .then((data) => {
        const u = data.user;
        if (u?.role === "admin" || u?.role === "superadmin") {
          setAdminUser(u);
        } else {
          setAdminUser(null);
        }
      })
      .catch(() => setAdminUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ── adminLogin ────────────────────────────────────────────────────────
  const adminLogin = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const me = await apiFetch("/auth/me");
      const u  = me.user;
      if (!u || (u.role !== "admin" && u.role !== "superadmin")) {
        // Not an admin — log them out immediately and reject
        await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
        throw new Error("Access denied. Admin credentials required.");
      }
      setAdminUser(u);
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── adminLogout ───────────────────────────────────────────────────────
  // This logs out fully (clears the httpOnly cookie on the server),
  // then clears admin state. The user context will also become null
  // on its next /auth/me check, but since we navigate away from admin
  // panel entirely, that doesn't matter in practice.
  const adminLogout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setAdminUser(null);
  }, []);

  // ── refreshAdminUser ──────────────────────────────────────────────────
  const refreshAdminUser = useCallback(async () => {
    try {
      const data = await apiFetch("/auth/me");
      const u    = data.user;
      if (u?.role === "admin" || u?.role === "superadmin") {
        setAdminUser(u);
      } else {
        setAdminUser(null);
      }
    } catch {
      setAdminUser(null);
    }
  }, []);

  return (
    <AdminContext.Provider value={{ adminUser, isAdminLoggedIn, loading, adminLogin, adminLogout, refreshAdminUser }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}