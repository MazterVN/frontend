import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedDaysOfWeekDocument } from '../../../../app/graphql/generated/default'

describe('Working with days feature by Tester Role', () => {
  const createDayKm = 'ថ្ងៃទាំងប្រាបពីរ'
  const createDayEn = 'SevenDaysOfWeek'
  const updateDayKm = 'បានកែប្រែ'
  const updateDayEn = 'Updated'

  const createDayVariables = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      sortOrder: 0,
      daysOfWeeks: [
        {
          id: uuidv4(),
          name: createDayKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createDayEn,
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
      cy.visit('/settings/grades/days')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedDaysOfWeekDocument, createDayVariables)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/days')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createDayKm)
    cy.dataTestId('en-input-field').type(createDayEn)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('days', createDayKm)
    cy.dataGridSelectRow('days')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('days', createDayKm)
    cy.dataGridSelectRow('days')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateDayKm)
    cy.dataTestId('en-input-field').clear().type(updateDayEn)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('days', updateDayKm)
    cy.dataGridSelectRow('days')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('days', createDayKm)
    cy.sortDataGrid(0)
    cy.get('#grid-days').should('be.visible')
    cy.get('#grid-days_content_table')
      .contains('tbody .e-row', createDayKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('days', createDayEn)
    cy.sortDataGrid(0)
    cy.get('#grid-days').should('be.visible')
    cy.get('#grid-days_content_table')
      .contains('tbody .e-row', createDayEn)
      .should('exist')
    cy.wait(1000)
  })
})
