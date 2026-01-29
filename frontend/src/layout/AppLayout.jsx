import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex flex-col flex-1 max-h-screen">
                <main className="flex-1 w-full px-6 pt-16 md:p-8 overflow-y-scroll">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
