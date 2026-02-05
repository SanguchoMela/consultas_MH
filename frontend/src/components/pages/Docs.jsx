import Header from "../layout/Header";

export default function Docs() {
    return (
        <>
            <Header title="Documentos Importantes" />

            <section className="max-w-3xl mx-auto px-4">
                <ul className="space-y-5">
                    <li className="card-list">
                        <p className="md-label">
                            Aprobación definitiva Manta Hills
                        </p>
                        <a
                            href="https://drive.google.com/file/d/1goDgP2VDhq5GtNEptNWUvTsXQOxzKtHO/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="search-button"
                        >
                            Ver documento
                        </a>
                    </li>

                    <li className="card-list">
                        <p className="md-label">
                            Plano I Etapa – Manta Hills
                        </p>
                        <a
                            href="https://drive.google.com/file/d/1Lq9EmONrGjuzsS4HUrZ6n3HEDLPN5_ti/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="search-button"
                        >
                            Ver documento
                        </a>
                    </li>
                </ul>
            </section>
        </>
    );
}
