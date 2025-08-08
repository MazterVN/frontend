describe('Working with students feature by Tester Role', () => {
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should list students in khmer language', () => {
    cy.visit('/students/note').wait(3000)
    cy.dataGridSearch('student-note', 'ឌឺដាក់គ្នា')
    cy.get('#grid-student-note').should('be.visible')
    cy.get('#grid-student-note_content_table')
      .contains('tbody .e-row', 'ឌឺដាក់គ្នា')
      .contains('tbody .e-row', '18/05/2024 05:47 PM')
      .contains('tbody .e-row', '18/05/2024 05:49 PM')
      .should('exist')
    cy.wait(1000)
  })
  it('should create update', () => {
    // Alias waiting for request open file manager
    cy.intercept('POST', '**/api/AmazonS3Provider/AmazonS3FileOperations').as('amazonS3Request')

    cy.visit('/students/note').wait(3000)
    cy.openCreateModal()
    cy.dataTestId('title').type('អត់ចូលរៀន')
    cy.dataTestId('date-time').click()
    cy.get('.is-text > span').click()
    cy.insertTextIntoEditor(
      [
        '**Bold text on line 1**\n*Italic text on line 2*\nRegular text on line 3',
      ],
    )

    cy.dataTestId('add-attachment-btn').click()
    cy.dataTestId('attachment-key-btn-0').click()
    cy.wait('@amazonS3Request')
      .wait(200)
    cy.contains('li.e-list-item', 'Test Folder')
      .dblclick()
      .wait('@amazonS3Request')
    cy.contains('div.e-text-content', 'Document.docx')
      .rightclick()
      .wait(200)
    cy.contains('li.e-menu-item', 'Choose')
      .click()
      .wait(200)
    cy.closeModalX()

    cy.selectSetting('attachment-type-0', 'លិខិតព្រមាន', 'warning_letter_attachment_type')

    cy.dataTestId('add-attachment-btn').click()
    cy.dataTestId('attachment-key-btn-1').click()
    cy.wait('@amazonS3Request')
      .wait(200)
    cy.contains('li.e-list-item', 'Test Folder')
      .dblclick()
      .wait('@amazonS3Request')
    cy.contains('div.e-text-content', 'Testing.docx')
      .rightclick()
      .wait(200)
    cy.contains('li.e-menu-item', 'Choose')
      .click()
      .wait(200)
    cy.closeModalX()
    cy.selectSetting('attachment-type-1', 'កិច្ចសន្យា', 'contract_attachment_type')

    cy.dataTestId('add-student-service-btn')
      .click()
      .wait(200)
    cy.selectSetting('student-service-id-0', 'ទុន ចំរ៉ើន', '84ac67e0-9515-41ae-acaf-46654bafcaf7')
    cy.dataTestId('add-student-service-btn')
      .click()
      .wait(200)
    cy.selectSetting('student-service-id-1', 'រឿន យ៉េន', 'f08468f3-dd0a-4d91-90a1-c65e65c0cc06')

    cy.dataTestId('add-student-parent-btn')
      .click()
      .wait(200)
    cy.selectSetting('student-parent-id-0', 'ឈ លីនដា', '00181f76-05c5-49f3-b259-e0fccf7feb8d')

    cy.dataTestId('add-student-parent-btn')
      .click()
      .wait(200)
    cy.selectSetting('student-parent-id-1', 'គីម ហួយ', '0043b8e4-c58a-4fbf-9478-da8fe8349f90')

    cy.dataTestId('add-employee-btn')
      .click()
      .wait(200)
    cy.selectSetting('student-note-employee-0', 'អៀ ហ៊ុយឃឹម', 'e248ac0a-a37a-4307-8bf7-28387778dd4c')

    cy.dataTestId('add-employee-btn')
      .click()
      .wait(200)
    cy.selectSetting('student-note-employee-1', 'ខឹម ប៊ុនថ', '20671cd3-7931-413e-9a2a-56c56d1d605d')

    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    // End of Create

    cy.dataGridSearch('student-note', 'អត់ចូលរៀន')
    cy.dataGridSelectRow('student-note')
    cy.openEditModal()

    cy.dataTestId('title').type(' កែប្រែ')
    cy.dataTestId('date-time').click()
    cy.get('.is-text > span').click()
    cy.insertTextIntoEditor(
      [
        '**Bold text on line 1**\n*Italic text on line 2*\nRegular text on line 3\nUpdate on this line',
      ],
    )

    cy.dataTestId('remove-attachment-btn-1').click()
    cy.dataTestId('attachment-key-btn-0').click()
    cy.wait('@amazonS3Request')
      .wait(200)
    cy.contains('li.e-list-item', 'Test Folder')
      .dblclick()
      .wait('@amazonS3Request')
    cy.contains('div.e-text-content', 'Take-notes.pdf')
      .rightclick()
      .wait(200)
    cy.contains('li.e-menu-item', 'Choose').click().wait(500)
    cy.closeModalX()

    cy.dataTestId('remove-student-service-1')
      .click()
      .wait(200)
    cy.selectSetting('student-service-id-0', 'ណាក់ វណ្ណ', '14c577ef-5204-40c1-95ec-ca615d53efd1')

    cy.dataTestId('remove-student-parent-1')
      .click()
      .wait(200)
    cy.selectSetting('student-parent-id-0', 'គីម ហួយ', '0043b8e4-c58a-4fbf-9478-da8fe8349f90')

    cy.dataTestId('remove-employee-1')
      .click()
      .wait(200)
    cy.selectSetting('student-note-employee-0', 'ហន ដា', '658b655b-0b3d-41a8-933e-792cca24fbe8')

    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.wait(2000)
    // End of Update

    cy.contains('a', 'របាយការណ៍').click()
    cy.wait(2000)
    cy.dataGridSearch('student-note-report', 'ណាក់ វណ្ណា')
    cy.dataGridSelectRow('student-note-report', 4)
    cy.get('button#view').click()
    // cy.dataTestId('download-report').click()
    cy.wait(2000)
  })
})
