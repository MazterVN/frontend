describe('Working with roles feature by Tester Role', () => {
  beforeEach(() => {
    cy.viewport(2048, 1452)
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('create student-attendance multiple', () => {
    cy.visit('/attendances/multiple').wait(3000)

    cy.setBearerToken()

    // Define commonly used IDs to avoid repetition
    const SUBJECT_GROUPING_ID = 'fa96241b-4668-4683-b704-1e9dc098b5fb'
    const SERVICE_DETAIL_ID = 'd30ce352-b637-4530-999a-ad4c70dd8f13'
    const SUBJECT_GROUPING_DETAIL_ID_1 = '4893a2a7-c722-4d92-b15d-c9e1584b3411'
    const SUBJECT_GROUPING_DETAIL_ID_2 = '1e8f7bd2-7c34-4523-8efd-d876e2a35240'

    // Days of week IDs mapped to make code more readable
    const DAYS_OF_WEEK = {
      MONDAY: '3a43062a-3a33-4719-a592-46aef4b68012',
      TUESDAY: '81da2cf1-eea9-44fa-b0a7-76f96c9ba09b',
      WEDNESDAY: '7fb13d75-ac90-406d-b460-d9a2a68fdfb6',
      THURSDAY: '226b60db-6ff3-478a-ae40-da47f523f40a',
      FRIDAY: '39e296a5-faf7-4244-84e5-89868256e28e',
      SATURDAY: '7728ee36-848b-4d2a-81be-cc497668ca7e',
      SUNDAY: '8288c40e-c2d1-4207-b9b9-640a7de5756c',
    }

    const TIME_SLOTS = {
      MORNING: {
        startTime: '07:00:00',
        endTime: '08:45:00',
      },
      MID_DAY: {
        startTime: '09:00:00',
        endTime: '10:45:00',
      },
    }

    // First time slot timetables (7:00-8:45)
    const morningTimetables = [
      {
        id: '2ef0e0ca-bedd-4820-91f1-0f4da4cdfcf7',
        daysOfWeekId: DAYS_OF_WEEK.MONDAY,
      },
      {
        id: '62afa54f-74ce-4e59-bcad-f6501cf1ec76',
        daysOfWeekId: DAYS_OF_WEEK.TUESDAY,
      },
      {
        id: '822cbe81-9fc7-4fa5-8b76-a1af8a12bcb2',
        daysOfWeekId: DAYS_OF_WEEK.WEDNESDAY,
      },
      {
        id: '6b5473d4-8515-4bd8-af54-ea79f4171e68',
        daysOfWeekId: DAYS_OF_WEEK.THURSDAY,
      },
      {
        id: '5a270314-451d-41e2-9340-3008ca602895',
        daysOfWeekId: DAYS_OF_WEEK.FRIDAY,
      },
      {
        id: '22521f9b-a186-468a-bf97-95f1b768eee9',
        daysOfWeekId: DAYS_OF_WEEK.SATURDAY,
      },
      {
        id: 'ed3251c1-8b7b-4a83-b154-a540add63e2e',
        daysOfWeekId: DAYS_OF_WEEK.SUNDAY,
      },
    ].map(timetable => ({
      ...timetable,
      ...TIME_SLOTS.MORNING,
      subjectGroupingId: SUBJECT_GROUPING_ID,
      subjectGroupingDetailId: SUBJECT_GROUPING_DETAIL_ID_1,
      serviceDetailId: SERVICE_DETAIL_ID,
    }))

    // Second time slot timetables (9:00-10:45)
    const midDayTimetables = [
      {
        id: 'f60efedf-49ce-45dc-8aa3-3a712d70dffa',
        daysOfWeekId: DAYS_OF_WEEK.MONDAY,
      },
      {
        id: 'c1185304-d930-4ba4-a340-1923a6faae2d',
        daysOfWeekId: DAYS_OF_WEEK.TUESDAY,
      },
      {
        id: 'ee7064b4-af33-4884-9d70-aed7d5e13f6b',
        daysOfWeekId: DAYS_OF_WEEK.WEDNESDAY,
      },
      {
        id: '9ba7aed6-2b29-48fc-be3d-7d48fe9ebb0f',
        daysOfWeekId: DAYS_OF_WEEK.THURSDAY,
      },
      {
        id: 'e45fce0f-838f-43e7-ad75-694a3b35df9e',
        daysOfWeekId: DAYS_OF_WEEK.FRIDAY,
      },
      {
        id: 'c931622a-401b-450c-9fcf-1293f689d695',
        daysOfWeekId: DAYS_OF_WEEK.SATURDAY,
      },
      {
        id: '1f96dd11-22ad-4662-8316-41f1c8a9ba81',
        daysOfWeekId: DAYS_OF_WEEK.SUNDAY,
      },
    ].map(timetable => ({
      ...timetable,
      ...TIME_SLOTS.MID_DAY,
      subjectGroupingId: SUBJECT_GROUPING_ID,
      subjectGroupingDetailId: SUBJECT_GROUPING_DETAIL_ID_2,
      serviceDetailId: SERVICE_DETAIL_ID,
    }))

    // GraphQL mutation for creating timetables
    const timetableMutation = `
      mutation BulkCreateUpsertTimetable($input: BulkCreateUpsertTimetableInput!) {
        bulkCreateUpsertTimetable(input: $input) {
          errors {
            fields
            message
          }
          result {
            id
          }
        }
      }
    `

    // Seed timetable data
    cy.seedGraphqlData(
      timetableMutation,
      {
        input: {
          subjectGroupingId: SUBJECT_GROUPING_ID,
          serviceDetailId: SERVICE_DETAIL_ID,
          timetables: [...morningTimetables, ...midDayTimetables],
        },
      },
    )

    // GraphQL mutation for creating timetable employees
    const timetableEmployeeMutation = `
      mutation CreateRelatedUpsertTimetableEmployee($input: CreateRelatedUpsertTimetableEmployeeInput!) {
        createRelatedUpsertTimetableEmployee(input: $input) {
          errors {
            message
            fields
          }
          result {
            id
          }
        }
      }
    `

    // Seed first employee timetable assignment (morning schedule)
    cy.seedGraphqlData(
      timetableEmployeeMutation,
      {
        input: {
          id: 'ee5a6cb1-b389-4c7c-9c75-675ea00da7a3',
          employeeId: 'e248ac0a-a37a-4307-8bf7-28387778dd4c',
          type: 'DEFAULT',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          timetableEmployeeTimetables: [
            { id: '52ebfe6b-fd7b-47fb-be20-09efab2fe160', timetableId: '22521f9b-a186-468a-bf97-95f1b768eee9' },
            { id: '8f178ffd-625c-4527-a740-59552e4d191b', timetableId: '2ef0e0ca-bedd-4820-91f1-0f4da4cdfcf7' },
            { id: 'e3020663-16c7-4f87-8bfd-bd40a69b533f', timetableId: '5a270314-451d-41e2-9340-3008ca602895' },
            { id: '7aa49286-5982-404a-8ea6-3a2a47b56712', timetableId: '62afa54f-74ce-4e59-bcad-f6501cf1ec76' },
            { id: 'dadbb7a7-0895-4c83-aae5-f605eebe8f8c', timetableId: '6b5473d4-8515-4bd8-af54-ea79f4171e68' },
            { id: 'a1cd01d0-76b3-430f-8204-a72a8e90e13e', timetableId: '822cbe81-9fc7-4fa5-8b76-a1af8a12bcb2' },
            { id: '920dfc26-7fd7-4b38-9026-50f453fc5195', timetableId: 'ed3251c1-8b7b-4a83-b154-a540add63e2e' },
          ],
        },
      },
    )

    // Seed second employee timetable assignment (mid-day schedule)
    cy.seedGraphqlData(
      timetableEmployeeMutation,
      {
        input: {
          id: 'e7b8e8ea-d58b-4d6a-be71-42056d4d398f',
          employeeId: '20671cd3-7931-413e-9a2a-56c56d1d605d',
          type: 'DEFAULT',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          timetableEmployeeTimetables: [
            { id: 'be4910a5-33d6-4869-8d2f-05e99e2bf926', timetableId: '1f96dd11-22ad-4662-8316-41f1c8a9ba81' },
            { id: '196da3be-0296-41de-9ce4-03301248c0ab', timetableId: '9ba7aed6-2b29-48fc-be3d-7d48fe9ebb0f' },
            { id: '801276dc-2716-442e-9f62-7531c2f3304d', timetableId: 'c1185304-d930-4ba4-a340-1923a6faae2d' },
            { id: '72bf1b0f-9896-43fd-ba61-e2f620fd5393', timetableId: 'c931622a-401b-450c-9fcf-1293f689d695' },
            { id: '9ceadcab-2293-475a-a0bd-3759c11356e1', timetableId: 'e45fce0f-838f-43e7-ad75-694a3b35df9e' },
            { id: '6ed12e0d-2244-40e0-8fe1-effc752cd3d6', timetableId: 'ee7064b4-af33-4884-9d70-aed7d5e13f6b' },
            { id: 'c0b55cbb-fa68-4afa-8d06-7d95427e75b1', timetableId: 'f60efedf-49ce-45dc-8aa3-3a712d70dffa' },
          ],
        },
      },
    )
    // End of Seed Timetable and TimetableEmployee

    cy.selectSetting('study-year-id', '១៩', 'b1a7d0b6-8eb6-452a-932f-69e09e5338a6')
    cy.selectSetting('subject-grouping-id', 'ថ', 'fa96241b-4668-4683-b704-1e9dc098b5fb')
    cy.selectSetting('service-detail-id', '11', '1ff1b1f2-a6ff-4ec1-86b3-32028d78bacf')
    cy.get('[data-testid="date-range"] .el-range-input').eq(0).clear().type('ច, 03/04/2025')
    cy.get('[data-testid="date-range"] .el-range-input').eq(1).clear().type('អា, 09/04/2025')
    cy.wait(2000)
    cy.dataTestId('day-0-0').click()
    cy.dataTestId('day-0-1').click()
    cy.dataTestId('day-0-2').click()
    cy.dataTestId('day-0-3').click()
    cy.dataTestId('day-0-4').click()
    cy.dataTestId('day-0-5').click()
    cy.dataTestId('day-0-6').click()

    cy.dataTestId('day-1-0').click()
    cy.dataTestId('day-1-1').click()
    cy.dataTestId('day-1-2').click()
    cy.dataTestId('day-1-3').click()
    cy.dataTestId('day-1-4').click()
    cy.dataTestId('day-1-5').click()
    cy.dataTestId('day-1-6').click()

    cy.get('.e-multi-select-wrapper.e-down-icon').click().wait(300)
    cy.get('[data-value="14c577ef-5204-40c1-95ec-ca615d53efd1"]').click()
    cy.get('[data-value="f08468f3-dd0a-4d91-90a1-c65e65c0cc06"]').click()
    cy.get('body').click(0, 0).wait(300)

    cy.selectSetting('attendance-type', 'វ', 'present_late_attendance_type')
    cy.dataTestId('late-time-input').type('15')
    cy.dataTestId('note-input').clear().type('ម៉ូតូខូច')
    cy.dataTestId('apply-and-save-button')
      .click()
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(3000)

    cy.get('.e-multi-select-wrapper.e-down-icon').trigger('mouseover')
    cy.get('.e-chips-close.e-close-hooker').click()

    cy.get('.e-multi-select-wrapper.e-down-icon').click().wait(300)
    cy.get('[data-value="603b5729-c496-44f1-861d-383648bcfe4e"]').click()
    cy.get('body').click(0, 0).wait(300)
    cy.dataTestId('is-absent').click()
    cy.dataTestId('note-input').clear().type('មានជម្ងឺត្រូវទៅពេទ្យ')

    // Alias waiting for request open file manager
    cy.intercept('POST', '**/api/AmazonS3Provider/AmazonS3FileOperations').as('amazonS3Request')

    cy.dataTestId('add-attachment-button').click().wait(300)
    cy.dataTestId('attachment-button-0')
      .click()
    cy.wait('@amazonS3Request')
    // End Open file manager

    // Alias for next time
    cy.contains('li.e-list-item', 'Test Folder').as('openTestFolder')
    // Open test folder
    cy.get('@openTestFolder').dblclick()
    cy.wait('@amazonS3Request')

    cy.contains('div.e-text-content', 'Testing.docx').rightclick()
    cy.wait(500)
    cy.contains('li.e-menu-item', 'Choose').click().wait(300)
    cy.closeModalX()
    cy.dataTestId('attachment-note-0').type('ខិលិតពេទ្យ')

    cy.dataTestId('add-attachment-button').click().wait(300)
    cy.dataTestId('attachment-button-1')
      .click()
    cy.wait('@amazonS3Request')
    // End Open file manager

    // Alias for next time
    cy.contains('li.e-list-item', 'Test Folder').as('openTestFolder')
    // Open test folder
    cy.get('@openTestFolder').dblclick()
    cy.wait('@amazonS3Request')

    cy.contains('div.e-text-content', 'Document.docx').rightclick()
    cy.wait(500)
    cy.contains('li.e-menu-item', 'Choose').click().wait(300)
    cy.closeModalX()
    cy.dataTestId('attachment-note-1').type('វិក័យបត្រ')
    cy.dataTestId('apply-and-save-button')
      .click()
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(3000)

    cy.dataTestId('remove-attachment-button-1').click()

    cy.dataTestId('attachment-button-0')
      .click()
    cy.wait('@amazonS3Request')
    // End Open file manager

    // Alias for next time
    cy.contains('li.e-list-item', 'Test Folder').as('openTestFolder')
    // Open test folder
    cy.get('@openTestFolder').dblclick()
    cy.wait('@amazonS3Request')

    cy.contains('div.e-text-content', 'Take-notes.pdf').rightclick()
    cy.wait(500)
    cy.contains('li.e-menu-item', 'Choose').click().wait(300)
    cy.closeModalX()
    cy.dataTestId('attachment-note-0').type(' កែប្រែ')

    cy.dataTestId('apply-and-save-button')
      .click()
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(3000)
  })
})
