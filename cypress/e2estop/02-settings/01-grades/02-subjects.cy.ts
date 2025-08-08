import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedSubjectDocument } from '../../../../app/graphql/generated/default'

describe('Working with subjects feature by Tester Role', () => {
  const createSubjectKm = 'មុខវិជ្ជា'
  const createSubjectEn = 'Subject'
  const updateSubjectKm = 'បានកែប្រែ'
  const updateSubjectEn = 'Updated'

  const createSubjectVariabls = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      sortOrder: 0,
      subjects: [
        {
          id: uuidv4(),
          name: createSubjectKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createSubjectEn,
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
      cy.visit('/settings/grades/subjects')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedSubjectDocument, createSubjectVariabls)
      cy.wait(1000)
    })
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/subjects')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createSubjectKm)
    cy.dataTestId('en-input-field').type(createSubjectEn)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('subjects', createSubjectKm)
    cy.dataGridSelectRow('subjects')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('subjects', createSubjectKm)
    cy.dataGridSelectRow('subjects')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateSubjectKm)
    cy.dataTestId('en-input-field').clear().type(updateSubjectEn)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('subjects', updateSubjectKm)
    cy.dataGridSelectRow('subjects')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('subjects', createSubjectKm)
    cy.sortDataGrid(0)
    cy.get('#grid-subjects').should('be.visible')
    cy.get('#grid-subjects_content_table')
      .contains('tbody .e-row', createSubjectKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('subjects', createSubjectEn)
    cy.sortDataGrid(0)
    cy.get('#grid-subjects').should('be.visible')
    cy.get('#grid-subjects_content_table')
      .contains('tbody .e-row', createSubjectEn)
      .should('exist')
    cy.wait(1000)
  })
})
