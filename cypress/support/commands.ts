import type { DocumentNode } from 'graphql'
import { print } from 'graphql'
import { createClient } from '@supabase/supabase-js'

Cypress.Commands.add('dataTestId', (id: string) => {
  return cy.get(`[data-testid="${id}"]`)
})

Cypress.Commands.add('login', () => {
  cy.session('session', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('input#username').type(Cypress.env('CY_TESTER_USER'))
    cy.get('button[type="submit"]._button-login-id').click()
    cy.get('input#password').type(Cypress.env('CY_TESTER_PASS'))
    cy.get('button[type="submit"]._button-login-password').click()
    cy.get('button[type="submit"]._link-abort-passkey-enrollment').click()
    cy.wait(1000)
  }, {
    cacheAcrossSpecs: true,
  })
})
// https://pks.jp.auth0.com
Cypress.Commands.add('logout', () => {
  cy.dataTestId('account-profile').click()
  cy.wait(2000)
  cy.dataTestId('sign-out').click()
  cy.wait(1000)
  cy.clearAllSessionStorage()
})

Cypress.Commands.add('selectSettingByIndex', (dataTestId: string, filter: string, eq: number = 0) => {
  cy.intercept('POST', '/gql').as('graphqlRequests')
  cy.dataTestId(dataTestId)
    .eq(eq)
    .parent()
    .click()
    .wait(1000)

  cy.get('input.e-input-filter.e-input.e-lib.e-keyboard')
    .type(filter, { delay: 500 })
  cy.wait('@graphqlRequests')

  cy.get('.e-list-parent .e-list-item').eq(eq).click()
    .click()
  cy.wait(1000)
})
Cypress.Commands.add('selectSetting', (dataTestId: string, filter: string, listId: string, eq: number = 0) => {
  cy.intercept('POST', '/gql').as('graphqlRequests')
  cy.dataTestId(dataTestId)
    .eq(eq)
    .parent()
    .click()
    .wait(1000)

  cy.get('input.e-input-filter.e-input.e-lib.e-keyboard')
    .type(filter, { delay: 500 })
  cy.wait('@graphqlRequests')
  cy.wait(1000)

  cy.get(`li#${listId}`)
    .click()
  cy.wait(1000)
})

Cypress.Commands.add('dataGridSearch', (feature: string, valueToSearch: string) => {
  return cy.get(`input#grid-${feature}_searchbar`)
    .clear()
    .type(valueToSearch + '{enter}', { delay: 100 })
    .wait(1000)
})

Cypress.Commands.add('dataGridSelectRow', (feature: string, dataRowIndex: number = 1, colIndex: number = 1) => {
  return cy.get(`#grid-${feature}_content_table`)
    .find(`tbody tr[aria-rowindex="${dataRowIndex}"]`)
    .find(`td[aria-colindex="${colIndex}"]`)
    .click()
    .wait(1000)
})

Cypress.Commands.add('openCreateModal', () => {
  cy.get('button#add')
    .click()
    .wait(1000)
})

Cypress.Commands.add('openEditModal', () => {
  cy.get('button#edit')
    .click()
    .wait(1000)
})

Cypress.Commands.add('toggleLocal', () => {
  cy.dataTestId('toggle-locale')
    .click()
    .wait(1000)
})

Cypress.Commands.add('clearSelectSetting', (dataTestId: string) => {
  cy.dataTestId(dataTestId)
    .parent()
    .focus()
    .find('span.e-clear-icon[aria-label="close"]')
    .click()
    .wait(1000)
})

Cypress.Commands.add('submitForm', () => {
  cy.dataTestId('submit-btn')
    .last()
    .click()
    .wait(1000)
})

Cypress.Commands.add('closeModal', () => {
  cy.dataTestId('close-btn')
    .last()
    .click()
    .wait(1000)
})

