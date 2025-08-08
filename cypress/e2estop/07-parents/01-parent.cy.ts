describe('Working with students feature by Tester Role', () => {
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should list', () => {
    cy.visit('/parents').wait(3000)
    cy.get('#grid-parents').should('be.visible')
    cy.get('#grid-parents_content_table')
      .contains('tbody .e-row', 'ម្ដាយ')
      .should('exist')
    cy.wait(1000)
  })
  it('should list student', () => {
    cy.visit('/en/parents').wait(3000)

    cy.get('#grid-parents').should('be.visible')
    cy.get('#grid-parents_content_table')
      .contains('tbody .e-row', 'Mother')
      .should('exist')
    cy.wait(1000)
  })
  it('should create', () => {
    cy.visit('/parents').wait(3000)
    cy.openCreateModal()

    cy.dataTestId('name').type('អាណាព្យាបាល តេស្ដ')
    cy.dataTestId('latin').type('Parents Test')
    cy.selectSetting('type', 'ម្ដាយ', 'mother_parent_type')
    cy.selectSetting('job', 'បុគ្គលិក', 'employee_job_type')
    cy.dataTestId('tel').type('0123456789')
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
  })
  it('should update', () => {
    cy.visit('/parents').wait(3000)

    cy.get('#grid-parents').should('be.visible')
    cy.dataGridSearch('parents', 'YEAN CHHEAN')
    cy.dataGridSelectRow('parents')
    cy.openEditModal()
    cy.dataTestId('name').type(' កែប្រែ')
    cy.dataTestId('latin').type(' Update')
    cy.selectSetting('type', 'ឪពុក', 'father_parent_type')
    cy.selectSetting('job', 'ជំនួញផ្ទាល់ខ្លួន', 'personal_business_job_type')
    cy.dataTestId('tel').clear().type('0987654321')
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
  })
})
