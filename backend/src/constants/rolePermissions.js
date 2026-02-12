import { ROLES } from "./roles.js";
import { PERMISSIONS } from "./permissions.js";

export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        PERMISSIONS.CREATE_USER,
        PERMISSIONS.VIEW_REPORT,
        PERMISSIONS.VIEW_PAGOS,
    ],
    [ROLES.SUPERVISOR]: [
        PERMISSIONS.VIEW_REPORT,
        PERMISSIONS.VIEW_PAGOS,
    ],
    [ROLES.SELLER]: [
        PERMISSIONS.VIEW_REPORT,
    ],
};