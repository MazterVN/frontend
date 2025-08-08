import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedMonthsOfYearDocument } from '../../../app/graphql/generated/default'

describe('Working with months feature by Tester Role', () => {
  const createMonthKm = 'ខែទាំងដបពីរ'
  const createMonthEn = 'TwelveOfMonths'
  const updateMonthKm = 'បានកែប្រែ'
  const updateMonthEn = 'Updated'

  const createMonthVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      sortOrder: 0,
      monthsOfYears: [
        {
          id: uuidv4(),
          name: createMonthKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: createMonthEn,
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
      cy.visit('/settings/grades/months')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(
        CreateRelatedMonthsOfYearDocument,
        createMonthVariable,
      )
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/grades/months')
    cy.wait(1000)
    cy.openCreateModal()
    // cy.submitForm()
    // cy.validationErrorMessage('Please enter a valid name', 0)
    // cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(createMonthKm)
    cy.dataTestId('en-input-field').type(createMonthEn)
    cy.submitForm().submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('months', createMonthKm)
    cy.dataGridSelectRow('months')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('months', createMonthKm)
    cy.sortDataGrid(0)
    cy.get('#grid-months').should('be.visible')
    cy.get('#grid-months_content_table')
      .contains('tbody .e-row', createMonthKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('months', createMonthEn)
    cy.sortDataGrid(0)
    cy.get('#grid-months').should('be.visible')
    cy.get('#grid-months_content_table')
      .contains('tbody .e-row', createMonthEn)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('months', createMonthKm)
    cy.dataGridSelectRow('months')
    cy.openEditModal()
    cy.dataTestId('km-input-field').clear().type(updateMonthKm)
    cy.dataTestId('en-input-field').clear().type(updateMonthEn)
    cy.submitForm().submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('months', updateMonthKm)
    cy.dataGridSelectRow('months')
    cy.wait(1000)
  })
})
