import { useState } from "react";
import "./App.css";
import Footer from "./components/Footer"
import Spinner from "./components/Spinner";
import ErrorCard from "./components/ErrorCard";

function App() {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [lote, setLote] = useState("");  // Estado para lote
  const [manzana, setManzana] = useState("");  // Estado para manzana
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const infoDate = import.meta.env.VITE_INFO_DATE

  const showLoading = () => setLoading(true)
  const hideLoading = () => setLoading(false)

  const showError = (message) => {
    setError(message);
    setResultados([]);
    hideLoading()
  }

  // Función para buscar clientes automáticamente por cédula o nombre
  const buscarClienteAuto = async () => {
    setError(null);
    showLoading()

    const ci = cedula.trim();
    const nom = nombre.trim();

    if (!ci && !nom) return showError("Ingrese la cédula o el nombre del cliente");

    // Priorizar búsqueda por cédula si ambos campos están llenos
    let url = "";

    if (ci) {
      url = `${backendUrl}/buscar-cedula?cedula=${ci}`;
    } else {
      url = `${backendUrl}/buscar-nombre?nombre=${nom}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      hideLoading()

      if (!res.ok) return showError(data.error || "Error en la búsqueda")


      if (!data.length) return showError("No se encontró información del cliente");

      setResultados(data);
    } catch (error) {
      hideLoading()
      console.error(error);
      showError("Error en conexión con el servidor");
    }
  }

  // Función para buscar lotes por manzana y lote
  const buscarLote = async () => {
    setError(null);
    showLoading()

    const lt = lote.trim();
    const mz = manzana.trim();

    if (!lt || !mz) return showError("Ingrese el lote y la manzana");

    try {
      const res = await fetch(`${backendUrl}/buscar-lote?lote=${lote}&manzana=${manzana}`);
      const data = await res.json();
      hideLoading()

      // Verificar si la respuesta es exitosa (status 200)
      if (!res.ok) return showError(data.error || "Error en la búsqueda")


      if (!data.length) return showError("No se encontró información del lote");

      setResultados(data);
    } catch (err) {
      hideLoading()
      console.error(err)
      showError("Error en conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">
        <p className="md:text-right text-center md:pr-8 pt-2">
          Información hasta: {infoDate}
        </p>
        <div className="flex flex-col items-center lg:my-6 my-4 space-y-3">
          <img src="/mh.png" alt="Logo de Manta Hills" className="lg:h-28 md:h-24 h-20" />
          {/* <h1 className="text-3xl font-bold mb-4">Manta Hills</h1> */}
        </div>

        {/* Mostrar mensaje de error */}
        {error && <ErrorCard errorMessage={error} />}

        {/* BUSCADOR */}
        <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-8 gap-4 lg:m-7 m-5">
          {/* BUSCAR CLIENTE */}
          <div className="card-search">
            <h2 className="label text-cyan-700">🔍 Búsqueda por cliente</h2>
            <div className="flex flex-col">
              <label className="sub-label">Cédula</label>
              <input
                type="text"
                placeholder="Ej. 1723456789"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="input-style"
              />
            </div>
            <div className="flex flex-col">
              <label className="sub-label">Nombre</label>
              <input
                type="text"
                placeholder="Ej. Juan Perez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="input-style"
              />
            </div>
            <button
              onClick={buscarClienteAuto}
              className="search-button bg-cyan-600 hover:bg-cyan-700"
            >
              Buscar Cliente
            </button>
          </div>

          {/* BUSCAR LOTE */}
          <div className="card-search">
            <h2 className="label text-lime-700">🧱 Búsqueda por lote</h2>
            {/* <div className=""> */}
            <div className="flex flex-col ">
              <label className="sub-label">Lote</label>
              <input
                type="text"
                placeholder="Ej. 1"
                value={lote}
                onChange={(e) => setLote(e.target.value)}
                className="input-style"
              />
            </div>
            <div className="flex flex-col">
              <label className="sub-label">Manzana</label>
              <input
                type="text"
                placeholder="Ej. A"
                value={manzana}
                onChange={(e) => setManzana(e.target.value)}
                className="input-style"
              />
            </div>
            {/* </div> */}
            <button
              onClick={buscarLote}
              className="search-button bg-lime-600 hover:bg-lime-700"
            >
              Buscar Lote
            </button>
          </div>
        </div>

        {/* Aviso de carga */}
        {loading && <Spinner />}

        {/* RESULTADOS */}
        <section className="m-3 sm:m-4 md:m-5 lg:m-7 space-y-3">
          {Array.isArray(resultados) && resultados.length > 0 ? (
            resultados.map((cliente) => (
              <details key={cliente._id} className="group lg:px-6 lg:py-4 md:px-5 p-3 rounded bg-white shadow shadow-cyan-900/70">
                <summary className="cursor-pointer list-none flex justify-between items-center">
                  <h2 className="lg:text-xl md:text-lg text-md font-semibold text-center md:text-left">
                    {cliente.datosPersonales.nombrecliente}
                  </h2>
                  <svg
                    className="w-7 h-7 transition-transform duration-500 group-open:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
                      fill="#005f78"
                    />
                  </svg>
                </summary>

                <hr className="text-cyan-700 mt-2" />
                {/* Datos del cliente */}
                <table className="w-full lg:max-w-[50%]">
                  <tbody>
                    <tr className="tr-cli-style">
                      <td className="sub-label">Cédula</td>
                      <td>{cliente.datosPersonales.ci}</td>
                    </tr>
                    <tr className="tr-cli-style">
                      <td className="sub-label">Correo electrónico</td>
                      <td>{cliente.datosContacto.email}</td>
                    </tr>
                    <tr className="tr-cli-style">
                      <td className="sub-label">Teléfono</td>
                      <td>{cliente.datosContacto.telefono}</td>
                    </tr>
                    <tr className="tr-cli-style">
                      <td className="sub-label">Fecha del apartado</td>
                      <td>{cliente.datosAdicionales.fechaapartado}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Lotes asociados al cliente */}
                <h3 className="text-lg font-semibold mt-3 mb-1">Lotes</h3>
                {/* <div className="grid gap-4 lg:gap-7 lg:grid-cols-2"> */}
                <div className={`grid gap-4 lg:gap-7 ${cliente.lotes.length === 1 ? 'place-items-center' : 'lg:grid-cols-2'
                  }`}>
                  {cliente.lotes.length === 0 ? (
                    <p>Sin lotes asociados</p>
                  ) : (
                    cliente.lotes.map((lote) => (
                      <div key={lote._id} className={`border border-cyan-700 p-4 rounded w-full
                      ${cliente.lotes.length === 1 ? 'lg:w-1/2' : ''} `}>
                        {/* Información del lote */}
                        <table className="w-full">
                          <caption className="caption-style">Información del lote</caption>
                          <tbody>
                            <tr className="grid sm:grid-cols-2 grid-cols-1 sm:gap-8 px-2 md:px-4">
                              {/* COLUMNA 1 */}
                              <td>
                                <table className="w-full">
                                  <tbody>
                                    <tr className="tr-style">
                                      <td className="sub-label">Etapa</td>
                                      <td>{lote.infoLote.etapa}</td>
                                    </tr>
                                    <tr className="tr-style">
                                      <td className="sub-label">Lote</td>
                                      <td>{lote.infoLote.lote}</td>
                                    </tr>
                                    <tr className="tr-style">
                                      <td className="sub-label">Manzana</td>
                                      <td>{lote.infoLote.manzana}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              {/* COLUMNA 2 */}
                              <td>
                                <table className="w-full">
                                  <tbody>
                                    <tr className="tr-style">
                                      <td className="sub-label">Área</td>
                                      <td>{lote.infoLote.area}</td>
                                    </tr>
                                    <tr className="tr-style">
                                      <td className="sub-label">Valor m²</td>
                                      <td>{lote.infoLote.valorm2}</td>
                                    </tr>
                                    <tr className="tr-style">
                                      <td className="sub-label">Valor total</td>
                                      <td>{lote.infoLote.valortotal}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* Estado de cuenta del lote */}
                        <table className="w-full mt-2">
                          <caption className="caption-style">Estado de Cuenta</caption>
                          <tbody>
                            <tr className="grid sm:grid-cols-2 grid-cols-1 sm:gap-8 sm:px-4">
                              <td>
                                <table className="w-full">
                                  <tbody>
                                    <tr className="tr-style">
                                      <td className="sub-label">Valor pagado</td>
                                      <td>{lote.estadoCuenta.valorpagado}</td>
                                    </tr>
                                    <tr className="tr-style">
                                      <td className="sub-label">Valor por pagar</td>
                                      <td>{lote.estadoCuenta.valorporpagar}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td>
                                <table className="w-full">
                                  <tbody>
                                    <tr className="tr-style">
                                      <td className="sub-label">Valor vigente</td>
                                      <td className="text-green-600">{lote.estadoCuenta.valorvigente}</td>
                                    </tr>
                                    <tr className="tr-style">
                                      <td className="sub-label">Valor vencido</td>
                                      <td className="text-red-600">{lote.estadoCuenta.valorvencido}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))
                  )}
                </div>
              </details >
            ))
          ) : (
            !error && (
              <p className="text-center mt-12">Haz una búsqueda.</p>
            )
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
