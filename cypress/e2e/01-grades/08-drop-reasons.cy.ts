import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedDropReasonDocument } from '../../../app/graphql/generated/default'

describe('Working with drop-reasons feature by Tester Role', () => {
  const createDropReasonKm = 'មូលហេតុបោះបង់'
  const createDropReasonEn = 'DropReason'
  const updateDropReasonKm = 'បានកែប្រែ'
  const updateDropReasonEn = 'Updated'

  const createDropReasonVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      dropReasons: [
        {
          id: uuidv4(),
          name: createDropReasonKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createDropReasonEn,
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
      cy.visit('/settings/grades/drop-reasons')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(
        CreateRelatedDropReasonDocument,
        createDropReasonVariable,
      )
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/drop-reasons')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createDropReasonKm)
    cy.dataTestId('en-input-field').type(createDropReasonEn)
    cy.submitForm().submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('drop-reasons', createDropReasonKm)
    cy.dataGridSelectRow('drop-reasons')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('drop-reasons', createDropReasonKm)
    cy.dataGridSelectRow('drop-reasons')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateDropReasonKm)
    cy.dataTestId('en-input-field').clear().type(updateDropReasonEn)
    cy.submitForm().submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('drop-reasons', updateDropReasonKm)
    cy.dataGridSelectRow('drop-reasons')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('drop-reasons', createDropReasonKm)
    cy.sortDataGrid(0)
    cy.get('#grid-drop-reasons').should('be.visible')
    cy.get('#grid-drop-reasons_content_table')
      .contains('tbody .e-row', createDropReasonKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('drop-reasons', createDropReasonEn)
    cy.sortDataGrid(0)
    cy.get('#grid-drop-reasons').should('be.visible')
    cy.get('#grid-drop-reasons_content_table')
      .contains('tbody .e-row', createDropReasonEn)
      .should('exist')
    cy.wait(1000)
  })
})
