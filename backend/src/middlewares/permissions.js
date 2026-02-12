import { ROLE_PERMISSIONS } from "../constants/rolePermissions.js";

export function checkPermission(permission) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const permissions = ROLE_PERMISSIONS[userRole] || [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: "Permisos insuficientes" });
    }

    next();
  }
}