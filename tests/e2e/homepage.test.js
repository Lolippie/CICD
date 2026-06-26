import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// TEST END-TO-END (E2E)
// Simule un vrai utilisateur dans un vrai navigateur.
// Playwright pilote Chromium (ou Firefox, Safari) et vérifie le comportement
// de l'application de bout en bout, sans rien mocker.
//
// Prérequis : l'application doit être buildée (npm run build)
// Le serveur "vite preview" est démarré automatiquement par playwright.config.js
// ─────────────────────────────────────────────────────────────────────────────

test('la page d\'accueil répond avec un code HTTP 200', async ({ page }) => {
  // Navigue vers la page d'accueil et récupère la réponse HTTP
  const response = await page.goto('/')

  // Vérifie que le serveur a répondu avec un succès (200 OK)
  expect(response.status()).toBe(200)
})

test('la page d\'accueil affiche le bon titre', async ({ page }) => {
  await page.goto('/')

  // Vérifie le titre de l'onglet du navigateur
  await expect(page).toHaveTitle('Movies JS')
})

test('la page d\'accueil contient le header de navigation', async ({ page }) => {
  await page.goto('/')

  // Vérifie qu'un élément structurel clé est bien présent dans le DOM
  const nav = page.locator('nav.nav')
  await expect(nav).toBeVisible()
})
