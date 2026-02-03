import Header from "../Header";

export default function Manuales() {
    return (
        <>
            <Header title="Manuales de Procedimientos" />
            <section className="flex flex-col">
                <ul className="space-y-5">
                    <li className="flex items-center space-x-8">
                        <p>Manual de Ventas - Resumen Ejecutivo</p>
                        <a href="https://drive.google.com/file/d/10_6quBeMWX_RngzslulVIk-_au0lqtG0/view?usp=sharing" target="_blank" className="px-3 py-2 shadow-sm rounded-lg bg-cyan-900/20 hover:bg-cyan-900/30 text-gray-900 font-medium">
                            Ver
                        </a>
                    </li>
                    <li className="flex items-center space-x-8">
                        <p>ADARA - Manual Vendedores</p>
                        <a href="https://drive.google.com/file/d/1tDMimqdeFi9utXw5F-Fl1xY_jQEQO70I/view?usp=sharing" target="_blank" className="px-3 py-2 shadow-sm rounded-lg bg-cyan-900/20 hover:bg-cyan-900/30 text-gray-900 font-medium">
                            Ver
                        </a>
                    </li>
                    <li className="flex items-center space-x-8">
                        <p>HABITANTO - Guía de inicio rápido</p>
                        <a href="https://drive.google.com/file/d/1nz65HkvqZ7ZPzIYm0eGIfI73vv6df-y7/view?usp=sharing" target="_blank" className="px-3 py-2 shadow-sm rounded-lg bg-cyan-900/20 hover:bg-cyan-900/30 text-gray-900 font-medium">
                            Ver
                        </a>
                    </li>
                </ul>
            </section>
        </>
    )
}