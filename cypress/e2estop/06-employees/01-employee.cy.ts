describe('Working with employees feature by Tester Role', () => {
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should list employees in khmer language', () => {
    cy.visit('/employees')
    cy.wait(3000)

    cy.get('#grid-employees').should('be.visible')
    cy.dataGridSearch('employees', 'អៀ ហ៊ុយឃឹម')

    cy.get('#grid-employees_content_table')
      .contains('tbody .e-row', 'អៀ ហ៊ុយឃឹម')
      .should('exist')
    cy.get('#grid-employees_content_table')
      .contains('tbody .e-row', 'គ្រូបង្រៀន')
      .should('exist')
    cy.wait(1000)
  })
  it('should list employees in khmer language', () => {
    cy.visit('/en/employees')
    cy.wait(3000)

    cy.get('#grid-employees').should('be.visible')
    cy.dataGridSearch('employees', 'AIE HUYKHIM')

    cy.get('#grid-employees_content_table')
      .contains('tbody .e-row', 'AIE HUYKHIM')
      .should('exist')
    cy.get('#grid-employees_content_table')
      .contains('tbody .e-row', 'Teacher')
      .should('exist')
    cy.wait(1000)
  })
  it('should create and update a record', () => {
    cy.visit('/employees')
    cy.wait(3000)

    cy.openCreateModal()

    cy.dataTestId('name').type('(តេស្ដ បុគ្គលិក)')
    cy.dataTestId('latin').type('(Test employee)')
    cy.selectSetting('gender', 'ប្រុស', 'male_gender_type')
    cy.get('[data-testid="dob"] input.el-input__inner').type('12/12/2012').blur()
    cy.selectSetting('type', 'នាយករង', 'deputy_director_m_employee_role_type')
    cy.dataTestId('tel').type('0123456789')
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    // End Create

    cy.get('#grid-employees').should('be.visible')
    cy.dataGridSearch('employees', 'អៀ ហ៊ុយឃឹម')
    cy.dataGridSelectRow('employees')
    cy.openEditModal()

    cy.dataTestId('name').clear().type('(តេស្ដ បុគ្គលិក កែប្រែ)')
    cy.dataTestId('latin').clear().type('(Test employee update)')
    cy.selectSetting('gender', 'ស្រី', 'female_gender_type')
    cy.get('[data-testid="dob"] input.el-input__inner').clear().type('10/10/2010').blur()
    cy.selectSetting('type', 'នាយករង', 'deputy_director_employee_role_type')
    cy.dataTestId('tel').clear().type('0987654321')
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('employees', 'update')
    cy.wait(1000)
  })
})
