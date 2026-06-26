import express from 'express'
import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'

const app = express()
const PORT = 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moviejs'

let db

// Connexion à MongoDB avec retry : depends_on dans docker-compose attend que le
// conteneur démarre, pas que MongoDB soit prêt à accepter des connexions.
async function connectDB(retries = 10, delay = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const client = new MongoClient(MONGODB_URI)
      await client.connect()
      db = client.db()
      console.log('Connecté à MongoDB')
      return
    } catch (err) {
      console.log(`Tentative ${i}/${retries} échouée, nouvelle tentative dans ${delay / 1000}s…`)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Impossible de se connecter à MongoDB après plusieurs tentatives')
}

// Peuple la collection si elle est vide (premier démarrage)
async function seedIfEmpty() {
  const count = await db.collection('movies').countDocuments()
  if (count > 0) {
    console.log(`Base déjà peuplée (${count} films)`)
    return
  }
  const movies = JSON.parse(readFileSync('./movies.json', 'utf-8'))
  await db.collection('movies').insertMany(movies)
  console.log(`${movies.length} films insérés en base`)
}

app.get('/api/movies', async (req, res) => {
  // { _id: 0 } exclut le champ _id de MongoDB pour ne pas exposer les internals
  const movies = await db.collection('movies').find({}, { projection: { _id: 0 } }).toArray()
  res.json(movies)
})

connectDB()
  .then(seedIfEmpty)
  .then(() => {
    app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`))
  })
  .catch(err => {
    console.error(err.message)
    process.exit(1)
  })
