export function fetchMovies() {
    return fetch('/api/movies')
    .then(response => { return response.json() })
    .catch(error => {
        console.error(error)
        throw new Error('Impossible de charger les films depuis l\'API')
    })
}
