export default function ClienteInfoCard({ cliente }) {
    const rows = [
        { label: "Cédula", value: cliente.datosPersonales?.ci },
        { label: "Correo electrónico", value: cliente.datosContacto?.email },
        {
            label: "Teléfono",
            value: cliente.datosContacto?.telefono
                ? `+${cliente.datosContacto?.telefono}`
                : null
        },
        { label: "Fecha de reserva", value: cliente.datosAdicionales?.fechareserva }
    ].filter(row => row.value !== undefined && row.value !== null);

    return (
        <table className="w-full">
            <tbody>
                {rows.map((row) => (
                    <tr key={row.label} className="tr-cli-style">
                        <td className="sub-label">{row.label}</td>
                        <td>{row.value}</td>
                    </tr>
                ))}
            </tbody>
        </table >
    )
}
