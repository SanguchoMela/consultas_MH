const ClienteInfoCard = ({ cliente }) => {
    return (
        <table className="w-full">
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
                    <td>+{cliente.datosContacto.telefono}</td>
                </tr>
                <tr className="tr-cli-style">
                    <td className="sub-label">Fecha del apartado</td>
                    <td>{cliente.datosAdicionales.fechaapartado}</td>
                </tr>
            </tbody>
        </table >
    )
}

export default ClienteInfoCard