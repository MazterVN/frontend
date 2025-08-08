describe('Working with subject-grouping feature by Tester Role', () => {
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create, list with search, update', () => {
    cy.visit('/student-scores/subject-grouping').wait(3000)
    cy.openCreateModal()
    cy.selectSetting('study-year-id', '២០១៩', 'b1a7d0b6-8eb6-452a-932f-69e09e5338a6')
    cy.selectSetting('gpa-condition-id', 'GPA', 'ff3e570c-058b-4b44-937d-3e766051fa6e')
    cy.dataTestId('gpa').type('70')
    cy.dataTestId('note').type('This is a test subject grouping')

    cy.selectSetting('service-detail-service-id-0', 'ថ', '20a3a50d-77c2-4333-9eb0-39e6ed83ffc4')
    cy.selectSetting('service-detail-id-0', '12', '9c67df9b-c899-4315-8cf7-5d478e982cdd')

    cy.dataTestId('add-service-detail-btn').click()
    cy.selectSetting('service-detail-service-id-1', 'ថ', '20a3a50d-77c2-4333-9eb0-39e6ed83ffc4')
    cy.selectSetting('service-detail-id-1', '12', '91fa937e-1547-4bcc-8d47-94e6b24cd738')

    cy.dataTestId('add-service-detail-btn').click()
    cy.selectSetting('service-detail-service-id-2', 'ថ', '20a3a50d-77c2-4333-9eb0-39e6ed83ffc4')
    cy.selectSetting('service-detail-id-2', '12', 'e7e43236-22d5-4b0f-ae2a-1c56ccdff5be')

    cy.selectSetting('subject-id-0', 'គ', 'bb1cf4f8-9439-4d6b-b3b7-3984d6ef41b6')
    cy.selectSetting('score-type-id-0', 'ប្រ', 'f8fc1ae4-37fa-4c6a-a5dc-c7b309651579')
    cy.dataTestId('max-score-0').type('70')

    cy.dataTestId('add-detail-btn').click()
    cy.selectSetting('subject-id-1', 'ភ', 'c237a7d9-e2f0-44ca-a38b-ed5f99e6e5be')
    cy.selectSetting('score-type-id-1', 'ប្រ', 'f8fc1ae4-37fa-4c6a-a5dc-c7b309651579')
    cy.dataTestId('max-score-1').type('70')

    cy.dataTestId('add-detail-btn').click()
    cy.selectSetting('subject-id-2', 'រ', 'ea6b8578-948a-4116-96b0-38eb41f1b427')
    cy.selectSetting('score-type-id-2', 'ប្រ', 'f8fc1ae4-37fa-4c6a-a5dc-c7b309651579')
    cy.dataTestId('max-score-2').type('70')
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()

    cy.dataGridSearch('subject-grouping', 'This is a test subject grouping')
    cy.dataGridSelectRow('subject-grouping')
    cy.openEditModal()

    cy.dataTestId('gpa').clear().type('50')
    cy.dataTestId('note').type(' updated')

    cy.dataTestId('remove-service-detail-2').click()
    cy.selectSetting('service-detail-id-0', '12', '726f28eb-8773-4a40-b274-a990907ad8d2')
    cy.dataTestId('remove-detail-2').click()
    cy.selectSetting('score-type-id-0', 'ក', '7c922421-cac4-45a4-a1c3-93231582bcd7')
    cy.dataTestId('max-score-0').clear().type('50')
    cy.selectSetting('score-type-id-1', 'ក', '7c922421-cac4-45a4-a1c3-93231582bcd7')
    cy.dataTestId('max-score-1').clear().type('50')
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
  })
})
