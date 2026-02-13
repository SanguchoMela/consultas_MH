function ErrorCard({errorMessage}) {
    if (!errorMessage) return null
    return (
        <div className="error-card mb-3 whitespace-pre-line" role="alert">
            <p className="block sm:inline">{errorMessage}</p>
        </div>
    )
}

export default ErrorCard