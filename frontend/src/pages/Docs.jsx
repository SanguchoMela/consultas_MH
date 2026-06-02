import { useEffect, useState } from "react";
import { auth } from "../firebase";
import Header from "../components/layout/Header";

export default function Docs() {
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
            <Header title="Documentos Importantes" />

            <section className="max-w-3xl mx-auto px-4 py-5 border-b border-cyan-900">
                <p className="font-semibold text-lg mb-2 text-cyan-900">Formularios para reserva de lotes</p>
                <ul className="space-y-5">
                    {documents
                        .filter(doc => doc.category === "Form" || !doc.category)
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
                                    Ver documento
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </section>

            <section className="max-w-3xl mx-auto px-4 py-5">
                <p className="font-semibold text-lg mb-2 text-cyan-900">Documentos Variados</p>
                <ul className="space-y-5">
                    {documents
                        .filter(doc => doc.category === "Document" || !doc.category)
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
                                    Ver documento
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </section>
        </>
    );
}
