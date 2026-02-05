import Header from "../layout/Header";

export default function Manuales() {
    return (
        <>
            <Header title="Manuales de Procedimientos" />
            <section className="max-w-3xl mx-auto px-4">
                <ul className="space-y-5">
                    <li className="card-list">
                        <div className="flex flex-col gap-1">
                            <p className="md-label">
                                ADARA - Manual Vendedores
                            </p>
                            <span className="content-badge text-sm audio">
                                Video
                            </span>
                        </div>
                        <a
                            href="https://drive.google.com/file/d/1tDMimqdeFi9utXw5F-Fl1xY_jQEQO70I/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="search-button text-center">
                            Ver
                        </a>
                    </li>
                    <li className="card-list">
                        <div className="flex flex-col gap-1">
                            <p className="md-label">
                                Manual de Ventas - Resumen Ejecutivo
                            </p>
                            <span className="content-badge text-sm audio">
                                Audio
                            </span>
                        </div>
                        <a
                            href="https://drive.google.com/file/d/10_6quBeMWX_RngzslulVIk-_au0lqtG0/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="search-button text-center">
                            Escuchar
                        </a>
                    </li>
                    <li className="card-list">
                        <div className="flex flex-col gap-1">
                            <p className="md-label">
                                HABITANTO - Guía de inicio rápido
                            </p>
                            <span className="content-badge text-sm audio">
                                Audio
                            </span>
                        </div>
                        <a
                            href="https://drive.google.com/file/d/1nz65HkvqZ7ZPzIYm0eGIfI73vv6df-y7/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="search-button text-center">
                            Escuchar
                        </a>
                    </li>
                </ul>
            </section>
        </>
    )
}