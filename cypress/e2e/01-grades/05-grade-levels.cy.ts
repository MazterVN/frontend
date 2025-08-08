import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedGradeLevelDocument } from '../../../app/graphql/generated/default'

describe('Working with grade-levels feature by Tester Role', () => {
  const createGradeLevelKm = 'និទ្ទេស'
  const createGradeLevelEn = 'GradeLevel'
  const updateGradeLevelKm = 'បានកែប្រែ'
  const updateGradeLevelEn = 'Updated'

  const createGradeLevelVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      sortOrder: 0,
      gradeLevels: [
        {
          id: uuidv4(),
          name: createGradeLevelKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createGradeLevelEn,
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
      cy.visit('/settings/grades/grade-levels')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(
        CreateRelatedGradeLevelDocument,
        createGradeLevelVariable,
      )
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/grade-levels')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createGradeLevelKm)
    cy.dataTestId('en-input-field').type(createGradeLevelEn)
    cy.submitForm().submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('grade-levels', createGradeLevelKm)
    cy.dataGridSelectRow('grade-levels')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('grade-levels', createGradeLevelKm)
    cy.dataGridSelectRow('grade-levels')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateGradeLevelKm)
    cy.dataTestId('en-input-field').clear().type(updateGradeLevelEn)
    cy.submitForm().submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('grade-levels', updateGradeLevelKm)
    cy.dataGridSelectRow('grade-levels')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('grade-levels', createGradeLevelKm)
    cy.sortDataGrid(0)
    cy.get('#grid-grade-levels').should('be.visible')
    cy.get('#grid-grade-levels_content_table')
      .contains('tbody .e-row', createGradeLevelKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('grade-levels', createGradeLevelEn)
    cy.sortDataGrid(0)
    cy.get('#grid-grade-levels').should('be.visible')
    cy.get('#grid-grade-levels_content_table')
      .contains('tbody .e-row', createGradeLevelEn)
      .should('exist')
    cy.wait(1000)
  })
})
