import { ROLE_PERMISSIONS } from "../constants/rolePermissions.js";

export function checkPermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const userRole = req.user.role || "guest";
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: "Permisos insuficientes" });
    }

    next();
  };
}