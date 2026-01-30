import Header from "../Header";

export default function Docs() {
    return (
        <>
            <Header title="Documentos Importantes" />
            <section className="flex flex-col">
                <ul className="space-y-5">
                    <li className="flex items-center space-x-8">
                        <p>Aprobación definitiva Manta Hills</p>
                        <a href="https://drive.google.com/file/d/1goDgP2VDhq5GtNEptNWUvTsXQOxzKtHO/view?usp=sharing" target="_blank" className="px-3 py-2 shadow-sm rounded-lg bg-cyan-900/20 hover:bg-cyan-900/30 text-gray-900 font-medium">
                            Ver
                        </a>
                    </li>
                    <li className="flex items-center space-x-8">
                        <p>Plano I Etapa - Manta Hills</p>
                        <a href="https://drive.google.com/file/d/1Lq9EmONrGjuzsS4HUrZ6n3HEDLPN5_ti/view?usp=sharing" target="_blank" className="px-3 py-2 shadow-sm rounded-lg bg-cyan-900/20 hover:bg-cyan-900/30 text-gray-900 font-medium">
                            Ver
                        </a>
                    </li>
                </ul>
            </section>
        </>
    )
}