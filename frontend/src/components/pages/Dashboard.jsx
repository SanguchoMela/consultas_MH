import { useAuth } from "../../context/authContext.jsx";
import Header from "../Header.jsx";

export default function Dashboard() {
  const { role } = useAuth();

  return (
    <>
      <Header title="Panel de Inicio" />
      <section className="flex justify-center">
        <p>Página en construcción</p>
      </section>
    </>
  );
}