Cypress.Commands.add('submitAssertSuccessful', (successMessage: string) => {
  cy.get('.text-sm.font-medium[class*="text-"][class*="--ui-text-highlighted"]')
    .last()
    .should('be.visible')
    .and('contain.text', successMessage)
})

Cypress.Commands.add('submitFailure', (failureMessage) => {
  cy.get('.w-full.pointer-events-auto.rounded-lg.shadow-lg')
    .should('be.visible') // Check if the error container is visible
  cy.contains('p', failureMessage) // Find the <p> element with the specific text
    .should('exist') // Assert that it exists
})

Cypress.Commands.add('dateRangPicker', (num: number) => {
  cy.get('.mt-1 > .el-date-editor > .el-range__icon')
    .click()
    .wait(200)
  cy.get(`.el-picker-panel__sidebar > :nth-child(${num})`)
    .click()
    .wait(200)
})

Cypress.Commands.add('startSandbox', () => {
  cy.request('POST', Cypress.env('CY_SANDBOX_URL')).then((response) => {
    expect(response.status).to.eq(200)
    Cypress.env('dbProcess', response.body) // Save sandbox metadata
  })
})

Cypress.Commands.add('stopSandbox', () => {
  cy.request({
    method: 'DELETE',
    url: Cypress.env('CY_SANDBOX_URL'),
    headers: {
      'x-sandbox': Cypress.env('dbProcess'),
    },
  })
})

Cypress.Commands.add('attachSandboxHeader', () => {
  const dbProcess = Cypress.env('dbProcess')
  expect(dbProcess).to.be.a('string')

  cy.intercept('**/gql', (req) => {
    req.headers['x-sandbox'] = dbProcess
  })
})

Cypress.Commands.add('insertTextIntoEditor', (textLines: [string]) => {
  cy.get('.CodeMirror').then(($editor) => {
    // @ts-expect-error CodeMirror type is not available in global scope but exists at runtime
    const editor = $editor[0].CodeMirror

    // Clear existing content if needed
    editor.setValue('')

    textLines.forEach((lineText, index) => {
      editor.replaceRange(lineText + '\n', { line: index })
    })
  })
})

Cypress.Commands.add('sortDataGrid', (byColIndex: number) => {
  cy.get(`[aria-colindex="${byColIndex + 1}"] > .e-headercelldiv > .e-headertext`)
    .click()
    .wait(1000)
})

Cypress.Commands.add('toggleRoomCell', (rowIndex: number, colIndex: number) => {
  cy.dataTestId(`cell-${rowIndex}-${colIndex}`).click()
})

Cypress.Commands.add('setBearerToken', () => {
  cy.window().its('__NUXT__.state.["$ssupabase_session"].access_token').then((accessToken) => {
    Cypress.env('bearerToken', 'Bearer ' + accessToken)
  })
})

Cypress.Commands.add('factoryGraphqlData', (query: DocumentNode, variables: object) => {
  const printedQuery = print(query)

  cy.request({
    method: 'POST',
    url: Cypress.env('GQL_HOST'),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': Cypress.env('bearerToken'),
      'x-sandbox': Cypress.env('dbProcess'),
    },
    body: {
      query: printedQuery,
      variables: variables,
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    return response.body.data
  })
})
Cypress.Commands.add('seedGraphqlData', (query, variables: object) => {
  cy.request({
    method: 'POST',
    url: Cypress.env('GQL_HOST'),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': Cypress.env('bearerToken'),
      'x-sandbox': Cypress.env('dbProcess'),
    },
    body: {
      query,
      variables: variables,
    },
  }).then((response) => {
    expect(response.status).to.eq(200)
    return response.body.data
  })
})

Cypress.Commands.add('validationErrorMessage', (errorText, index = 0) => {
  cy.get('.mt-2[class*="text-"][class*="--ui-error"]')
    .filter(`:contains("${errorText}")`)
    .eq(index)
    .should('be.visible')
})

