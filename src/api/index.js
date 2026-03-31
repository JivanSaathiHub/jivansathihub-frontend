import API from "./axios";

// ── AUTH ──────────────────────────────────────────────────────────

export const registerUser = async (formData) => {
  const res = await API.post("/auth/register", formData);
  if (res.data.user) {
    localStorage.setItem("jsh_user", JSON.stringify(res.data.user));
  }
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  if (res.data.user) {
    localStorage.setItem("jsh_user", JSON.stringify(res.data.user));
  }
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const logoutUser = async () => {
  try {
    await API.post("/auth/logout");
  } catch {
    // proceed even if server call fails
  }
  localStorage.removeItem("jsh_user");
};

// ── PROFILE ───────────────────────────────────────────────────────

export const getMyProfile = async () => {
  const res = await API.get("/profile/me");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await API.put("/profile/me", data);
  return res.data;
};

export const getProfile = async (id) => {
  const res = await API.get(`/profile/${id}`);
  return res.data;
};

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);
  const res = await API.post("/profile/photos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deletePhoto = async (photoId) => {
  const res = await API.delete(`/profile/photos/${photoId}`);
  return res.data;
};

export const setPrimaryPhoto = async (photoId) => {
  const res = await API.put(`/profile/photos/${photoId}/primary`);
  return res.data;
};

// ── SEARCH ────────────────────────────────────────────────────────

export const searchProfiles = async (filters = {}) => {
  const params = {};
  if (filters.lookingFor || filters.gender)
    params.gender = filters.lookingFor || filters.gender;
  if (filters.ageFrom)   params.ageFrom   = filters.ageFrom;
  if (filters.ageTo)     params.ageTo     = filters.ageTo;
  if (filters.religion && filters.religion !== "Any")
    params.religion = filters.religion;
  if (filters.location && filters.location !== "Any")
    params.location = filters.location;
  if (filters.profession && filters.profession !== "Any")
    params.profession = filters.profession;
  if (filters.verifiedOnly) params.verified = true;
  if (filters.sort)  params.sort  = filters.sort;
  if (filters.page)  params.page  = filters.page;
  const res = await API.get("/search", { params });
  return res.data;
};

export const getRecommendations = async () => {
  const res = await API.get("/search/recommendations");
  return res.data;
};

// ── INTERESTS ─────────────────────────────────────────────────────

export const sendInterest = async (userId, message = "") => {
  const res = await API.post(`/interests/${userId}`, { message });
  return res.data;
};

export const respondToInterest = async (interestId, action) => {
  const res = await API.put(`/interests/${interestId}`, { action });
  return res.data;
};

export const withdrawInterest = async (userId) => {
  const res = await API.delete(`/interests/${userId}`);
  return res.data;
};

export const getSentInterests = async () =>
  (await API.get("/interests/sent")).data;

export const getReceivedInterests = async () =>
  (await API.get("/interests/received")).data;

export const getMatches = async () =>
  (await API.get("/interests/matches")).data;

// ── SHORTLIST ─────────────────────────────────────────────────────

export const getShortlist = async () =>
  (await API.get("/shortlist")).data;

export const addToShortlist = async (profileId) =>
  (await API.post(`/shortlist/${profileId}`)).data;

export const removeFromShortlist = async (profileId) =>
  (await API.delete(`/shortlist/${profileId}`)).data;

export const checkShortlist = async (profileId) =>
  (await API.get(`/shortlist/check/${profileId}`)).data;

// ── MESSAGES ──────────────────────────────────────────────────────

export const getConversations = async () =>
  (await API.get("/messages/conversations")).data;

export const getMessages = async (partnerId, page = 1) =>
  (await API.get(`/messages/${partnerId}`, { params: { page } })).data;

export const sendMessage = async (partnerId, text, image = "") =>
  (await API.post(`/messages/${partnerId}`, { text, image })).data;

export const clearConversation = async (partnerId) =>
  (await API.delete(`/messages/conversation/${partnerId}`)).data;

// ── MEMBERSHIP ────────────────────────────────────────────────────

export const getMembershipPlans = async () =>
  (await API.get("/membership/plans")).data;

export const getMembershipStatus = async () =>
  (await API.get("/membership/status")).data;

export const upgradeMembership = async (plan) => {
  const res = await API.post("/membership/upgrade", { plan });
  return res.data;
};

// ── PAYMENTS ──────────────────────────────────────────────────────

export const createOrder = async (plan) => {
  const res = await API.post("/membership/create-order", { plan });
  return res.data;
};

export const verifyPayment = async (paymentData) => {
  const res = await API.post("/membership/verify", paymentData);
  return res.data;
};

// ── ADMIN ─────────────────────────────────────────────────────────

export const getAdminStats = async () =>
  (await API.get("/admin/stats")).data;

export const getAdminUsers = async () =>
  (await API.get("/admin/users")).data;

export const blockUser = async (userId) =>
  (await API.patch(`/admin/users/${userId}/block`)).data;

export const unblockUser = async (userId) =>
  (await API.patch(`/admin/users/${userId}/unblock`)).data;

export const deleteAdminUser = async (userId) =>
  (await API.delete(`/admin/users/${userId}`)).data;

export const updateUserRole = async (userId, role) =>
  (await API.patch(`/admin/users/${userId}/role`, { role })).data;

export const getAdminInterests = async () =>
  (await API.get("/admin/interests")).data;

export const deleteAdminInterest = async (interestId) =>
  (await API.delete(`/admin/interests/${interestId}`)).data;

export const getAdminMemberships = async () =>
  (await API.get("/admin/memberships")).data;

export const adminUpgradeMembership = async (userId, plan) =>
  (await API.post(`/admin/memberships/${userId}/upgrade`, { plan })).data;

export const adminCancelMembership = async (userId) =>
  (await API.post(`/admin/memberships/${userId}/cancel`)).data;