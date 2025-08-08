describe('working with student-service', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should transfer', () => {
    cy.visit('/students/services').wait(3000)
    cy.reload()
    cy.dataGridSearch('student-services', 'Test Enrollment')
    cy.dataGridSelectRow('student-services')
    cy.get('button#transfer')
      .click()
      .wait(1000)
    cy.dataTestId('date-time').click()
    cy.get('.is-text > span').click()
    cy.selectSetting('service-detail-id', '11 ខ', 'd69331a8-8f22-414b-a8a0-d3e68cc476e6')
    cy.submitForm()
      .submitAssertSuccessful('ប្តូរសេវាកម្មបានជោគជ័យ')
    cy.closeModal()
  })
})
