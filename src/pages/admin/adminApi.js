import API from "../../api/axios";

/* ════════════════════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════════════════ */
export const dashboardApi = {
  getAll: (limit = 5) => API.get(`/admin/stats?limit=${limit}`).then((r) => r.data),
};

/* ════════════════════════════════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════════════════════════════════ */
export const sidebarApi = {
  getCounts: () => API.get("/admin/sidebar-counts").then((r) => r.data),
};

/* ════════════════════════════════════════════════════════════════════════════
   USERS
════════════════════════════════════════════════════════════════════════════ */
export const usersApi = {
  getStats: () =>
    API.get("/admin/users/stats").then((r) => r.data),

  getAll: ({ page = 1, limit = 10, search = "", gender = "", plan = "", verified = "", active = "", sort = "newest" } = {}) =>
    API.get("/admin/users", { params: { page, limit, search, gender, plan, verified, active, sort } }).then((r) => r.data),

  getById: (id) =>
    API.get(`/admin/users/${id}`).then((r) => r.data),

  block: (id) =>
    API.put(`/admin/users/${id}/block`).then((r) => r.data),

  unblock: (id) =>
    API.put(`/admin/users/${id}/unblock`).then((r) => r.data),

  delete: (id) =>
    API.delete(`/admin/users/${id}`).then((r) => r.data),

  updateRole: (id, role) =>
    API.put(`/admin/users/${id}/role`, { role }).then((r) => r.data),

  export: async () => {
    const res  = await API.get("/admin/users/export", { responseType: "blob" });
    const url  = URL.createObjectURL(new Blob([res.data]));
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `users-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   INTERESTS
════════════════════════════════════════════════════════════════════════════ */
export const interestsApi = {
  getStats: () =>
    API.get("/admin/interests/stats").then((r) => r.data),

  getAll: ({ page = 1, limit = 10, status = "", search = "", timeRange = "" } = {}) =>
    API.get("/admin/interests", { params: { page, limit, status, search, timeRange } })
       .then((r) => r.data),

  getById: (id) =>
    API.get(`/admin/interests/${id}`).then((r) => r.data),

  delete: (id) =>
    API.delete(`/admin/interests/${id}`).then((r) => r.data),

  export: async () => {
    const res  = await API.get("/admin/interests/export", { responseType: "blob" });
    const url  = URL.createObjectURL(new Blob([res.data]));
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `interests-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   MEMBERSHIPS (users)
════════════════════════════════════════════════════════════════════════════ */
export const membershipsApi = {
  getStats: () =>
    API.get("/admin/memberships/stats").then((r) => r.data),

  getAll: ({ page = 1, limit = 10, plan = "", active = "" } = {}) =>
    API.get("/admin/memberships", { params: { page, limit, plan, active } }).then((r) => r.data),

  upgrade: (userId, plan, days) =>
    API.put(`/admin/memberships/${userId}/upgrade`, { plan, ...(days ? { days } : {}) }).then((r) => r.data),

  cancel: (userId) =>
    API.put(`/admin/memberships/${userId}/cancel`).then((r) => r.data),

  export: async () => {
    const res  = await API.get("/admin/memberships/export", { responseType: "blob" });
    const url  = URL.createObjectURL(new Blob([res.data]));
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `memberships-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   MEMBERSHIP PLANS (admin CRUD)
════════════════════════════════════════════════════════════════════════════ */
export const plansApi = {
  /**
   * GET /api/admin/plans
   * Response: { success, stats: { totalPlans, totalSubscribers, activePlans }, plans: [...] }
   */
  getAll: () =>
    API.get("/admin/plans").then((r) => r.data),

  /**
   * POST /api/admin/plans
   * Body: { name, price, duration, durationDays, features: [] }
   */
  create: (data) =>
    API.post("/admin/plans", data).then((r) => r.data),

  /**
   * PUT /api/admin/plans/:id
   * Body: { name, price, duration, durationDays, features: [] }
   */
  update: (id, data) =>
    API.put(`/admin/plans/${id}`, data).then((r) => r.data),

  /**
   * PATCH /api/admin/plans/:id/toggle
   * Toggles isActive
   */
  toggle: (id) =>
    API.patch(`/admin/plans/${id}/toggle`).then((r) => r.data),

  /**
   * DELETE /api/admin/plans/:id
   */
  delete: (id) =>
    API.delete(`/admin/plans/${id}`).then((r) => r.data),
};

/* ════════════════════════════════════════════════════════════════════════════
   VERIFICATIONS
════════════════════════════════════════════════════════════════════════════ */
export const verificationsApi = {
  getStats: () =>
    API.get("/admin/verifications/stats").then((r) => r.data),

  getAll: ({ page = 1, limit = 10, search = "" } = {}) =>
    API.get("/admin/verifications", { params: { page, limit, search } }).then((r) => r.data),

  getById: (userId) =>
    API.get(`/admin/verifications/${userId}`).then((r) => r.data),

  export: async () => {
    const res  = await API.get("/admin/verifications/export", { responseType: "blob" });
    const url  = URL.createObjectURL(new Blob([res.data]));
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `verifications-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   ANALYTICS
════════════════════════════════════════════════════════════════════════════ */
export const analyticsApi = {
  get: () => API.get("/admin/analytics").then((r) => r.data),
};

/* ════════════════════════════════════════════════════════════════════════════
   REPORTS
════════════════════════════════════════════════════════════════════════════ */
export const reportsApi = {
  getSummary: () => API.get("/admin/reports/summary").then((r) => r.data),

  export: async (type) => {
    const res  = await API.get(`/admin/reports/export/${type}`, { responseType: "blob" });
    const url  = URL.createObjectURL(new Blob([res.data]));
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `report-${type}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

/* ════════════════════════════════════════════════════════════════════════════
   SUPPORT
════════════════════════════════════════════════════════════════════════════ */
export const supportApi = {
  getAll: ({ page = 1, limit = 10, status = "" } = {}) =>
    API.get("/admin/support", { params: { page, limit, status } }).then((r) => r.data),

  update: (id, data) =>
    API.put(`/admin/support/${id}`, data).then((r) => r.data),
};

/* ════════════════════════════════════════════════════════════════════════════
   FEEDBACK
════════════════════════════════════════════════════════════════════════════ */
export const feedbackApi = {
  getAll: ({ page = 1, limit = 5, search = "", status = "", rating = "" } = {}) =>
    API.get("/admin/feedback", { params: { page, limit, search, status, rating } }).then((r) => r.data),

  resolve: (id) =>
    API.patch(`/admin/feedback/${id}/resolve`).then((r) => r.data),

  delete: (id) =>
    API.delete(`/admin/feedback/${id}`).then((r) => r.data),
};

/* ════════════════════════════════════════════════════════════════════════════
   SETTINGS
════════════════════════════════════════════════════════════════════════════ */
export const settingsApi = {
  get:  ()     => API.get("/admin/settings").then((r) => r.data),
  save: (data) => API.put("/admin/settings", data).then((r) => r.data),
};

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN PROFILE
════════════════════════════════════════════════════════════════════════════ */
export const adminProfileApi = {
  update: (data) => API.put("/admin/profile", data).then((r) => r.data),
};