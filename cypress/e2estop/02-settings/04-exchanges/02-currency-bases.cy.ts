import { v4 as uuidv4 } from 'uuid'
import { CreateUpsertCurrencyDocument, CreateUpsertCurrencyBaseDocument } from '../../../../app/graphql/generated/default'

describe('Working with currency bases feature', () => {
  const currencyId1 = uuidv4()
  const symbol1 = 'KHR'
  const currencyId2 = uuidv4()
  const symbol2 = 'USD'
  const currencyVariables = [
    {
      input: {
        id: currencyId1,
        symbol: symbol1,
        flag: '🇰🇭',
      },
    },
    {
      input: {
        id: currencyId2,
        symbol: symbol2,
        flag: '🇺🇸',
      },
    },
  ]

  const createCurrencyBaseVariable = {
    input: {
      id: uuidv4(),
      currencyId: currencyId1,
      currencyRates: [
        {
          id: uuidv4(),
          currencyId: currencyId1,
          rate: 1,
        },
        {
          id: uuidv4(),
          currencyId: currencyId1,
          rate: 4000,
        },
      ],
    },
  }

  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/settings/exchanges/currency-bases')
      cy.wait(1000)
      cy.setBearerToken()
      currencyVariables.map((variable) => {
        cy.factoryGraphqlData(CreateUpsertCurrencyDocument, variable)
      })
      cy.factoryGraphqlData(CreateUpsertCurrencyBaseDocument, createCurrencyBaseVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/exchanges/currency-bases')
    cy.wait(1000)
    cy.setBearerToken()
    currencyVariables.map((variable) => {
      cy.factoryGraphqlData(CreateUpsertCurrencyDocument, variable)
    })
    cy.wait(1000)
    cy.openCreateModal()
    cy.selectSetting('currency-id', symbol2, currencyId2)
    cy.wait(1000)
    cy.selectSetting('currency-rates.currency-id-0', symbol2, currencyId2)
    cy.dataTestId('currency-rates.rate-0').first().type('1').blur()
    cy.dataTestId('add-currency-rate-btn').click()
    cy.selectSetting('currency-rates.currency-id-1', symbol1, currencyId1)
    cy.dataTestId('currency-rates.rate-1').first().type('4000').blur()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
  })
  it('should list currency-bases in khmer language', () => {
    cy.reload()
    cy.get('#grid-currency-bases').should('be.visible')
    cy.get('#grid-currency-bases_content_table')
      .contains('tbody .e-row', symbol1)
      .should('exist')
    cy.wait(1000)
  })
  it('should list currency-bases in english language', () => {
    cy.toggleLocal()
    cy.get('#grid-currency-bases').should('be.visible')
    cy.get('#grid-currency-bases_content_table')
      .contains('tbody .e-row', symbol1)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('currency-bases', symbol1)
    cy.dataGridSelectRow('currency-bases')
    cy.openEditModal()
    cy.selectSetting('currency-id', symbol2, currencyId2)
    cy.dataTestId('currency-rate-remove-row-1').click()
    cy.selectSetting('currency-rates.currency-id-0', symbol1, currencyId1)
    cy.dataTestId('currency-rates.rate-0').first().clear().type('100').blur()
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('currency-bases', symbol2)
    cy.dataGridSelectRow('currency-bases')
    cy.wait(1000)
  })
})
