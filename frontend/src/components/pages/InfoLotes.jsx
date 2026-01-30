import { useState, useRef, useEffect } from "react";
import Footer from "../Footer"
import Spinner from "../Spinner";
import ErrorCard from "../ErrorCard";
import ButtonToTop from "../ButtonToTop";
import LoteCard from "../LoteCard";
import ClienteInfoCard from "../ClienteInfoCard";
import Header from "../Header";
import { useAuth } from "../../context/authContext";
import ConsultaClientesV from "../ui/ConsultaClientesV";
import ConsultaClientesAd from "../ui/ConsultaClientesAd";

const InfoLotes = () => {
  const { role } = useAuth()
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)
  const resultsRef = useRef(null)
  const [showTop, setShowTop] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const infoDate = import.meta.env.VITE_INFO_DATE

  const showLoading = () => setLoading(true)
  const hideLoading = () => setLoading(false)

  const showError = (message) => {
    setError(message);
    setResultados([]);
    hideLoading()
  }

  const refScroll = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }, 200)
  }

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col">
      <Header title="Consulta de Clientes" />
      <main className="grow">
        {(role === "admin") ? (
          <>
            <p className="md:text-right text-center md:pr-2 md:pb-3">
              Información hasta: <strong>{infoDate}</strong>
            </p>
            <ConsultaClientesAd />
          </>
        ) : (
          <ConsultaClientesV />
        )}

        {/* {showTop && (<ButtonToTop />)} */}
      </main>
    </div>
  );
};

export default InfoLotes;