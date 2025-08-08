import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedServiceTypeDocument } from '../../../../app/graphql/generated/default'

describe('Working with service-types feature by Tester Role', () => {
  const serviceTypeKm = 'ផ្លាស់ប្តូរថ្នាក់រៀន'
  const serviceTypeEn = 'CHANGE STUDY CLASS'
  const updateAppendKm = ' បានកែប្រែ'
  const updateAppendEn = ' Updated'

  const createServiceTypeVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      serviceTypes: [
        {
          id: uuidv4(),
          name: serviceTypeKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: serviceTypeEn,
          language: 'EN',
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
      cy.visit('/settings/services/service-types')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedServiceTypeDocument, createServiceTypeVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/services/service-types')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(serviceTypeKm)
    cy.dataTestId('en-input-field').type(serviceTypeEn)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('service-types', serviceTypeKm)
    cy.dataGridSelectRow('service-types')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('service-types', serviceTypeKm)
    cy.sortDataGrid(0)
    cy.get('#grid-service-types').should('be.visible')
    cy.get('#grid-service-types_content_table')
      .contains('tbody .e-row', serviceTypeKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('service-types', serviceTypeEn)
    cy.sortDataGrid(0)
    cy.get('#grid-service-types').should('be.visible')
    cy.get('#grid-service-types_content_table')
      .contains('tbody .e-row', serviceTypeEn)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('service-types', serviceTypeKm)
    cy.dataGridSelectRow('service-types')
    cy.openEditModal()
    cy.dataTestId('km-input-field').type(updateAppendKm)
    cy.dataTestId('en-input-field').type(updateAppendEn)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('service-types', updateAppendKm)
    cy.dataGridSelectRow('service-types')
    cy.wait(1000)
  })
})
