import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  projectId: '9bsci1',
  env: {
    ...process.env,
    dbProcess: '',
  },
  experimentalStudio: true,
  retries: {
    runMode: 1, // Retry failed tests in 'cypress run'
    openMode: 0, // No retries in 'cypress open'
  },
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    experimentalOriginDependencies: true,
    baseUrl: process.env.CY_BASE_URL,
    defaultCommandTimeout: 10000,
  },
})
