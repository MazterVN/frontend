import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedScoreTypeDocument } from '../../../app/graphql/generated/default'

describe('Working with score-types feature by Tester Role', () => {
  const createScoreTypeKm = 'ប្រភេទពិន្ទុ'
  const createScoreTypeEn = 'ScoreType'
  const updateScoreTypeKm = 'បានកែប្រែ'
  const updateScoreTypeEn = 'Updated'

  const createScoreTypeVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      sortOrder: 0,
      scoreTypes: [
        {
          id: uuidv4(),
          name: createScoreTypeKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createScoreTypeEn,
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
      cy.visit('/settings/grades/score-types')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(
        CreateRelatedScoreTypeDocument,
        createScoreTypeVariable,
      )
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/score-types')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createScoreTypeKm)
    cy.dataTestId('en-input-field').type(createScoreTypeEn)
    cy.submitForm().submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('score-types', createScoreTypeKm)
    cy.dataGridSelectRow('score-types')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('score-types', createScoreTypeKm)
    cy.dataGridSelectRow('score-types')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateScoreTypeKm)
    cy.dataTestId('en-input-field').clear().type(updateScoreTypeEn)
    cy.submitForm().submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('score-types', updateScoreTypeKm)
    cy.dataGridSelectRow('score-types')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('score-types', createScoreTypeKm)
    cy.sortDataGrid(0)
    cy.get('#grid-score-types').should('be.visible')
    cy.get('#grid-score-types_content_table')
      .contains('tbody .e-row', createScoreTypeKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('score-types', createScoreTypeEn)
    cy.sortDataGrid(0)
    cy.get('#grid-score-types').should('be.visible')
    cy.get('#grid-score-types_content_table')
      .contains('tbody .e-row', createScoreTypeEn)
      .should('exist')
    cy.wait(1000)
  })
})
