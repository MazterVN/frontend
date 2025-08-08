import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedServiceNameDocument } from '../../../../app/graphql/generated/default'

describe('Working with service-names feature by Tester Role', () => {
  const serviceNameKm = '13 ក'
  const serviceNameEn = '13 A'
  const updateAppendKm = ' បានកែប្រែ'
  const updateAppendEn = ' Updated'

  const createServiceNameVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      serviceNames: [
        {
          id: uuidv4(),
          name: serviceNameKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: serviceNameEn,
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
      cy.visit('/settings/services/service-names')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedServiceNameDocument, createServiceNameVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/services/service-names')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(serviceNameKm)
    cy.dataTestId('en-input-field').type(serviceNameEn)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('service-names', serviceNameKm)
    cy.dataGridSelectRow('service-names')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('service-names', serviceNameKm)
    cy.sortDataGrid(0)
    cy.get('#grid-service-names').should('be.visible')
    cy.get('#grid-service-names_content_table')
      .contains('tbody .e-row', serviceNameKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('service-names', serviceNameEn)
    cy.sortDataGrid(0)
    cy.get('#grid-service-names').should('be.visible')
    cy.get('#grid-service-names_content_table')
      .contains('tbody .e-row', serviceNameEn)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('service-names', serviceNameKm)
    cy.dataGridSelectRow('service-names')
    cy.openEditModal()
    cy.dataTestId('km-input-field').type(updateAppendKm)
    cy.dataTestId('en-input-field').type(updateAppendEn)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('service-names', updateAppendKm)
    cy.dataGridSelectRow('service-names')
    cy.wait(1000)
  })
})
