function Footer() {
    return (
        <footer className="border-t border-cyan-900/10 md:mt-0 mt-4">
            <div className="text-xs font-thin max-w-7xl mx-auto text-center p-2">
                <p className="text-gray-600">
                    © {new Date().getFullYear()} Manta Hills - ms. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
