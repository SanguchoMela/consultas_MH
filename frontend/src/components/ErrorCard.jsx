function ErrorCard({errorMessage}) {
    return (
        <div class=" text-center lg:max-w-[50%] md:max-w-[70%] max-w-[90%] w-full mx-auto bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded" role="alert">
            <p class="block sm:inline">{errorMessage}</p>
        </div>
    )
}

export default ErrorCard