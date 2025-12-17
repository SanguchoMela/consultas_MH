function Footer() {
    return (
        <footer className="border-t border-gray-200 md:mt-0 mt-4">
            <div className="text-sm max-w-7xl mx-auto text-center md:p-5 p-3">
                <p className="text-gray-600">
                    © {new Date().getFullYear()} Manta Hills. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
