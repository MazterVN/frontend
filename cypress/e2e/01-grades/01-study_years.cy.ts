import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedStudyYearDocument } from '../../../app/graphql/generated/default'

describe('Working with study-years feature by Tester Role', () => {
  const createStudyYearKm = '១៩៩៩-២០០០'
  const createStudyYearEn = '1999-2000'
  const updateStudyYearKm = 'បានកែប្រែ'
  const updateStudyYearEn = 'Updated'

  const beginsAt = '2025-01-01'
  const endsAt = '2025-12-31'
  const createStudyYearVariables = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      beginsAt,
      endsAt,
      studyYears: [
        {
          id: uuidv4(),
          name: createStudyYearKm,
          language: 'KM',
          beginsAt,
          endsAt,
        },
        {
          id: uuidv4(),
          name: createStudyYearEn,
          language: 'EN',
          beginsAt,
          endsAt,
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
      cy.visit('/settings/grades/study-years')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(
        CreateRelatedStudyYearDocument,
        createStudyYearVariables,
      )
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/study-years')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid date', 0)
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dateRangPicker(6)
    cy.dataTestId('km-input-field').type(createStudyYearKm).blur()
    cy.dataTestId('en-input-field').type(createStudyYearEn).blur()
    cy.submitForm().submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('study-years', createStudyYearKm)
    cy.dataGridSelectRow('study-years')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('study-years', createStudyYearKm)
    cy.dataGridSelectRow('study-years')
    cy.openEditModal()
    cy.dateRangPicker(1)
    cy.dataTestId('km-input-field').clear().type(updateStudyYearKm)
    cy.dataTestId('en-input-field').clear().type(updateStudyYearEn)
    cy.submitForm().submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('study-years', updateStudyYearKm)
    cy.dataGridSelectRow('study-years')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('study-years', createStudyYearKm)
    cy.sortDataGrid(0)
    cy.get('#grid-study-years').should('be.visible')
    cy.get('#grid-study-years_content_table')
      .contains('tbody .e-row', createStudyYearKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('study-years', createStudyYearEn)
    cy.sortDataGrid(0)
    cy.get('#grid-study-years').should('be.visible')
    cy.get('#grid-study-years_content_table')
      .contains('tbody .e-row', createStudyYearEn)
      .should('exist')
    cy.wait(1000)
  })
})
