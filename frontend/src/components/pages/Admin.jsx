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
            <section>
                <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
                <input
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={createUser}>Crear usuario</button>
            </section>
        </>
    );
}
