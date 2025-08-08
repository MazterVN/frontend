describe('Working with grade-level feature by Tester Role', () => {
  Cypress.on('uncaught:exception', (err, _) => {
    // returning false prevents Cypress from failing the test
    if (err.message.includes('Cannot read properties of null (reading \'focus\')')) {
      return false
    }
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create, list with search, update', () => {
    cy.visit('/student-scores/grade-level').wait(3000)
    cy.openCreateModal()
    cy.dataTestId('name').type('GPA 50 for Testing')
    cy.dataTestId('passed-gpa').type('40')
    cy.dataTestId('description').type('This is a test grade level')

    cy.dataTestId('start-cond-op-0').click()
    cy.contains('[role="option"]', '<=').click()
    cy.dataTestId('start-cond-value-0').type('51')

    cy.dataTestId('end-cond-op-0').click()
    cy.contains('[role="option"]', '>').click()
    cy.dataTestId('end-cond-value-0').type('41')
    cy.selectSetting('grade-level-id-0', 'ខ', '050c2432-e34c-4da0-8f2f-ae536178aaeb')

    cy.dataTestId('add-relative-btn').click()
    cy.dataTestId('start-cond-op-1').click()
    cy.contains('[role="option"]', '<').click()
    cy.dataTestId('start-cond-value-1').type('45')

    cy.dataTestId('end-cond-op-1').click()
    cy.contains('[role="option"]', '>=').click()
    cy.dataTestId('end-cond-value-1').type('40')
    cy.selectSetting('grade-level-id-1', 'ល្អ', '7c82b404-99e1-4d97-807b-7a517f81da56')

    cy.dataTestId('add-relative-btn').click()
    cy.dataTestId('start-cond-op-2').click()
    cy.contains('[role="option"]', '<').click()
    cy.dataTestId('start-cond-value-2').type('40')

    cy.dataTestId('end-cond-op-2').click()
    cy.contains('[role="option"]', '>=').click()
    cy.dataTestId('end-cond-value-2').type('35')
    cy.selectSetting('grade-level-id-2', 'ល្អ', '76b73f31-58f5-4390-addd-b542f568d37b')

    cy.dataTestId('add-relative-btn').click()
    cy.dataTestId('start-cond-op-3').click()
    cy.contains('[role="option"]', '<').click()
    cy.dataTestId('start-cond-value-3').type('35')

    cy.dataTestId('end-cond-op-3').click()
    cy.contains('[role="option"]', '>=').click()
    cy.dataTestId('end-cond-value-3').type('30')
    cy.selectSetting('grade-level-id-3', 'ល្អ', '007a53d0-35c9-473d-98f3-353aad827e8b')

    cy.dataTestId('add-relative-btn').click()
    cy.dataTestId('start-cond-op-4').click()
    cy.contains('[role="option"]', '<').click()
    cy.dataTestId('start-cond-value-4').type('30')

    cy.dataTestId('end-cond-op-4').click()
    cy.contains('[role="option"]', '>=').click()
    cy.dataTestId('end-cond-value-4').type('25')
    cy.selectSetting('grade-level-id-4', 'ម', '750f2b6c-c186-48bd-b533-6ae11bbb74ac')

    cy.dataTestId('add-relative-btn').click()
    cy.dataTestId('start-cond-op-5').click()
    cy.contains('[role="option"]', '<').click()
    cy.dataTestId('start-cond-value-5').type('25')

    cy.dataTestId('end-cond-op-5').click()
    cy.contains('[role="option"]', '>').click()
    cy.dataTestId('end-cond-value-5').type('0')
    cy.selectSetting('grade-level-id-5', 'ល្អ', '1ea6bacc-50d0-4589-a99d-c8562641a255')

    cy.dataTestId('add-relative-btn').click()
    cy.dataTestId('start-cond-op-6').click()
    cy.contains('[role="option"]', '<').click()
    cy.dataTestId('start-cond-value-6').type('25')

    cy.dataTestId('end-cond-op-6').click()
    cy.contains('[role="option"]', '>').click()
    cy.dataTestId('end-cond-value-6').type('99')
    cy.selectSetting('grade-level-id-6', 'ម', '597ff26f-7015-4142-8604-465b2305e084')
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()

    cy.dataGridSearch('grade-level', 'GPA 50 for Testing')
    cy.get('#grid-grade-level').should('be.visible')
    cy.get('#grid-grade-level_content_table')
      .contains('tbody .e-row', 'GPA 50 for Testing')
      .contains('tbody .e-row', 'This is a test grade level')
      .contains('tbody .e-row', '50')
      .should('exist')
      .wait(1000)

    cy.dataGridSelectRow('grade-level')
    cy.openEditModal()
    cy.dataTestId('name').type(' Update')
    cy.dataTestId('passed-gpa').clear().type('50')
    cy.dataTestId('description').type(' Update')
    cy.dataTestId('remove-btn-6').click()

    cy.dataTestId('start-cond-op-0').click()
    cy.contains('[role="option"]', '<').click()
    cy.dataTestId('start-cond-value-0').clear().type('50')

    cy.dataTestId('end-cond-op-0').click()
    cy.contains('[role="option"]', '>=').click()
    cy.dataTestId('end-cond-value-0').clear().type('45')
    cy.selectSetting('grade-level-id-0', 'ល្អ', '1ea6bacc-50d0-4589-a99d-c8562641a255')

    cy.selectSetting('grade-level-id-5', 'ខ', '050c2432-e34c-4da0-8f2f-ae536178aaeb')
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
  })
})
