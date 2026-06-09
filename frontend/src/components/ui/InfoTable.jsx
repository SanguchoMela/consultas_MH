export default function InfoTable({ rows }) {
    return (
        <table className="w-full">
            <tbody>
                {rows.map((row) => (
                    <tr key={row.label} className="tr-style">
                        <td className="sub-label">{row.label}</td>
                        <td className={row.className || ""}>
                            {row.value}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}