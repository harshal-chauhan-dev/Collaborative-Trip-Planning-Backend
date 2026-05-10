export const ROLE_RANK = {
  viewer: 1,
  editor: 2,
  owner: 3,
};

export const hasRole = (userRole, minRole) => {
  return (ROLE_RANK[userRole] ?? 0) >= (ROLE_RANK[minRole] ?? Infinity);
};
