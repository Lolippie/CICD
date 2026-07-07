export function fetchMovies() {
    return fetch('/api/movies')
    .then(response => { return response.json() })
    .catch(error => {
        console.error(error)
        throw new Error('Impossible de charger les films depuis l\'API')
    })
}

// Appel direct à TMDB depuis le navigateur : la clé part a chaque requête,
// et se retrouve en clair dans le bundle buildé (dist/assets/*.js) et le Network tab.
export function fetchMovieDetailsFromTMDB(title) {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY

    const url =
        `https://api.themoviedb.org/3/search/movie` +
        `?api_key=${  apiKey 
        }&query=${  encodeURIComponent(title)}`

    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error(error)
            throw new Error('Impossible de récupérer les détails TMDB')
        })
}
