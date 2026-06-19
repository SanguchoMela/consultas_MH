import Header from "../components/layout/Header";
import { useAuth } from "../context/authContext";
import ClientesCard from "../components/ui/ClientesCard";

export default function InfoLotes() {
  const { role } = useAuth()
  const infoDate = import.meta.env.VITE_INFO_DATE
  const textInst = "Ingresa el nombre o número de cédula del cliente para ver el lote correspondiente"

  return (
    <div className="flex flex-col">
      <Header title="Consulta de Clientes" />
      <main className="grow">
        <p className="mb-2">{textInst}</p>
        <ClientesCard />
      </main>
    </div>
  );
};
