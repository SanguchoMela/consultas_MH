function ErrorCard({errorMessage}) {
    if (!errorMessage) return null
    return (
        <div class="error-card" role="alert">
            <p class="block sm:inline">{errorMessage}</p>
        </div>
    )
}

export default ErrorCard