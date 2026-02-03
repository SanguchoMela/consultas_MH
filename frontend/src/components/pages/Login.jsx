import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {user, loading} = useAuth()
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  useEffect(() => {
    if(!loading && user){
      navigate("/lotes")
    }
  }, [user, loading, navigate])

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-1/2 hidden lg:block h-screen">
        <img src="/mh-bg.png" alt="Manta Hills Fondo" className="w-full h-full object-cover" />
      </div>
      <div className="w-full lg:w-1/2 lg:p-36 md:p-52 p-8 items-center">
        <div className="w-full flex justify-center">
          <img src="/mh.png" alt="Manta Hills Logo" className="w-48 lg:hidden mb-5" />
        </div>
        <form onSubmit={handleLogin} className="space-y-3">
          <h2 className="label text-center">Iniciar sesión</h2>
          <div>
            <label htmlFor="email" className="sub-label">Usuario</label>
            <input
              type="email"
              onChange={e => setEmail(e.target.value)}
              className="input-style block w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="sub-label">Contraseña</label>
            <input
              type="password"
              onChange={e => setPassword(e.target.value)}
              className="input-style block w-full"
            />
          </div>
          <button className="search-button w-full bg-cyan-900 hover:bg-cyan-800">Iniciar Sesión</button>
        </form>

      </div>
    </div>
  );
}
