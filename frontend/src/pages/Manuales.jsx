import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import { auth } from "../firebase";
import Spinner from "../components/feedback/Spinner";

export default function Manuales() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                // Obtener token del usuario autenticado
                const user = auth.currentUser;
                if (!user) {
                    return setError("Usuario no autenticado. Por favor, inicie sesión.");
                }

                const token = await user.getIdToken();

                const res = await fetch(`${backendUrl}/api/documents`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();
                setDocuments(data);
            } catch (error) {
                setError("Error al cargar los documentos");
            } finally {
                setLoading(false);
            }
        };
        fetchDocuments();
    }, [])
    return (
        <>
            <Header title="Manuales de Procedimientos" />
            {loading && <Spinner overlay />}

            <section className="max-w-3xl mx-auto px-4">
                <ul className="space-y-5">
                    {documents
                        .filter(doc => doc.category === "Manual" || !doc.category)
                        .map(doc => (
                            <li key={doc.id} className="card-list">
                                <div className="flex flex-col gap-1">
                                    <p className="md-label">
                                        {doc.title}
                                    </p>
                                    <span className="content-badge text-sm audio">
                                        {doc.type}
                                    </span>
                                </div>
                                <a
                                    href={doc.content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="search-button"
                                >
                                    Ver
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </section>
        </>
    )
}
