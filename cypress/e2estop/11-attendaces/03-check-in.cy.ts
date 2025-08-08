describe('Working with roles feature by Tester Role', () => {
  beforeEach(() => {
    cy.viewport(2048, 1452)
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('checking by Teacher', () => {
    cy.visit('/attendances').wait(3000)
    cy.setBearerToken()

    // Define commonly used IDs to avoid repetition
    const SUBJECT_GROUPING_ID = 'fa96241b-4668-4683-b704-1e9dc098b5fb'
    const SERVICE_DETAIL_ID = 'd30ce352-b637-4530-999a-ad4c70dd8f13'
    const SUBJECT_GROUPING_DETAIL_ID_1 = '4893a2a7-c722-4d92-b15d-c9e1584b3411'

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

    // Get current time from system
    const now = new Date()
    const currentHour = now.getHours()

    const time_range = {
      startTime: `${currentHour.toString().padStart(2, '0')}:00:00`,
      endTime: `${currentHour.toString().padStart(2, '0')}:59:59`,
    }
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
      ...time_range,
      subjectGroupingId: SUBJECT_GROUPING_ID,
      subjectGroupingDetailId: SUBJECT_GROUPING_DETAIL_ID_1,
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
          timetables: morningTimetables,
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

    // Get current year for date range
    const currentYear = new Date().getFullYear()
    const startDate = `${currentYear}-01-01`
    const endDate = `${currentYear}-12-31`

    cy.seedGraphqlData(
      timetableEmployeeMutation,
      {
        input: {
          id: 'ee5a6cb1-b389-4c7c-9c75-675ea00da7a3',
          employeeId: 'e248ac0a-a37a-4307-8bf7-28387778dd4c',
          type: 'DEFAULT',
          startDate: startDate,
          endDate: endDate,
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

    cy.pause()
    // End of Seed Timetable and TimetableEmployee
    cy.get('a[href="/attendances/check-in"]').click().wait(3000)

    cy.dataTestId('checked-0')
      .click()
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)

    cy.dataTestId('is-absent-0')
      .click()
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)

    cy.dataTestId('note-0')
      .clear()
      .type('ខ្ចិលចូលរៀន')
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)
    cy.dataTestId('checked-1')
      .click()
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)

    cy.selectSetting('type-1', 'វ', 'present_late_attendance_type')
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)

    cy.dataTestId('late-time-1')
      .clear()
      .type('15')
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)

    cy.dataTestId('note-1')
      .clear()
      .type('ស្ទះផ្លូវ')
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)

    cy.dataGridSearch('attendance', 'NAK VANNA')
    cy.dataTestId('checked-0')
      .click()
      .wait(1000)
      .submitAssertSuccessful('បានរក្សាទុកជោគជ័យ')
      .wait(1000)
  })
})
