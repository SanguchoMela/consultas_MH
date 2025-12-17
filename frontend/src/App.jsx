import { useState } from "react";
import "./App.css";
// import { set } from "mongoose";

function App() {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [lote, setLote] = useState("");  // Estado para lote
  const [manzana, setManzana] = useState("");  // Estado para manzana
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const showError = (message) => {
    setError(message);
    setResultados([]);
  }

  // Función para buscar clientes automáticamente por cédula o nombre
  const buscarClienteAuto = async () => {
    setError(null);

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

      if (!res.ok) return showError(data.error || "Error en la búsqueda")


      if (!data.length) return showError("No se encontró información del cliente");

      setResultados(data);
    } catch (error) {
      console.error(error);
      showError("Error en conexión con el servidor");
    }
  }

  // Función para buscar lotes por manzana y lote
  const buscarLote = async () => {
    setError(null);

    const lt = lote.trim();
    const mz = manzana.trim();

    if (!lt || !mz) return showError("Ingrese el lote y la manzana");

    try {
      const res = await fetch(`${backendUrl}/buscar-lote?lote=${lote}&manzana=${manzana}`);
      const data = await res.json();

      // Verificar si la respuesta es exitosa (status 200)
      if (!res.ok) return showError(data.error || "Error en la búsqueda")


      if (!data.length) return showError("No se encontró información del lote");

      setResultados(data);
    } catch (err) {
      showError("Error en conexión con el servidor");
      console.error(err)
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center lg:my-6 my-4 space-y-3">
        <img src="/mh.png" alt="Logo de Manta Hills" className="lg:h-28 md:h-24 h-20" />
        {/* <h1 className="text-3xl font-bold mb-4">Manta Hills</h1> */}
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-8 lg:m-7 m-5">
        {/* Inputs para buscar clientes */}
        <div className="flex flex-col space-y-1 min-w-[42%]">
          <label className="label">Búsqueda por cliente</label>
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
            className="bg-cyan-600 text-white font-medium mt-3 px-5 py-2 rounded hover:bg-cyan-700"
          >
            Buscar Cliente
          </button>
        </div>

        {/* Inputs para buscar manzana y lote */}
        <div className="flex flex-col space-y-1 min-w-[42%]">
          <label className="label">Búsqueda por lote</label>
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
            className="bg-lime-600 text-white font-medium mt-3 px-5 py-2 rounded hover:bg-lime-700"
          >
            Buscar Lote
          </button>
        </div>
      </div>

      {/* Mostrar mensaje de error */}
      {error && <p className="text-red-600 mt-12 text-center">{error}</p>}

      {/* RESULTADOS */}
      <section className="m-3 sm:m-4 md:m-5 lg:m-7">
        {Array.isArray(resultados) && resultados.length > 0 ? (
          resultados.map((cliente) => (
            <details key={cliente._id} className="lg:p-8 md:p-6 p-4 bg-white shadow rounded">
              <summary className="cursor-pointer list-none flex justify-between items-center pb-2 border-b border-cyan-700/50">
                <h2 className="text-xl font-semibold text-center md:text-left">
                  {cliente.datosPersonales.nombrecliente}
                </h2>
                <span className="transition-transform group-open:rotate-180">                  
                  <svg width="7vw" height="5vh" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z" fill="#005f78" />
                  </svg>
                </span>
              </summary>

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
              <h3 className="text-lg font-semibold mt-3">Lotes</h3>
              {/* <div className="grid gap-4 lg:gap-7 lg:grid-cols-2"> */}
              <div className={`grid gap-4 lg:gap-7 ${cliente.lotes.length === 1 ? 'place-items-center' : 'lg:grid-cols-2'
                }`}>
                {cliente.lotes.length === 0 ? (
                  <p>Sin lotes asociados</p>
                ) : (
                  cliente.lotes.map((lote) => (
                    <div key={lote._id} className={`border border-cyan-700 p-4 rounded mt-2 w-full
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
    </div>
  );
}

export default App;
