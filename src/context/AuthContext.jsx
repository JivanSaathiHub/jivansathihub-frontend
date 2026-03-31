import {
  createContext, useContext, useState,
  useCallback, useEffect,
} from "react";

const AuthContext = createContext(null);

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!user;

  useEffect(() => {
    apiFetch("/auth/me")
      .then((data) => {
        // If the logged-in user is an admin, do NOT hydrate the user context.
        // Admin sessions live in AdminContext only.
        if (data.user?.role === "admin" || data.user?.role === "superadmin") {
          setUser(null);
        } else {
          setUser(data.user || null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // ── login ─────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const me = await apiFetch("/auth/me");
      // Allow admin to login in user panel too — no block here
      setUser(me.user);
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── register ──────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method:      "POST",
        credentials: "include",
        body:        formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      const me = await apiFetch("/auth/me");
      setUser(me.user);
      return { success: true };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors — clear state regardless
    }
    setUser(null);
  }, []);

  // ── refreshUser ───────────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch("/auth/me");
      if (data.success) setUser(data.user);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}