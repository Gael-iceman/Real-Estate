const normalizeRole = role => String(role || "").toLowerCase();

export const isAdminRole = role => {
  const normalized = normalizeRole(role);
  return normalized === "admin";
};

export const isAdminUser = userState => {
  if (!userState) return false;
  const role = userState.role || userState.user?.role;
  return isAdminRole(role);
};
