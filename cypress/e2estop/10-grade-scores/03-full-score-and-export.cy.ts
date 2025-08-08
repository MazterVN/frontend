describe('Working with grade-score feature by Tester Role', () => {
  beforeEach(() => {
    cy.viewport(2048, 1152)
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should enter score, grouping-score and export', () => {
    // Score Grouping
    cy.visit('/student-scores/score-grouping').wait(3000)
    cy.openCreateModal()
    cy.dataTestId('name').type('តេស្ដក្រុមពិន្ទុ')
    cy.dataTestId('name-en').type('Test score template')
    cy.dataTestId('note').type('For testing score template')
    cy.selectSetting('study-year-id', '២០១៩', 'b1a7d0b6-8eb6-452a-932f-69e09e5338a6')
    cy.selectSetting('subject-grouping-id', 'ថ្នាក់', 'fa96241b-4668-4683-b704-1e9dc098b5fb')

    cy.selectSetting('months-of-year-id-0', 'ធ', '62f1d8c6-7eac-4f3a-b29d-d85a960fa05e')
    cy.selectSetting('type-0', 'ប្រ', 'semester_exam_type')

    cy.dataTestId('add-relative-btn').click()
    cy.selectSetting('months-of-year-id-1', 'ក', '2f2fa6b8-637b-4ae8-b578-b90afe078527')
    cy.selectSetting('type-1', 'ប្រ', 'monthly_exam_type')

    cy.dataTestId('add-relative-btn').click()
    cy.selectSetting('months-of-year-id-2', 'ម', '3ce23b81-76b5-4255-acc4-73919a2b8af7')
    cy.selectSetting('type-2', 'ប្រ', 'monthly_exam_type')

    cy.dataTestId('add-relative-btn').click()
    cy.selectSetting('months-of-year-id-3', 'ម', '4d37b251-db55-40f3-83e4-2caa22e1c77b')
    cy.selectSetting('type-3', 'ប្រ', 'monthly_exam_type')
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()

    cy.dataGridSearch('grade-score-template', 'តេស្ដក្រុមពិន្ទុ')
    cy.dataGridSelectRow('grade-score-template')
    cy.openEditModal()
    cy.dataTestId('name').clear().type('តេស្ដប្រចាំឆមាស')
    cy.dataTestId('name-en').clear().type('Test semester')
    cy.dataTestId('note').type(' update')

    cy.selectSetting('months-of-year-id-0', 'ម', '7ec370df-e181-462e-9c89-c431800b67bf')
    cy.selectSetting('type-0', 'ប្រ', 'monthly_exam_type')
    cy.selectSetting('type-2', 'ប្រ', 'semester_exam_type')
    cy.dataTestId('remove-detail-3').click()
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('grade-score-template', 'តេស្ដប្រចាំឆមាស')

    // Enter score in 3 months
    cy.get('a[href="/student-scores"]').eq(0).click().wait(3000)
    cy.visit('/student-scores').wait(3000)
    cy.dataGridSearch('student-scores', 'ថ្នាក់ទី ១១ gpa 50 សម្រាប់តេស្ដចុះឈ្មោះ')
    cy.dataGridSelectRow('student-scores')
    cy.get('button#score').click().wait(500)
    cy.selectSetting('service-detail-id', '11', '1ff1b1f2-a6ff-4ec1-86b3-32028d78bacf')
    cy.wait(1000)
    cy.get('.e-multi-select-wrapper').click().wait(300)
    cy.get('.e-selectall-parent').click().wait(300)
    cy.dataTestId('months-of-year-id').eq(0).parent().click().wait(300)

    // January
    cy.selectSetting('months-of-year-id', 'ម', '7ec370df-e181-462e-9c89-c431800b67bf')

    cy.get('td[aria-colindex="7"]').eq(0).dblclick()
    cy.get('#scoreGridscores___0___score').type('30').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(0).dblclick()
    cy.get('#scoreGridscores___1___score').type('38').blur()
    cy.wait(300)

    cy.get('td[aria-colindex="7"]').eq(1).dblclick()
    cy.get('#scoreGridscores___0___score').type('40').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(1).dblclick()
    cy.get('#scoreGridscores___1___score').type('42').blur()
    cy.wait(300)

    cy.get('td[aria-colindex="7"]').eq(2).dblclick()
    cy.get('#scoreGridscores___0___score').type('50').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(2).dblclick()
    cy.get('#scoreGridscores___1___score').type('44').blur()
    cy.wait(300)

    cy.get('button#scoreGrid_update').click().wait(300)
    cy.get('#scoreGridEditConfirm > .e-footer-content > .e-primary').click().wait(300)
    cy.get('button#refresh').click().wait(300)
    // End of January

    // February
    cy.selectSetting('months-of-year-id', 'ក', '2f2fa6b8-637b-4ae8-b578-b90afe078527')
    cy.get('td[aria-colindex="7"]').eq(0).dblclick()
    cy.get('#scoreGridscores___0___score').type('47').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(0).dblclick()
    cy.get('#scoreGridscores___1___score').type('50').blur()
    cy.wait(300)

    cy.get('td[aria-colindex="7"]').eq(1).dblclick()
    cy.get('#scoreGridscores___0___score').type('45').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(1).dblclick()
    cy.get('#scoreGridscores___1___score').type('39').blur()
    cy.wait(300)

    cy.get('td[aria-colindex="7"]').eq(2).dblclick()
    cy.get('#scoreGridscores___0___score').type('46').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(2).dblclick()
    cy.get('#scoreGridscores___1___score').type('40').blur()
    cy.wait(300)

    cy.get('button#scoreGrid_update').click().wait(300)
    cy.get('#scoreGridEditConfirm > .e-footer-content > .e-primary').click().wait(300)
    cy.get('button#refresh').click().wait(300)
    // End of February

    // March
    cy.selectSetting('months-of-year-id', 'ម', '3ce23b81-76b5-4255-acc4-73919a2b8af7')
    cy.get('td[aria-colindex="7"]').eq(0).dblclick()
    cy.get('#scoreGridscores___0___score').type('37').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(0).dblclick()
    cy.get('#scoreGridscores___1___score').type('45').blur()
    cy.wait(300)

    cy.get('td[aria-colindex="7"]').eq(1).dblclick()
    cy.get('#scoreGridscores___0___score').type('30').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(1).dblclick()
    cy.get('#scoreGridscores___1___score').type('39').blur()
    cy.wait(300)

    cy.get('td[aria-colindex="7"]').eq(2).dblclick()
    cy.get('#scoreGridscores___0___score').type('49').blur()
    cy.wait(300)
    cy.get('td[aria-colindex="8"]').eq(2).dblclick()
    cy.get('#scoreGridscores___1___score').type('50').blur()
    cy.wait(300)

    cy.get('button#scoreGrid_update').click().wait(300)
    cy.get('#scoreGridEditConfirm > .e-footer-content > .e-primary').click().wait(300)
    cy.get('button#refresh').click().wait(300)
    cy.closeModalX()
    // End of March

    // Export score monthly
    cy.get('a[href="/student-scores/subject-grouping"]').click().wait(3000)
    cy.dataGridSearch('subject-grouping', 'ថ្នាក់ទី ១១ gpa 50 សម្រាប់តេស្ដចុះឈ្មោះ')
    cy.dataGridSelectRow('subject-grouping')
    cy.get('button#export').click()
    cy.selectSetting('service-detail-id', '11', '1ff1b1f2-a6ff-4ec1-86b3-32028d78bacf')
    cy.selectSetting('months-of-year-id', 'ម', '7ec370df-e181-462e-9c89-c431800b67bf')

    cy.intercept('POST', 'http://127.0.0.1:4000/gql').as('exportRequest')

    // Certificate
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-monthly-certificate').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // Transcript
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-monthly-transcript').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // Ranking Table
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-monthly-ranking-table').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // Ranking Table Excel
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-monthly-ranking-table-excel').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // Check List
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-monthly-check-list').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // Check List Template
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-monthly-check-list-template').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // Honor List
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-monthly-honor-list').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)
    cy.closeModalX()
    // End of Export Score Monthly

    // Export Score Grouping
    cy.get('a[href="/student-scores/score-grouping"]').click().wait(3000)
    cy.dataGridSearch('grade-score-template', 'តេស្ដប្រចាំឆមាស')
    cy.dataGridSelectRow('grade-score-template')
    cy.get('button#export').click()
    cy.selectSetting('service-detail-id', '11', '1ff1b1f2-a6ff-4ec1-86b3-32028d78bacf')

    // 01-Semester List
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-semester-list').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // 02-Semester List Summary
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-semester-list-summary').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // 03-Semester List Summary xlsx
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-semester-list-summary-xlsx').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // 04-Semester certificate
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-semester-certificate').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // 05-Semester certificate formal
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-semester-certificate-formal').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // 06-Semester transcript
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-semester-transcript').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)

    // 07-Semester honor list
    cy.dataTestId('export-btn').click().wait(300)
    cy.dataTestId('export-score-semester-honor-list').click()
    cy.wait('@exportRequest')
    cy.wait(3000)
    cy.submitAssertSuccessful('បាននាំចេញជោគជ័យ')
    cy.wait(1000)
    cy.closeModalX()
  })
})
