export default function Header({title}) {
    return (
        <header className="border-b border-cyan-900/10 mb-3">
            <p className="text-xl text-cyan-900 font-medium mb-1">{title}</p>            
        </header>
    )
}