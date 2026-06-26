import { describe, it, expect } from 'vitest'
import { sortByYearAsc } from '../../src/utils.js'

// ─────────────────────────────────────────────────────────────────────────────
// TEST UNITAIRE
// Teste une fonction pure isolée, sans dépendance externe (ni DOM, ni réseau, ni BDD).
// La fonction reçoit des données en entrée et retourne un résultat prévisible.
// ─────────────────────────────────────────────────────────────────────────────

describe('sortByYearAsc', () => {
  it('trie les films par année croissante', () => {
    const films = [
      { title: 'The Dark Knight', year: 2008, rating: 8.5 },
      { title: 'The Godfather',   year: 1972, rating: 8.7 },
      { title: 'Pulp Fiction',    year: 1994, rating: 8.5 },
    ]

    const result = sortByYearAsc(films)

    expect(result[0].year).toBe(1972)
    expect(result[1].year).toBe(1994)
    expect(result[2].year).toBe(2008)
  })

  it('ne modifie pas le tableau original (immutabilité)', () => {
    const films = [
      { title: 'The Dark Knight', year: 2008 },
      { title: 'The Godfather',   year: 1972 },
    ]

    sortByYearAsc(films)

    // Le tableau d'origine doit rester dans son ordre initial
    expect(films[0].year).toBe(2008)
    expect(films[1].year).toBe(1972)
  })

  it('retourne un tableau vide si aucun film fourni', () => {
    expect(sortByYearAsc([])).toEqual([])
  })

  it('retourne un tableau à un seul élément inchangé', () => {
    const films = [{ title: 'Inception', year: 2010 }]
    expect(sortByYearAsc(films)).toEqual(films)
  })
})
