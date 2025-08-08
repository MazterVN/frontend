import { v4 as uuidv4 } from 'uuid'
import {
  CreateRelatedStudentDocument,
  CreateRelatedStudyYearDocument,
  CreateRelatedServiceTypeDocument,
  CreateRelatedServiceNameDocument,
  CreateRelatedUpsertServiceDocument,
  CreateUpsertStudentServiceDocument,
} from '../../../../app/graphql/generated/default'

describe('Working with discounts feature', () => {
  const createName = 'For 2025-2026 50% Discount'
  const updateName = 'For 2025-2026 50% Discount'
  // ======Create Student======
  const studentId1 = uuidv4()
  const studentId2 = uuidv4()
  const studentId3 = uuidv4()
  const createStudentVariables = [
    {
      input: {
        id: studentId1,
        bookId: '00000',
        name: 'វណ្ណា តេស្ដឺ មួយ',
        latin: 'Vanna Tester One',
        gender: 'MALE',
        dob: '1997-04-11',
        tel: '0123456781',
        contacts: [
          {
            id: uuidv4(),
            type: 'TEL',
            value: '0123456781',
          },
          {
            id: uuidv4(),
            type: 'TELEGRAM',
            value: '0123456781',
          },
        ],
        studentRelatives: [],
        studentParents: [],
        studentAddresses: [],
        studentImages: [],
      },
    },
    {
      input: {
        id: studentId2,
        bookId: '00000',
        name: 'វណ្ណា តេស្ដឺ ពីរ',
        latin: 'Vanna Tester Two',
        gender: 'MALE',
        dob: '1997-04-12',
        tel: '0123456782',
        contacts: [
          {
            id: uuidv4(),
            type: 'TEL',
            value: '0123456782',
          },
          {
            id: uuidv4(),
            type: 'TELEGRAM',
            value: '0123456782',
          },
        ],
        studentRelatives: [],
        studentParents: [],
        studentAddresses: [],
        studentImages: [],
      },
    },
    {
      input: {
        id: studentId3,
        bookId: '00000',
        name: 'វណ្ណា តេស្ដឺ បី',
        latin: 'Vanna Tester Three',
        gender: 'MALE',
        dob: '1997-04-13',
        tel: '0123456783',
        contacts: [
          {
            id: uuidv4(),
            type: 'TEL',
            value: '0123456783',
          },
          {
            id: uuidv4(),
            type: 'TELEGRAM',
            value: '0123456783',
          },
        ],
        studentRelatives: [],
        studentParents: [],
        studentAddresses: [],
        studentImages: [],
      },
    },
  ]
  // ======End Create Student======
  // ======Create Study Year======
  const studyYearId = uuidv4()
  const beginsAt = '3025-01-01'
  const endsAt = '3025-12-31'
  const createStudyYearVariable = {
    input: {
      id: studyYearId,
      name: 'Master Record',
      language: 'KM',
      beginsAt: beginsAt,
      endsAt: endsAt,
      studyYears: [
        {
          id: uuidv4(),
          name: '៣០២៥-៣០២៦',
          language: 'KM',
          beginsAt: beginsAt,
          endsAt: endsAt,
        },
        {
          id: uuidv4(),
          name: '3025-3026',
          language: 'EN',
          beginsAt: beginsAt,
          endsAt: endsAt,
        },
      ],
    },
  }
  // ======End Create Study Year======
  // ====== Create Service Type ======
  const serviceTypeId = uuidv4()
  const createServiceTypeVariable = {
    input: {
      id: serviceTypeId,
      name: 'Master Record',
      language: 'KM',
      serviceTypes: [
        {
          id: '15ffd220-933c-436e-ade4-7d7dfee47bf2',
          name: 'សិស្សថ្មីតេស្ដ',
          language: 'KM',
        },
        {
          id: '16fdfdb3-7887-4eed-a68f-44ac3e68fd8a',
          name: 'Test New Enroll',
          language: 'EN',
        },
      ],
    },
  }
  // ====== End of Create Service Type =======
  // ====== Create Service Name ======
  const serviceNameId = uuidv4()
  const createServiceNameVariable = {
    input: {
      id: serviceNameId,
      name: 'Master Record',
      language: 'KM',
      serviceNames: [
        {
          id: '0f893cc6-06ca-4334-95db-072fc8784c81',
          name: '13 ក',
          language: 'KM',
        },
        {
          id: 'b1f69ba7-b965-4c4a-9f75-eb9860cd1435',
          name: '13 A',
          language: 'EN',
        },
      ],
    },
  }
  // ====== End of Create Service Name =======
  const serviceId = uuidv4()
  const serviceDetailId = uuidv4()
  const createServiceVariable = {
    input: {
      id: serviceId,
      name: 'ថ្នាក់ទី ១៣',
      description: 'Description',
      beginsAt: beginsAt,
      endsAt: endsAt,
      studyYearId: studyYearId,
      type: 'GRADE',
      serviceDetails: [
        {
          id: serviceDetailId,
          serviceNameId: serviceNameId,
        },
      ],
      serviceFees: [
        {
          id: uuidv4(),
          monthRepeat: 1,
          price: 100,
          fixedDiscount: 1,
        },
        {
          id: uuidv4(),
          monthRepeat: 3,
          price: 300,
          fixedDiscount: 3,
        },
        {
          id: uuidv4(),
          monthRepeat: 6,
          price: 600,
          fixedDiscount: 6,
        },
        {
          id: uuidv4(),
          monthRepeat: 12,
          price: 1200,
          fixedDiscount: 12,
        },
      ],
    },
  }
  // ====== End ot Create Service ======
  const studentServiceId1 = uuidv4()
  const studentServiceId2 = uuidv4()
  const studentServiceId3 = uuidv4()
  const createStudentServiceVariables = [
    {
      input: {
        id: studentServiceId1,
        isActive: true,
        studentId: studentId1,
        studyYearId: studyYearId,
        serviceDetailId: serviceDetailId,
        serviceTypeId: serviceTypeId,
        shiftType: 'FULLTIME',
        note: 'Description',
      },
    },
    {
      input: {
        id: studentServiceId2,
        isActive: true,
        studentId: studentId2,
        studyYearId: studyYearId,
        serviceDetailId: serviceDetailId,
        serviceTypeId: serviceTypeId,
        shiftType: 'FULLTIME',
        note: 'Description',
      },
    },
    {
      input: {
        id: studentServiceId3,
        isActive: true,
        studentId: studentId3,
        studyYearId: studyYearId,
        serviceDetailId: serviceDetailId,
        serviceTypeId: serviceTypeId,
        shiftType: 'FULLTIME',
        note: 'Description',
      },
    },
  ]

  const skips = ['should redirect back']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/settings/discounts/discounts')
      cy.wait(1000)
      cy.setBearerToken()
      createStudentVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedStudentDocument, variable)
      })
      cy.factoryGraphqlData(CreateRelatedStudyYearDocument, createStudyYearVariable)
      cy.factoryGraphqlData(CreateRelatedServiceTypeDocument, createServiceTypeVariable)
      cy.factoryGraphqlData(CreateRelatedServiceNameDocument, createServiceNameVariable)
      cy.factoryGraphqlData(CreateRelatedUpsertServiceDocument, createServiceVariable)
      createStudentServiceVariables.map((variable) => {
        cy.factoryGraphqlData(CreateUpsertStudentServiceDocument, variable)
      })
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should CRUD Discount', () => {
    cy.openCreateModal()
    cy.dateRangPicker(2)
    cy.dataTestId('value-input-field').first().type('0.5').blur()
    cy.dataTestId('description-input-field').type(createName).blur()
    cy.selectSetting('student-service-discounts.0.student-service-id', createStudentVariables[0]?.input.name || '', studentServiceId1)
    cy.dataTestId('add-student-service-discount-btn').click()
    cy.selectSetting('student-service-discounts.1.student-service-id', createStudentVariables[1]?.input.name || '', studentServiceId2)
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    // End of Creation

    cy.sortDataGrid(1)
    cy.get('#grid-discounts').should('be.visible')
    cy.get('#grid-discounts_content_table')
      .contains('tbody .e-row', createName)
      .should('exist')
    cy.wait(1000)
    // End of List KM
    cy.toggleLocal()
    cy.sortDataGrid(1)
    cy.get('#grid-discounts').should('be.visible')
    cy.get('#grid-discounts_content_table')
      .contains('tbody .e-row', createName)
      .should('exist')
    cy.wait(1000)
    // End of List EN
    cy.dataGridSearch('discounts', createName)
    cy.dataGridSelectRow('discounts')
    cy.openEditModal()
    cy.dateRangPicker(4)
    cy.dataTestId('value-input-field').first().clear().type('0.8').blur()
    cy.dataTestId('description-input-field').clear().type(updateName).blur()
    cy.dataTestId('student-service-discount-remove-row-1').click()
    cy.selectSetting('student-service-discounts.0.student-service-id', createStudentVariables[2]?.input.name || '', studentServiceId3)
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('discounts', updateName)
    cy.dataGridSelectRow('discounts')
    cy.wait(1000)
    // End fo Update
  })
})
