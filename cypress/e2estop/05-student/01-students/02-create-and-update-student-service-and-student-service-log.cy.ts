import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedUpsertStudentServiceLogDocument, CreateUpsertStudentServiceDocument, CreateRelatedServiceTypeDocument, CreateRelatedUpsertServiceDocument, CreateRelatedStudentDocument, CreateRelatedStudyYearDocument, CreateRelatedServiceNameDocument } from '../../../../app/graphql/generated/default'

describe('Students feature by Tester Role(02)', () => {
  const studentId = uuidv4()
  const createVariable = {
    input: {
      id: studentId,
      bookId: '00000',
      name: 'សិស្ស តេស្ដ',
      latin: 'STUDENT TEST',
      gender: 'FEMALE',
      dob: '2012-12-12',
      tel: '0123456789',
      contacts: [
        {
          id: uuidv4(),
          type: 'TEL',
          value: '0123456789',
        },
        {
          id: uuidv4(),
          type: 'TELEGRAM',
          value: '0123456789',
        },
      ],
      studentRelatives: [],
      studentParents: [],
      studentAddresses: [],
      studentImages: [],
    },
  }

  const studyYearId1 = uuidv4()
  const beginsAt1 = '2025-01-01'
  const endsAt1 = '2025-12-31'
  const studyYearKmName1 = '១៩៩៩-២០០០'
  const studyYearEnName1 = '1999-2000'
  const studyYearId2 = uuidv4()
  const beginsAt2 = '2025-01-01'
  const endsAt2 = '2025-12-31'
  const studyYearKmName2 = '២៩៩៩-៣០០០'
  const studyYearEnName2 = '2999-3000'

  const studyYearVariables = [
    {
      input: {
        id: studyYearId1,
        name: 'Master Record',
        language: 'KM',
        beginsAt: beginsAt1,
        endsAt: endsAt1,
        studyYears: [
          {
            id: uuidv4(),
            name: studyYearKmName1,
            language: 'KM',
            beginsAt: beginsAt1,
            endsAt: endsAt1,
          },
          {
            id: uuidv4(),
            name: studyYearEnName1,
            language: 'EN',
            beginsAt: beginsAt1,
            endsAt: endsAt1,
          },
        ],
      },
    },
    {
      input: {
        id: studyYearId2,
        name: 'Master Record',
        language: 'KM',
        beginsAt: beginsAt2,
        endsAt: endsAt2,
        studyYears: [
          {
            id: uuidv4(),
            name: studyYearKmName2,
            language: 'KM',
            beginsAt: beginsAt2,
            endsAt: endsAt2,
          },
          {
            id: uuidv4(),
            name: studyYearEnName2,
            language: 'EN',
            beginsAt: beginsAt2,
            endsAt: endsAt2,
          },
        ],
      },
    },
  ]

  const serviceNameKm1 = 'ថ្នាក់ពិសេស០០១'
  const serviceNameEn1 = 'VIP OO1'
  const serviceNameId1 = uuidv4()
  const serviceNameKm2 = 'ថ្នាក់ពិសេស០០២'
  const serviceNameEn2 = 'VIP 002'
  const serviceNameId2 = uuidv4()
  const serviceNameVariables = [
    {
      input: {
        id: serviceNameId1,
        name: 'Master Record',
        language: 'KM',
        serviceNames: [
          {
            id: uuidv4(),
            name: serviceNameKm1,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: serviceNameEn1,
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: serviceNameId2,
        name: 'Master Record',
        language: 'KM',
        serviceNames: [
          {
            id: uuidv4(),
            name: serviceNameKm2,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: serviceNameEn2,
            language: 'EN',
          },
        ],
      },
    },
  ]

  const serviceId1 = uuidv4()
  const service1 = 'ថ្នាក់បណ្ឌិត'
  const serviceDetailId1 = uuidv4()
  const serviceId2 = uuidv4()
  const service2 = 'ថ្នាក់អនុបណ្ឌិត'
  const serviceDetailId2 = uuidv4()
  const serviceVariables = [
    {
      input: {
        id: serviceId1,
        name: service1,
        description: 'Description1',
        beginsAt: beginsAt1,
        endsAt: endsAt1,
        studyYearId: studyYearId1,
        type: 'GRADE',
        serviceDetails: [
          {
            id: serviceDetailId1,
            serviceNameId: serviceNameId1,
          },
        ],
        serviceFees: [
          {
            id: uuidv4(),
            monthRepeat: 1,
            price: 100,
            fixedDiscount: 5,
          },
          {
            id: uuidv4(),
            monthRepeat: 3,
            price: 300,
            fixedDiscount: 10,
          },
          {
            id: uuidv4(),
            monthRepeat: 6,
            price: 600,
            fixedDiscount: 15,
          },
          {
            id: uuidv4(),
            monthRepeat: 12,
            price: 1200,
            fixedDiscount: 20,
          },
        ],
      },
    },
    {
      input: {
        id: serviceId2,
        name: service2,
        description: 'Description2',
        beginsAt: beginsAt1,
        endsAt: endsAt1,
        studyYearId: studyYearId2,
        type: 'GRADE',
        serviceDetails: [
          {
            id: serviceDetailId2,
            serviceNameId: serviceNameId2,
          },
        ],
        serviceFees: [
          {
            id: uuidv4(),
            monthRepeat: 1,
            price: 100,
            fixedDiscount: 5,
          },
          {
            id: uuidv4(),
            monthRepeat: 3,
            price: 300,
            fixedDiscount: 10,
          },
          {
            id: uuidv4(),
            monthRepeat: 6,
            price: 600,
            fixedDiscount: 15,
          },
          {
            id: uuidv4(),
            monthRepeat: 12,
            price: 1200,
            fixedDiscount: 20,
          },
        ],
      },
    },
  ]

  const serviceTypeId1 = uuidv4()
  const serviceTypeKm1 = 'សិស្សជំនាន់ថ្មីទី១'
  const serviceTypeEn1 = 'FIRST GENERATION'
  const serviceTypeId2 = uuidv4()
  const serviceTypeKm2 = 'សិស្សជំនាន់ថ្មីទី២'
  const serviceTypeEn2 = 'SECOND GENERATION'

  const serviceTypeVariables = [
    {
      input: {
        id: serviceTypeId1,
        name: 'Master Record',
        language: 'KM',
        serviceTypes: [
          {
            id: uuidv4(),
            name: serviceTypeKm1,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: serviceTypeEn1,
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: serviceTypeId2,
        name: 'Master Record',
        language: 'KM',
        serviceTypes: [
          {
            id: uuidv4(),
            name: serviceTypeKm2,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: serviceTypeEn2,
            language: 'EN',
          },
        ],
      },
    },
  ]

  const studentServiceId = uuidv4()
  const studentServiceVariable = {
    input: {
      id: studentServiceId,
      isActive: true,
      studentId: studentId,
      studyYearId: studyYearId1,
      serviceDetailId: serviceDetailId1,
      serviceTypeId: serviceTypeId1,
      shiftType: 'FULLTIME',
      note: 'Service Note Test',
    },
  }

  const studentServiceLogVariable = {
    input: {
      id: uuidv4(),
      date: beginsAt1,
      type: 'DROP',
      studentServiceId: studentServiceId,
      reasons: [
        {
          id: uuidv4(),
          dropReasonId: '39a2eabf-38f6-4f0f-906c-862e43b30c73',
          registerReasonId: null,
        },
        {
          id: uuidv4(),
          dropReasonId: 'e5c65b69-44ec-4030-a300-00ead54f18a1',
          registerReasonId: null,
        },
      ],
    },
  }
  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.viewport(2048, 1152)
      cy.visit('/students').wait(3000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedStudentDocument, createVariable).then((item) => {
        cy.log(JSON.stringify(item))
      })
      cy.wait(200)
      studyYearVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedStudyYearDocument, variable).then((item) => {
          cy.log(JSON.stringify(item))
        })
      })
      cy.wait(200)
      serviceNameVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedServiceNameDocument, variable).then((item) => {
          cy.log(JSON.stringify(item))
        })
      })
      cy.wait(200)
      serviceVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedUpsertServiceDocument, variable).then((item) => {
          cy.log(JSON.stringify(item))
        })
      })
      cy.wait(200)
      serviceTypeVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedServiceTypeDocument, variable).then((item) => {
          cy.log(JSON.stringify(item))
        })
      })
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create student-service', () => {
    cy.dataGridSearch('students', createVariable.input.latin)
    cy.dataGridSelectRow('students')
    cy.openEditModal()
    cy.get('#tab-service').click()
    /* ==== Open Modal and Create Student-Service ==== */
    cy.get('#grid-student-services_toolbarItems')
      .find('#add')
      .click()
      .wait(500)
    cy.selectSetting('study-year-id', studyYearKmName1, studyYearId1)
    cy.selectSetting('service-detail-service-id', service1, serviceId1)
    cy.selectSetting('service-detail-id', serviceNameKm1, serviceDetailId1)
    cy.selectSetting('service-type-id', serviceTypeKm1, serviceTypeId1)
    cy.selectSetting('shift-type', 'ថ្នាក់', 'fulltime_shift_type')
    cy.dataTestId('note').type('Service Note Test')
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
  })
  it('should update student-service', () => {
    cy.wait(1000)
    cy.factoryGraphqlData(CreateUpsertStudentServiceDocument, studentServiceVariable).then((item) => {
      cy.log(JSON.stringify(item))
    })
    cy.wait(500)
    cy.toggleLocal()
    cy.dataGridSearch('students', createVariable.input.latin)
    cy.dataGridSelectRow('students')
    cy.dataGridSelectRow('students')
    cy.dataGridSelectRow('students')
    cy.openEditModal()
    cy.get('#tab-service').click()
    /* ==== Open Modal and Create Student-Service ==== */
    cy.dataGridSelectRow('student-services', 1, 2)
    cy.get('#grid-student-services_toolbarItems')
      .find('#edit')
      .click()
      .wait(500)
    cy.selectSetting('study-year-id', studyYearEnName2, studyYearId2)
    cy.selectSetting('service-detail-service-id', service2, serviceId2)
    cy.selectSetting('service-detail-id', serviceNameEn2, serviceDetailId2)
    cy.selectSetting('service-type-id', serviceTypeEn2, serviceTypeId2)
    cy.selectSetting('shift-type', 'Full', 'fulltime_shift_type')
    cy.dataTestId('note').type(' Update')
    cy.wait(300)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
  })
  it('should create student-service-log', () => {
    cy.wait(1000)
    cy.factoryGraphqlData(CreateUpsertStudentServiceDocument, studentServiceVariable).then((item) => {
      cy.log(JSON.stringify(item))
    })
    cy.wait(500)
    cy.dataGridSearch('students', createVariable.input.latin)
    cy.dataGridSelectRow('students')
    cy.openEditModal()
    cy.get('#tab-service').click()
    /* ==== Open Modal and Create Student-Service ==== */
    cy.dataGridSelectRow('student-services', 1, 2)
    cy.get('#grid-student-services_toolbarItems')
      .find('#edit')
      .click()
      .wait(500)
    cy.get('#grid-student-service-logs_toolbarItems')
      .find('#add')
      .click()
      .wait(1000)
    //   // cy.get('#date-input').type('08/01/2025').blur().wait(200)
    cy.get('[data-testid="date-input"] input.el-input__inner').type('08/01/2025').blur().wait(200)
    cy.selectSetting('type-select', 'ឈប់រៀន', 'drop_student_service_log_type')
    cy.tab().type('{enter}')
    cy.get('.e-dropdownbase').should('be.visible')
    cy.get('.e-list-item#39a2eabf-38f6-4f0f-906c-862e43b30c73').should('be.visible').wait(200).click()
    cy.wait(200)
    cy.dataTestId('add-reason').click().tab({ shift: true }).tab({ shift: true }).type('{enter}')
    cy.get('.e-dropdownbase').should('be.visible')
    cy.get('.e-list-item#e5c65b69-44ec-4030-a300-00ead54f18a1').should('be.visible').wait(200).click()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
  })

  it('should update student-service-log', () => {
    cy.wait(1000)
    cy.factoryGraphqlData(CreateUpsertStudentServiceDocument, studentServiceVariable).then((item) => {
      cy.log(JSON.stringify(item))
    })
    cy.wait(200)
    cy.factoryGraphqlData(CreateRelatedUpsertStudentServiceLogDocument, studentServiceLogVariable).then((item) => {
      cy.log(JSON.stringify(item))
    })
    cy.wait(500)
    cy.dataGridSearch('students', createVariable.input.latin)
    cy.dataGridSelectRow('students')
    cy.openEditModal()
    cy.get('#tab-service').click()
    /* ==== Open Modal and Create Student-Service ==== */
    cy.dataGridSelectRow('student-services', 1, 2)
    cy.get('#grid-student-services_toolbarItems')
      .find('#edit')
      .click()
      .wait(500)
    cy.dataGridSelectRow('student-service-logs')
    cy.get('#grid-student-service-logs_toolbarItems')
      .find('#edit')
      .click()
      .wait(1000)

    cy.get('[data-testid="date-input"] input.el-input__inner').type('08/01/2025').blur().wait(200)
    cy.selectSetting('type-select', 'ចូលរៀន', 'register_student_service_log_type')
    cy.tab().type('{enter}')
    cy.get('.e-dropdownbase').should('be.visible')
    cy.get('.e-list-item#91da864d-8205-42c4-b1e3-0e4aeb697e70').should('be.visible').wait(200).click()
    cy.dataTestId('remove-reason-1').click()
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    // Close all open modals in sequence
    Array(3).fill(null).forEach(() => {
      cy.closeModal()
    })
  })
})
