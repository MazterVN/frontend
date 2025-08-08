import { v4 as uuidv4 } from 'uuid'
import { CreateUpsertSubscriptionIntervalDocument } from '../../../../app/graphql/generated/default'

describe('Working with subscription intervals feature', () => {
  const feature = 'subscription-intervals'
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
      cy.visit('/settings/intervals/subscription-intervals')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateUpsertSubscriptionIntervalDocument, createVariable)
      cy.reload()
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/intervals/subscription-intervals')
    cy.wait(1000)
    cy.openCreateModal()
    cy.selectSetting('mode-select-field', createMode.km, `${createMode.value}_interval_mode_type`)
    cy.dataTestId('day-numeric-field').first().type(createMode.day).blur()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.wait(1000)
  })
  it('should list is khmer', () => {
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', createMode.value.toUpperCase())
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, createMode.value.toUpperCase())
    cy.dataGridSelectRow('subscription-intervals')
    cy.openEditModal()
    cy.selectSetting('mode-select-field', updateMode.en, `${updateMode.value}_interval_mode_type`)
    cy.dataTestId('day-numeric-field').first().clear().type(updateMode.day).blur()
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
  })
  it('should list in english', () => {
    cy.toggleLocal()
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', updateMode.value.toUpperCase())
      .should('exist')
    cy.wait(1000)
  })
})
