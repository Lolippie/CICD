import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = '82702b83a1d67b8c64c505e70ed838f3'

if (!apiKey) {
  console.error('Clé API TMDB manquante')
  process.exit(1)
}

const outputPath = path.resolve('public/movies.json')

const moviesToFetch = [
  "The Godfather", "The Dark Knight", "Pulp Fiction", "Forrest Gump", "Inception", "Fight Club", "The Matrix", "The Empire Strikes Back", "The Lord of the Rings: The Fellowship of the Ring", "The Lord of the Rings: The Two Towers", "The Lord of the Rings: The Return of the King", "The Silence of the Lambs", "Se7en", "Saving Private Ryan", "Jurassic Park", "The Prestige", "Parasite", "Joker", "Avengers: Infinity War", "Avengers: Endgame", "The Wolf of Wall Street", "Mad Max: Fury Road", "Blade Runner 2049", "The Truman Show", "WALL·E", "Shrek", "Pirates of the Caribbean", "Harry Potter and the Philosopher's Stone", "Harry Potter and the Prisoner of Azkaban", "Batman Begins", "Iron Man", "Doctor Strange", "Black Panther", "Dune", "The Big Lebowski", "Casino Royale", "Mission: Impossible – Fallout", "Heat", "Scarface", "The Usual Suspects", "Alien", "Blade Runner", "Rocky", "Terminator 2", "Back to the Future", "Jaws", "Die Hard", "The Terminator",
]

async function fetchMovie(title) {
  const url =
    'https://api.themoviedb.org/3/search/movie' +
    '?api_key=' + apiKey +
    '&query=' + encodeURIComponent(title)

  const response = await fetch(url)
  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    console.warn('Aucun résultat pour', title)
    return null
  }

  const movie = data.results[0]

  return {
    title: movie.title,
    year: movie.release_date
      ? Number(movie.release_date.split('-')[0])
      : null,
    rating: movie.vote_average,
    overview: movie.overview,
    posterPath: movie.poster_path
  }
}

async function run() {
  const results = []

  for (const title of moviesToFetch) {
    console.log('Récupération de', title)
    const movie = await fetchMovie(title)

    if (movie) {
      results.push(movie)
    }
  }

  fs.writeFileSync(
    outputPath,
    JSON.stringify(results, null, 2),
    'utf-8'
  )

  console.log('Fichier movies.json généré avec succès')
}

run()
