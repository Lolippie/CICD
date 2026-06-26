import './style.css'
import { fetchMovies } from './fetch.js'
import { sortByYearAsc, buildPosterUrl } from './utils.js'

console.log('movieJS ready')

// const apiKey = import.meta.env.VITE_TMDB_API_KEY

const grid = document.querySelector('[data-grid]')
const cardsContainer = document.querySelector('[data-catalog]')
const tableContainer = document.querySelector('[data-table]')
const viewButtons = document.querySelectorAll('[data-view]')
const count = document.querySelector('[data-count]')
const emptyState = document.querySelector('[data-empty]')
const template = document.querySelector('#cardTemplate')
const minRatingSelect = document.querySelector('[data-filter-min-rating]')
const sortSelect = document.querySelector('[data-sort]')

minRatingSelect.addEventListener('change', applyFilters)
sortSelect.addEventListener('change', applyFilters)

let movies = []
let currentMovies = []

for (const button of viewButtons) {
    button.addEventListener('click', () => {
        const view = button.dataset.view
        console.log(view)
        setView(view)
    })
}

fetchMovies()
    .then(data => {
        movies = formateMoviesData(data)
        displayMovies(movies)
        displayMoviesTable(movies)
        setView('cards')
    })


function displayMovies(movies) {
    grid.innerHTML = ''

    if (movies.length === 0) {
        emptyState.hidden = false
        count.textContent = '0 titre'
        return
    }

    emptyState.hidden = true
    count.textContent = movies.length + ' titres'

    for (const movie of movies) {
        const card = createMovieCard(movie)
        grid.appendChild(card)
    }
}

function createMovieCard(movie) {
    const clone = template.content.cloneNode(true)

    const title = clone.querySelector('[data-title]')
    const year = clone.querySelector('[data-year]')
    const rating = clone.querySelector('[data-rating]')
    const image = clone.querySelector('[data-image]')
    const overview = clone.querySelector('[data-overview]')

    title.textContent = movie.title
    year.textContent = movie.year
    rating.textContent = movie.rating
    overview.textContent = movie.overview.slice(0, 100) + '...'
    image.src = buildPosterUrl(movie.posterPath)

    return clone
}

function formateMoviesData(movies) {
    // for (const movie of movies) {
    //     movie.title = movie.title.charAt(0).toUpperCase() + movie.title.slice(1)

    //     const date = new Date(movie.releaseDate)
    //     movie.year = date.getFullYear()
    //     movie.dateLong = date.toLocaleDateString('fr-FR', {
    //             day: 'numeric',
    //             month: 'long',
    //             year: 'numeric'
    //         })

    //     movie.shortOverview = movie.overview.slice(0, 60) + "..."
    //     movie.ratingRounded = movie.rating.toFixed(1)
    // }

    return movies.map(movie => {
        const date = new Date(movie.year.toString())

        if (movie.overview.toLowerCase().includes("space")) {
            movie.category = "Science-Fiction"
        }
        // movie.isClassicTitle = movie.title.startsWith("The")
        // movie.hasProperEnding = movie.overview.endsWith(".")

        let newTitle = movie.title.trim()
        newTitle = movie.title.charAt(0).toUpperCase() + movie.title.slice(1)

        let resume = movie.overview.replace("men", "friends").slice(0, 60) + "..."


        return {
            ...movie,
            title: newTitle,
            year: date.getFullYear(),
            shortOverview: resume,
            ratingRounded: movie.rating.toFixed(1),
            isClassicTitle: movie.title.startsWith("The"),
            hasProperEnding: movie.overview.endsWith("."),
            category: movie.overview.toLowerCase().includes("space") ? "Science-Fiction" : "Other",

        }
    })
}

function displayMoviesTable(movies) {
    const container = document.querySelector('[data-table-container]')
    container.innerHTML = ''

    if (movies.length === 0) {
        container.textContent = 'Aucun film disponible'
        return
    }

    const table = document.createElement('table')
    table.border = '1'
    table.style.borderCollapse = 'collapse'
    table.style.width = '100%'

    // Création du header
    const thead = document.createElement('thead')
    const headerRow = document.createElement('tr')
    const headers = [
        { label: 'Titre', key: 'title' },
        { label: 'Année', key: 'year' },
        { label: 'Note', key: 'rating' }
    ]

    for (const header of headers) {
        const th = document.createElement('th')
        th.textContent = header.label
        th.style.cursor = 'pointer'
        th.style.padding = '8px'
        headerRow.appendChild(th)
    }

    thead.appendChild(headerRow)
    table.appendChild(thead)

    // Création du body
    const tbody = document.createElement('tbody')

    for (const movie of movies) {
        for (let [key, value] of Object.entries(movie)) {
            console.log(key, ':', value);
        }

        const row = document.createElement('tr')

        const titleCell = document.createElement('td')
        titleCell.textContent = movie.title

        const yearCell = document.createElement('td')
        yearCell.textContent = movie.year

        const ratingCell = document.createElement('td')
        ratingCell.textContent = movie.ratingRounded

        row.appendChild(titleCell)
        row.appendChild(yearCell)
        row.appendChild(ratingCell)
        tbody.appendChild(row)
    }

    table.appendChild(tbody)
    container.appendChild(table)
}

function sortMovies(array) {
    const sortValue = sortSelect.value
    const sorted = [...array]

    if (sortValue === 'rating_desc') {
        sorted.sort((a, b) => b.rating - a.rating)
    }

    if (sortValue === 'rating_asc') {
        sorted.sort((a, b) => a.rating - b.rating)
    }

    if (sortValue === 'year_desc') {
        sorted.sort((a, b) => b.year - a.year)
    }

    if (sortValue === 'year_asc') {
        return sortByYearAsc(array)
    }

    if (sortValue === 'title_asc') {
        sorted.sort((a, b) => a.title.localeCompare(b.title))
    }

    if (sortValue === 'title_desc') {
        sorted.sort((a, b) => b.title.localeCompare(a.title))
    }

    return sorted
}

function applyFilters() {
    const minRating = Number(minRatingSelect.value)

    let filtered = [...movies]
    filtered = filtered.filter(movie => {
        return movie.rating >= minRating
    })

    filtered = sortMovies(filtered)
    currentMovies = filtered
    displayMovies(currentMovies)
    displayMoviesTable(currentMovies)
}

function setView(view) {

    if (view === 'cards') {
        cardsContainer.hidden = false
        tableContainer.hidden = true
    }

    if (view === 'table') {
        cardsContainer.hidden = true
        tableContainer.hidden = false
    }

    updateActiveButton(view)
}

function updateActiveButton(activeView) {
    for (const button of viewButtons) {
        if (button.dataset.view === activeView) {
            button.classList.remove('btn--ghost')
            button.classList.add('btn--primary')
        } else {
            button.classList.remove('btn--primary')
            button.classList.add('btn--ghost')
        }

    }
}