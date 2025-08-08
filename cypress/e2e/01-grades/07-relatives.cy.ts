import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedRelativeDocument } from '../../../app/graphql/generated/default'

describe('Working with relatives feature by Tester Role', () => {
  const createRelativeKm = 'សាច់ញាតិ'
  const createRelativeEn = 'Relative'
  const updateRelativeKm = 'បានកែប្រែ'
  const updateRelativeEn = 'Updated'

  const createRelativeVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      sortOrder: 0,
      relatives: [
        {
          id: uuidv4(),
          name: createRelativeKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createRelativeEn,
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
      cy.visit('/settings/grades/relatives')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(
        CreateRelatedRelativeDocument,
        createRelativeVariable,
      )
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/relatives')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createRelativeKm)
    cy.dataTestId('en-input-field').type(createRelativeEn)
    cy.submitForm().submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('relatives', createRelativeKm)
    cy.dataGridSelectRow('relatives')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('relatives', createRelativeKm)
    cy.dataGridSelectRow('relatives')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateRelativeKm)
    cy.dataTestId('en-input-field').clear().type(updateRelativeEn)
    cy.submitForm().submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('relatives', updateRelativeKm)
    cy.dataGridSelectRow('relatives')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('relatives', createRelativeKm)
    cy.sortDataGrid(0)
    cy.get('#grid-relatives').should('be.visible')
    cy.get('#grid-relatives_content_table')
      .contains('tbody .e-row', createRelativeKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('relatives', createRelativeEn)
    cy.sortDataGrid(0)
    cy.get('#grid-relatives').should('be.visible')
    cy.get('#grid-relatives_content_table')
      .contains('tbody .e-row', createRelativeEn)
      .should('exist')
    cy.wait(1000)
  })
})
