export default function ButtonToTop() {
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed animate-bounce bottom-4 md:bottom-6 right-4 md:right-6 bg-cyan-600 text-white p-3 rounded-full shadow-lg hover:bg-cyan-700 transition">
            <svg className="w-5 md:w-6 h-5 md:h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 20L12 4M12 4L18 10M12 4L6 10"
                    stroke="#ffffff"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
    )
}