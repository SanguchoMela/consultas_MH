import { useAuth } from "../context/authContext";

export default function useTranslatedRole() {
    const { role } = localStorage.getItem("role") ? { role: localStorage.getItem("role") } : useAuth();

    function translateRole(role) {
        if (role === "admin") return "Administrador";
        if (role === "supervisor") return "Supervisor";
        if (role === "seller") return "Vendedor";
        return role;
    }

    return translateRole(role);
}