import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { buildPosterUrl } from '../../src/utils.js'
import { fetchMovies } from '../../src/fetch.js'

// ─────────────────────────────────────────────────────────────────────────────
// TEST FONCTIONNEL
// Teste le comportement d'une fonctionnalité (construction d'URL d'image, appel réseau).
// Contrairement au test unitaire, on peut ici tester des interactions :
//   - construction d'URL à partir de données
//   - appel fetch mocké (on simule la réponse réseau sans appel réel)
// ─────────────────────────────────────────────────────────────────────────────

describe('buildPosterUrl — construction de l\'URL d\'une affiche de film', () => {
  it('génère l\'URL complète à partir du chemin TMDB', () => {
    const posterPath = '/qJ2tW6WMUDux911r6m7haRef0WH.jpg'

    const url = buildPosterUrl(posterPath)

    expect(url).toBe('https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg')
  })

  it('préfixe toujours avec la base URL TMDB', () => {
    const url = buildPosterUrl('/mon-film.jpg')

    expect(url).toMatch(/^https:\/\/image\.tmdb\.org\/t\/p\/w500/)
  })

  it('concatène correctement le chemin sans doublon de slash', () => {
    // posterPath commence toujours par "/" dans l'API TMDB
    const url = buildPosterUrl('/abc.jpg')

    expect(url).not.toContain('w500//') // pas de double slash
  })
})

describe('fetchMovies — appel de l\'API de films', () => {
  beforeEach(() => {
    // On remplace la fonction globale "fetch" par un faux (mock)
    // pour ne pas déclencher un vrai appel réseau pendant les tests
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    // Restaure "fetch" à son état original après chaque test
    vi.unstubAllGlobals()
  })

  it('appelle le bon endpoint /api/movies', async () => {
    const mockFilms = [{ title: 'Inception', year: 2010 }]

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockFilms),
    })

    await fetchMovies()

    expect(fetch).toHaveBeenCalledWith('/api/movies')
  })

  it('retourne les films reçus depuis l\'API', async () => {
    const mockFilms = [
      { title: 'Inception',      year: 2010, rating: 8.3 },
      { title: 'The Godfather',  year: 1972, rating: 8.7 },
    ]

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockFilms),
    })

    const films = await fetchMovies()

    expect(films).toEqual(mockFilms)
    expect(films).toHaveLength(2)
  })
})
