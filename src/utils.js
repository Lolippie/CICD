const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export function sortByYearAsc(movies) {
  return [...movies].sort((a, b) => a.year - b.year)
}

export function buildPosterUrl(posterPath) {
  return TMDB_IMAGE_BASE_URL + posterPath
}
