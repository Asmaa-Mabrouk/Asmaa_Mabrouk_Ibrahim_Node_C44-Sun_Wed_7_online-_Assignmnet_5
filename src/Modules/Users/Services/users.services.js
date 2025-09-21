// Mock user store
const users = [];

const createUserService = ({ username, password, permissions }) => {
  if (!username || !password) throw new Error("Username and password are required");
  const exists = users.find(u => u.username === username);
  if (exists) throw new Error("User already exists");

  if (permissions && !Array.isArray(permissions)) {
    throw new Error("Permissions must be an array");
  }

  const newUser = { username, password, permissions: permissions || [] };
  users.push(newUser);
  return newUser;
};

const grantPermissionService = ({ username, permission }) => {
  const user = users.find(u => u.username === username);
  if (!user) throw new Error("User not found");

  if (!user.permissions.includes(permission)) {
    user.permissions.push(permission);
  }
  return user;
};

const revokePermissionService = ({ username, permission }) => {
  const user = users.find(u => u.username === username);
  if (!user) throw new Error("User not found");

  user.permissions = user.permissions.filter(p => p !== permission);
  return user;
};

module.exports = {
  createUserService,
  grantPermissionService,
  revokePermissionService
};

