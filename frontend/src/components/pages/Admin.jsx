import { useState } from "react";
import { auth } from "../../firebase.js";
import Header from "../Header.jsx";

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
            <p>Ingresa la información para registrar un nuevo usuario con el rol de vendedor</p>
            <section className="md:max-w-[70%] mx-auto mt-2">
                <div>
                    <label className="sub-label">Correo electrónico</label>
                    <input
                        // placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                        className="input-style block w-full"
                    />
                </div>
                <div>
                    <label className="sub-label">Contraseña</label>
                    <input
                        // placeholder="Password"
                        onChange={e => setPassword(e.target.value)}
                        className="input-style block w-full"
                    />
                </div>
                <button onClick={createUser} className="search-button w-full bg-cyan-900/70 hover:bg-cyan-900/80">Crear usuario</button>
            </section>
        </>
    );
}
