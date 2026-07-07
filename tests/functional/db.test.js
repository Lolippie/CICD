import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'

// ─────────────────────────────────────────────────────────────────────────────
// TEST FONCTIONNEL — BASE DE DONNÉES
// Teste l'insertion et la lecture de films dans MongoDB.
// On utilise "mongodb-memory-server" pour démarrer une vraie instance MongoDB
// en mémoire : pas besoin de Docker, pas de données persistées entre les tests.
// ─────────────────────────────────────────────────────────────────────────────

let mongod  // instance MongoDB en mémoire
let client  // connexion MongoClient
let db      // base de données de test

// Avant tous les tests : démarre MongoDB en mémoire et se connecte
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  client = new MongoClient(mongod.getUri())
  await client.connect()
  db = client.db('moviejs-test')
})

// Après tous les tests : ferme la connexion et arrête MongoDB
afterAll(async () => {
  await client.close()
  await mongod.stop()
})

describe('Insertion d\'un film en base de données', () => {
  it('insère un film et le retrouve via une requête', async () => {
    const film = {
      title: 'Inception',
      year: 2010,
      rating: 8.3,
      overview: 'A thief steals corporate secrets through the use of dream-sharing technology.',
      posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    }

    await db.collection('movies').insertOne(film)

    const filmEnBase = await db.collection('movies').findOne({ title: 'Inception' })

    expect(filmEnBase).not.toBeNull()
    expect(filmEnBase.title).toBe('Inception')
    expect(filmEnBase.year).toBe(2005)
    expect(filmEnBase.rating).toBe(8.3)
  })

  it('insère plusieurs films et les compte correctement', async () => {
    // Vide la collection avant ce test pour avoir un état prévisible
    await db.collection('movies').deleteMany({})

    const films = [
      { title: 'The Godfather',  year: 1972, rating: 8.7 },
      { title: 'Pulp Fiction',   year: 1994, rating: 8.5 },
      { title: 'The Dark Knight', year: 2008, rating: 8.5 },
    ]

    await db.collection('movies').insertMany(films)

    const total = await db.collection('movies').countDocuments()
    expect(total).toBe(3)
  })

  it('retrouve les bons films après insertion multiple', async () => {
    const filmCherche = await db.collection('movies').findOne({ title: 'Pulp Fiction' })

    expect(filmCherche).not.toBeNull()
    expect(filmCherche.year).toBe(1994)
  })
})
