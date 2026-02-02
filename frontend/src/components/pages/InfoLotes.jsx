import Header from "../Header";
import { useAuth } from "../../context/authContext";
import ConsultaClientesV from "../ui/ConsultaClientesV";
import ConsultaClientesAd from "../ui/ConsultaClientesAd";

const InfoLotes = () => {
  const { role } = useAuth()
  const infoDate = import.meta.env.VITE_INFO_DATE
  const textInst = "Ingresa el nombre o número de cédula del cliente para ver el lote correspondiente"

  return (
    <div className="flex flex-col">
      <Header title="Consulta de Clientes" />
      <main className="grow">
        {(role === "admin") ? (
          <>
            <p className="mb-2">{textInst}</p>
            <p className="md:text-right text-center md:pr-2 md:pb-3">
              Información hasta: <strong>{infoDate}</strong>
            </p>
            <ConsultaClientesAd />
          </>
        ) : (
          <>
            <p className="mb-2">{textInst}</p>
            <ConsultaClientesV />
          </>
        )}
      </main>
    </div>
  );
};

export default InfoLotes;