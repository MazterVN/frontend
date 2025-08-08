import { v4 as uuidv4 } from 'uuid'
import { CreateUpsertInvoiceIntervalDocument } from '../../../../app/graphql/generated/default'

describe('Working with invoice intervals feature', () => {
  const feature = 'invoice-intervals'
  const createMode = { km: 'បន្ទាប់', en: 'After', value: 'after', day: '7' }
  const updateMode = { km: 'មុន', en: 'Before', value: 'before', day: '8' }

  const createVariable = {
    input: {
      id: uuidv4(),
      day: parseFloat(createMode.day),
      mode: createMode.value.toUpperCase(),
    },
  }

  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/settings/intervals/invoice-intervals')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateUpsertInvoiceIntervalDocument, createVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/intervals/invoice-intervals')
    cy.wait(1000)
    cy.openCreateModal()
    cy.selectSetting('mode-select-field', createMode.km, `${createMode.value}_interval_mode_type`)
    cy.dataTestId('day-numeric-field').first().type(createMode.day).blur()
    cy.dataTestId('submit-btn')
      .click()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.wait(1000)
  })
  it('should list invoice-intervals in khmer language', () => {
    cy.reload()
    cy.wait(1000)
    cy.get('#grid-invoice-intervals').should('be.visible')
    cy.get('#grid-invoice-intervals_content_table')
      .contains('tbody .e-row', createMode.value.toUpperCase())
      .contains('tbody .e-row', createMode.day)
      .should('exist')
    cy.wait(1000)
  })
  it('should list invoice-intervals in english language', () => {
    cy.toggleLocal()
    cy.reload()
    cy.wait(1000)
    cy.get('#grid-invoice-intervals').should('be.visible')
    cy.get('#grid-invoice-intervals_content_table')
      .contains('tbody .e-row', createMode.value.toUpperCase())
      .contains('tbody .e-row', createMode.day)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.toggleLocal()
    cy.reload()
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.selectSetting('mode-select-field', updateMode.en, `${updateMode.value}_interval_mode_type`)
    cy.dataTestId('day-numeric-field').first().clear().type(updateMode.day).blur()
    cy.dataTestId('submit-btn')
      .click()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.dataTestId('close-btn').click()
    cy.wait(1000)
  })
})
