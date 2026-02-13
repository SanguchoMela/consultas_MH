import { useState } from "react";
import { auth } from "../firebase.js";
import Header from "../components/layout/Header.jsx";
import ErrorCard from "../components/feedback/ErrorCard.jsx";
import Spinner from "../components/feedback/Spinner.jsx";

export default function Admin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
        role: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const createUser = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const user = auth.currentUser;
            if (!user) {
                alert("Usuario no autenticado");
                return
            }

            const token = await user.getIdToken();

            // Realizar la solicitud con el token en el encabezado
            const res = await fetch(`${backendUrl}/users/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(
                    `Error al crear el usuario\n${data.error || ""}`
                );
                return
            }

            alert("Usuario creado correctamente");

            setForm({
                email: "",
                password: "",
                name: "",
                role: ""
            })

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <Header title="Administración" />
            {loading && <Spinner overlay />}
            <h2 className="font-medium text-lg text-cyan-900">Crear usuario</h2>
            <p className="mb-2">Ingresa la información para registrar un nuevo usuario</p>
            {error && <ErrorCard errorMessage={error} />}
            <form onSubmit={createUser} className="lg:max-w-[50%] md:max-w-[70%] mx-auto mt-2 space-y-2">
                <div>
                    <label className="sub-label">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ej: Maria Perez"
                        className="input-style block w-full"
                        required
                    />
                </div>
                <div>
                    <label className="sub-label">Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Ej: vendedor@mh.com"
                        className="input-style block w-full"
                    />
                </div>
                <div>
                    <label className="sub-label">Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="*******"
                        className="input-style block w-full"
                    />
                </div>
                <div>
                    <label className="sub-label">Rol</label>
                    <select
                        name="role"
                        id="role"
                        value={form.role}
                        onChange={handleChange}
                        className="px-3 py-2 border border-cyan-700 rounded-md w-full focus:outline-none bg-[#e8edef]"
                        required
                    >
                        <option value="">Seleccionar rol</option>
                        <option value="admin">Administrador</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="seller">Vendedor</option>
                    </select>
                </div>
                <button type="submit" disabled={loading} className="search-button w-full mt-3">{loading ? "Creando..." : "Crear usuario"}</button>
            </form>
        </>
    );
}
