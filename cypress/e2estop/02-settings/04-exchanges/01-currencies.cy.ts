import { v4 as uuidv4 } from 'uuid'
import { CreateUpsertCurrencyDocument } from '../../../../app/graphql/generated/default'

describe('Working with currencies feature', () => {
  const symbolKhr = 'KHR'
  const symbolKhrId = 'khr_currency_symbol_type'
  const symbolVnd = 'VND'
  const symbolVndId = 'vnd_currency_symbol_type'
  const flagKh = '🇰🇭'
  const flagVn = '🇻🇳'

  const createCurrencyVariable = {
    input: {
      id: uuidv4(),
      symbol: symbolKhr,
      flag: flagKh,
    },
  }

  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/settings/exchanges/currencies')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateUpsertCurrencyDocument, createCurrencyVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/exchanges/currencies')
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('submit-btn').click()
    cy.wait(1000)
    cy.validationErrorMessage('Flag must not be empty', 0)
    cy.selectSetting('symbol', symbolKhr, symbolKhrId)
    cy.dataTestId('flag').type(flagKh).blur()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('currencies', symbolKhr)
    cy.dataGridSelectRow('currencies')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.reload()
    cy.get('#grid-currencies').should('be.visible')
    cy.get('#grid-currencies_content_table')
      .contains('tbody .e-row', symbolKhr)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.get('#grid-currencies').should('be.visible')
    cy.get('#grid-currencies_content_table')
      .contains('tbody .e-row', symbolKhr)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('currencies', symbolKhr)
    cy.dataGridSelectRow('currencies')
    cy.openEditModal()
    cy.selectSetting('symbol', symbolVnd, symbolVndId)
    cy.dataTestId('flag').clear().type(flagVn).blur()
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('currencies', symbolVnd)
    cy.dataGridSelectRow('currencies')
    cy.wait(1000)
  })
})
