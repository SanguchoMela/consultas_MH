import { useState } from "react";
import useTranslatedRole from "../hooks/useTranslatedRole";
import Header from "../components/layout/Header";
import { useAuth } from "../context/authContext";

export default function Dashboard() {
    const { user } = useAuth()
    const role = useTranslatedRole();

    return (
        <section>
            <div className="relative h-72 rounded-lg overflow-hidden shadow-lg">
                {/* Imagen fondo */}
                <div className="absolute inset-0 bg-[url('/fondo3.jpg')] bg-cover bg-center" />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />
                {/* Contenido */}
                <div className="relative z-10 flex flex-col justify-center h-full text-white px-10">
                    <h1 className="text-4xl font-semibold mb-2">Manta Hills</h1>
                    <p className="text-lg italic mb-6">Construye tu futuro, invierte en tu familia</p>
                    <div className="bg-white/10 backdrop-blur-lg p-4 rounded-xl w-fit space-y-1">
                        <p className="text-sm text-gray-300">Bienvenido/a</p>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold">{user?.displayName || "Usuario"}</p>
                            <p className="text-sm text-gray-200">{role || ""}</p>
                        </div>
                    </div>
                </div>
            </div>
            <section className="mt-3">
                <Header title="Accesos rápidos" />
                <h3 className="label">Resumen de resultados</h3>
                <p className="italic">Accede a los documentos de Google Sheets para registrar las novedades</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                        href="https://docs.google.com/spreadsheets/d/1sSrx3EoR76xyCFJ4WrMFs8DOKmvgHWjYbnbAtRdxdc4/edit?usp=sharing"
                        target="_blank"
                        className="search-button"
                    >
                        Avances Cartera Vencida
                    </a>
                    <a
                        href="https://docs.google.com/spreadsheets/d/1PhkKi5G494j9HNECoKvvshYK8zq6P9sbWXIIUOH_OzQ/edit?usp=sharing"
                        target="_blank"
                        className="search-button"
                    >
                        Control de visitas semanal
                    </a>

                </div>
            </section>

        </section>
    )
}