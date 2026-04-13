import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import useTranslatedRole from "../hooks/useTranslatedRole";
import Spinner from "../components/feedback/Spinner";

export default function Dashboard() {
    const role = useTranslatedRole();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({
        name: "",
        role: ""
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserData = localStorage.getItem("userData");
            if (storedUserData) {
                setUserData(JSON.parse(storedUserData));
                setLoading(false);
            } else {
                const user = auth.currentUser;

                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setUserData(data);
                        localStorage.setItem("userData", JSON.stringify(data));
                    } else {
                        console.log("No existe el documento del usuario");
                    }
                }
            }
            setLoading(false);
        }
        fetchUserData();
    }, [])

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
                        {loading ? (
                            <Spinner size="sm" color="text-white" />
                        ) : (
                            <div className="space-y-1">
                                <p className="text-lg font-semibold">{userData.name || "Usuario"}</p>
                                <p className="text-sm text-gray-200">{role || ""}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <h2 className="label my-4">Accesos rápidos</h2>
                <div>

                </div>
            </div>
        </section>
    )
}