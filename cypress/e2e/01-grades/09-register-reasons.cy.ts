import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedRegisterReasonDocument } from '../../../app/graphql/generated/default'

describe('Working with register-reasons feature by Tester Role', () => {
  const createRegisterReasonKm = 'មូលហេតុចុះឈ្មោះ'
  const createRegisterReasonEn = 'RegisterReason'
  const updateRegisterReasonKm = 'បានកែប្រែ'
  const updateRegisterReasonEn = 'Updated'

  const createRegisterReasonVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      registerReasons: [
        {
          id: uuidv4(),
          name: createRegisterReasonKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createRegisterReasonEn,
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
      cy.visit('/settings/grades/register-reasons')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(
        CreateRelatedRegisterReasonDocument,
        createRegisterReasonVariable,
      )
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/register-reasons')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createRegisterReasonKm)
    cy.dataTestId('en-input-field').type(createRegisterReasonEn)
    cy.submitForm().submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('register-reasons', createRegisterReasonKm)
    cy.dataGridSelectRow('register-reasons')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('register-reasons', createRegisterReasonKm)
    cy.dataGridSelectRow('register-reasons')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateRegisterReasonKm)
    cy.dataTestId('en-input-field').clear().type(updateRegisterReasonEn)
    cy.submitForm().submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('register-reasons', updateRegisterReasonKm)
    cy.dataGridSelectRow('register-reasons')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('register-reasons', createRegisterReasonKm)
    cy.sortDataGrid(0)
    cy.get('#grid-register-reasons').should('be.visible')
    cy.get('#grid-register-reasons_content_table')
      .contains('tbody .e-row', createRegisterReasonKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('register-reasons', createRegisterReasonEn)
    cy.sortDataGrid(0)
    cy.get('#grid-register-reasons').should('be.visible')
    cy.get('#grid-register-reasons_content_table')
      .contains('tbody .e-row', createRegisterReasonEn)
      .should('exist')
    cy.wait(1000)
  })
})
