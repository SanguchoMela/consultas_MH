import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <section className="h-screen flex flex-col items-center justify-center p-8 space-y-4">
            <h1 className="font-extrabold text-9xl text-cyan-900">
                <span className="sr-only">Error</span>404</h1>
            <p className="text-2xl font-bold text-cyan-900/80">Página No Encontrada</p>
            <p className="text-gray-700">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
            <Link to="/inicio" className=" search-button bg-cyan-900">Volver a la página de inicio</Link>
        </section>
    )
}