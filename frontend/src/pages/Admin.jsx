import { useState } from "react";
import { auth } from "../firebase.js";
import Header from "../components/layout/Header.jsx";

export default function Admin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const createUser = async () => {
        const token = await auth.currentUser.getIdToken();

        await fetch("http://localhost:3000/users/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email, password }),
        });

        alert("Usuario creado");
    };

    return (
        <>
            <Header title="Administración" />
            <h2 className="font-medium text-lg text-cyan-900">Crear usuario vendedor</h2>
            <p>Ingresa la información para registrar un nuevo usuario con el rol de vendedor</p>
            <section className="lg:max-w-[50%] md:max-w-[70%] mx-auto mt-2">
                <div>
                    <label className="sub-label">Correo electrónico</label>
                    <input
                        type="email"
                        placeholder="Ej: vendedor@mh.com"
                        onChange={e => setEmail(e.target.value)}
                        className="input-style block w-full"
                    />
                </div>
                <div>
                    <label className="sub-label">Contraseña</label>
                    <input
                        type="password"
                        placeholder="*******"
                        onChange={e => setPassword(e.target.value)}
                        className="input-style block w-full"
                    />
                </div>
                <button onClick={createUser} className="search-button w-full mt-3">Crear usuario</button>
            </section>
        </>
    );
}