Cypress.Commands.add('closeModalX', () => {
  cy.get('button[aria-label="Close"]', { timeout: 5000 })
    .filter(':visible')
    .last()
    .should('be.visible')
    .click({ force: true })
    .wait(500)
})

Cypress.Commands.add('skipBeforeEach', function (testsToSkip: string[]) {
  const testTitle = this.currentTest?.title || ''
  return cy.wrap(testsToSkip.includes(testTitle))
})

// Cypress.Commands.add('loginWithPassword', () => {
//   const user = Cypress.env('TEST_USER')
//   const pass = Cypress.env('TEST_PASS')
//   const supabaseUrl = Cypress.env('SUPABASE_URL')
//   const projectRef = new URL(supabaseUrl).hostname.split('.')[0]

//   cy.session('session', () => {
//     const supabase = createClient(
//       Cypress.env('SUPABASE_URL'),
//       Cypress.env('SUPABASE_KEY'),
//     )

//     cy.window().then(async () => {
//       const { data, error } = await supabase.auth.signInWithPassword({ email: user, password: pass })

//       if (error) throw new Error(error.message)
//       const session = data.session
//       if (!session) throw new Error('No session returned')

//       const cookieValue = {
//         access_token: session.access_token,
//         token_type: session.token_type,
//         expires_in: session.expires_in,
//         expires_at: session.expires_at,
//         refresh_token: session.refresh_token,
//         user: session.user,
//       }

//       const encoded = 'base64-' + btoa(JSON.stringify(cookieValue)).replace(/=+$/, '')
//       const maxLength = 3180
//       const part0 = encoded.slice(0, maxLength)
//       const part1 = encoded.slice(maxLength)

//       Cypress.env('cookiePart0', part0)
//       Cypress.env('cookiePart1', part1)

//       cy.setCookie(`sb-${projectRef}-auth-token.0`, part0)
//       cy.setCookie(`sb-${projectRef}-auth-token.1`, part1)
//     })
//   }, {
//     cacheAcrossSpecs: true,
//     validate: () => {
//       const part0 = Cypress.env('cookiePart0')
//       const part1 = Cypress.env('cookiePart1')

//       if (part0 && part1) {
//         cy.log('Working here..............')
//         cy.setCookie(`sb-${projectRef}-auth-token.0`, part0)
//         cy.setCookie(`sb-${projectRef}-auth-token.1`, part1)
//       }
//     },
//   })
// })

Cypress.Commands.add('loginWithPassword', () => {
  const user = Cypress.env('TEST_USER')
  const pass = Cypress.env('TEST_PASS')
  const supabaseUrl = Cypress.env('SUPABASE_URL')
  const projectRef = new URL(supabaseUrl).hostname.split('.')[0]

  cy.session([user, 'for-testing'], () => {
    const supabase = createClient(
      Cypress.env('SUPABASE_URL'),
      Cypress.env('SUPABASE_KEY'),
    )

    cy.then(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({ email: user, password: pass })
      if (error) throw new Error(error.message)

      const session = data.session
      const cookieValue = {
        access_token: session.access_token,
        token_type: session.token_type,
        expires_in: session.expires_in,
        expires_at: session.expires_at,
        refresh_token: session.refresh_token,
        user: session.user,
      }

      const encoded = 'base64-' + btoa(JSON.stringify(cookieValue)).replace(/=+$/, '')
      const maxLength = 3180
      const part0 = encoded.slice(0, maxLength)
      const part1 = encoded.slice(maxLength)

      cy.setCookie(`sb-${projectRef}-auth-token.0`, part0)
      cy.setCookie(`sb-${projectRef}-auth-token.1`, part1)
    })
  }, {
    cacheAcrossSpecs: false,
    validate: () => {
      cy.getCookie(`sb-${projectRef}-auth-token.0`).should('exist')
      cy.getCookie(`sb-${projectRef}-auth-token.1`).should('exist')
    },
  })
})
