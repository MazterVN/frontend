import { v4 as uuidv4 } from 'uuid'
import {
  CreateRelatedStudentDocument,
  CreateUpsertStudentServiceDocument,
  CreateRelatedUpsertServiceDocument,
  CreateRelatedStudyYearDocument,
  CreateRelatedServiceNameDocument,
  CreateRelatedServiceTypeDocument,
} from '../../../app/graphql/generated/default'

describe('working with student-service list update + student-service-log', () => {
  const skips = ['should redirect back']

  // Student
  const studentId1 = uuidv4()
  const name1 = 'សិស្ស តេស្ដទី១'
  const latin1 = 'FIRST STUDENT TEST'
  const gender1 = { value: 'MALE', kh: 'ប្រុស', en: 'Male' }
  const dob1 = { value: '1999-12-12', label: '12/12/1999' }
  const tel1 = '0987654321'

  const studentId2 = uuidv4()
  const name2 = 'សិស្ស តេស្ដទី២'
  const latin2 = 'SECOND STUDENT TEST'
  const gender2 = { value: 'FEMALE', kh: 'ស្រី', en: 'Female' }
  const dob2 = { value: '1997-12-12', label: '12/12/1997' }
  const tel2 = '0123456789'

  const createStudentVariables = [
    {
      input: {
        id: studentId1,
        bookId: '00000',
        name: name1,
        latin: latin1,
        gender: gender1.value,
        dob: dob1.value,
        tel: tel1,
        contacts: [],
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
        name: name2,
        latin: latin2,
        gender: gender2.value,
        dob: dob2.value,
        tel: tel2,
        contacts: [],
        studentRelatives: [],
        studentParents: [],
        studentAddresses: [],
        studentImages: [],
      },
    },
  ]

  // StudyYear

  const beginsAt1 = '1999-01-01'
  const endsAt1 = '2000-12-31'
  const studyYearId1 = uuidv4()
  const studyYearKmName1 = '១៩៩៩-២០០០'
  const studyYearEnName1 = '1999-2000'

  const beginsAt2 = '2000-01-01'
  const endsAt2 = '2001-12-31'
  const studyYearId2 = uuidv4()
  const studyYearKmName2 = '២០០០-២០០១'
  const studyYearEnName2 = '2000-2001'
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

  // ServiceName
  const serviceNameId1 = uuidv4()
  const serviceNameKm1 = '13 ក'
  const serviceNameEn1 = '13 A'

  const serviceNameId2 = uuidv4()
  const serviceNameKm2 = '14 ក'
  const serviceNameEn2 = '14 A'
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

  // ServiceType

  const serviceTypeId1 = uuidv4()
  const serviceTypeKm1 = 'ជំនាន់ ទី១'
  const serviceTypeEn1 = 'First Generation'

  const serviceTypeId2 = uuidv4()
  const serviceTypeKm2 = 'ជំនាន់ ទី២'
  const serviceTypeEn2 = 'Second Generation'

  const createServiceTypeVariable = [
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
  // Service
  const serviceId1 = uuidv4()
  const serviceName1 = 'ថ្នាក់ពិសេសកម្រិត១'
  const serviceDescription1 = 'ថ្នាក់សម្រាប់សិស្សមិនធម្មតាកម្រិត១'
  const serviceDetailId1 = uuidv4()

  const serviceId2 = uuidv4()
  const serviceName2 = 'ថ្នាក់ពិសេសកម្រិត២'
  const serviceDescription2 = 'ថ្នាក់សម្រាប់សិស្សមិនធម្មតាកម្រិត២'
  const serviceDetailId2 = uuidv4()

  const createServiceVariables = [
    {
      input: {
        id: serviceId1,
        name: serviceName1,
        description: serviceDescription1,
        beginsAt: beginsAt1,
        endsAt: endsAt1,
        studyYearId: studyYearId1,
        type: 'GRADE',
        serviceDetails: [
          {
            id: serviceDetailId1,
            serviceNameId: serviceNameVariables[0]?.input?.id || '',
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
        name: serviceName2,
        description: serviceDescription2,
        beginsAt: beginsAt2,
        endsAt: endsAt2,
        studyYearId: studyYearId2,
        type: 'STAY',
        serviceDetails: [
          {
            id: serviceDetailId2,
            serviceNameId: serviceNameVariables[1]?.input?.id || '',
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

  // Student Service
  const studentServiceId1 = uuidv4()
  const studentServiceId2 = uuidv4()
  const note = 'Student Service Note'
  const createStudentServiceVariables = [
    {
      input: {
        id: studentServiceId1,
        studentId: studentId1,
        studyYearId: studyYearId1,
        isActive: true,
        note: note,
        serviceDetailId: serviceDetailId1,
        serviceTypeId: serviceTypeId1,
        shiftType: 'FULLTIME',
      },
    },
    {
      input: {
        id: studentServiceId2,
        studentId: studentId2,
        studyYearId: studyYearId1,
        isActive: true,
        note: note,
        serviceDetailId: serviceDetailId1,
        serviceTypeId: serviceTypeId1,
        shiftType: 'FULLTIME',
      },
    },
  ]

  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.viewport(2048, 1152)
      cy.visit('/students/services').wait(3000)
      cy.setBearerToken()
      cy.wait(1000)
      createStudentVariables.map((student) => {
        cy.factoryGraphqlData(CreateRelatedStudentDocument, student)
      })
      cy.wait(1000)
      studyYearVariables.map((studyYear) => {
        cy.factoryGraphqlData(CreateRelatedStudyYearDocument, studyYear)
      })
      cy.wait(1000)
      serviceNameVariables.map((serviceName) => {
        cy.factoryGraphqlData(CreateRelatedServiceNameDocument, serviceName)
      })
      cy.wait(1000)
      createServiceTypeVariable.map((serviceType) => {
        cy.factoryGraphqlData(CreateRelatedServiceTypeDocument, serviceType)
      })
      cy.wait(1000)
      createServiceVariables.map((service) => {
        cy.factoryGraphqlData(CreateRelatedUpsertServiceDocument, service)
      })
      cy.wait(1000)
      createStudentServiceVariables.map((studentService) => {
        cy.factoryGraphqlData(CreateUpsertStudentServiceDocument, studentService)
      })
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })

  it('should list in khmer language', () => {
    cy.dataGridSearch('student-services', studyYearKmName1)
    cy.sortDataGrid(6)
    cy.get('#grid-student-services').should('be.visible')
    cy.get('#grid-student-services_content_table')
      .find('tbody .e-row')
      .contains(name1)
      .closest('.e-row')
      .within(() => {
        cy.contains(serviceNameKm1)
        cy.contains(serviceTypeKm1)
        cy.contains(latin1)
        cy.contains(gender1.kh)
        cy.contains(dob1.label)
        cy.contains(tel1)
      })
    cy.get('#grid-student-services_content_table')
      .find('tbody .e-row')
      .contains(name2)
      .closest('.e-row')
      .within(() => {
        cy.contains(serviceNameKm1)
        cy.contains(serviceTypeKm1)
        cy.contains(latin2)
        cy.contains(gender2.kh)
        cy.contains(dob2.label)
        cy.contains(tel2)
      })
    cy.wait(1000)
  })

  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('student-services', studyYearEnName1)
    cy.sortDataGrid(6)
    cy.get('#grid-student-services').should('be.visible')
    cy.get('#grid-student-services_content_table')
      .find('tbody .e-row')
      .contains(name1)
      .closest('.e-row')
      .within(() => {
        cy.contains(serviceNameEn1)
        cy.contains(serviceTypeEn1)
        cy.contains(latin1)
        cy.contains(gender1.en)
        cy.contains(dob1.label)
        cy.contains(tel1)
      })
    cy.get('#grid-student-services_content_table')
      .find('tbody .e-row')
      .contains(name2)
      .closest('.e-row')
      .within(() => {
        cy.contains(serviceNameEn1)
        cy.contains(serviceTypeEn1)
        cy.contains(latin2)
        cy.contains(gender2.en)
        cy.contains(dob2.label)
        cy.contains(tel2)
      })
    cy.wait(1000)
  })

  it('should update', () => {
    cy.dataGridSearch('student-services', studyYearKmName1)
    cy.dataGridSelectRow('student-services')
    cy.openEditModal()
    // cy.dataTestId('is-active').click()

    cy.selectSetting('study-year-id', studyYearKmName2, studyYearId2)
    cy.selectSetting('service-detail-service-id', serviceName2, serviceId2)
    cy.selectSetting('service-detail-id', serviceNameKm2, serviceDetailId2)
    cy.selectSetting('service-type-id', serviceTypeKm2, serviceTypeId2)
    cy.selectSetting('shift-type', 'ថ្នាក់ពេញម៉ោង', 'fulltime_shift_type')
    cy.dataTestId('note').type(' Update')
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')

    /* === Create StudentServiceLog === */
    cy.get('#grid-student-service-logs_toolbarItems')
      .find('#add')
      .click()
      .wait(1000)
    cy.get('[data-testid="date-input"] input.el-input__inner').type('08/01/2025').blur().wait(200)
    cy.selectSetting('type-select', 'ឈប់រៀន', 'drop_student_service_log_type')
    cy.get(':nth-child(1) > .text-sm > :nth-child(2) > .e-input-group').click().wait(200)
    cy.get('#39a2eabf-38f6-4f0f-906c-862e43b30c73').click().wait(200)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    /* === End of Create StudentServiceLog === */

    /* === Update StudentServiceLog === */
    cy.dataGridSelectRow('student-service-logs', 1, 4)
    cy.get('#grid-student-service-logs_toolbarItems')
      .find('#edit')
      .click()
      .wait(1000)
    cy.get('[data-testid="date-input"] input.el-input__inner')
      .clear()
      .type('03/01/2023')
      .blur()
      .wait(300)
    cy.selectSetting('type-select', 'ចូលរៀន', 'register_student_service_log_type')
    cy.get(':nth-child(1) > .text-sm > :nth-child(2) > .e-input-group').click().wait(200)
    cy.get('#91da864d-8205-42c4-b1e3-0e4aeb697e70').click().wait(200)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    Array(2).fill(null).forEach(() => {
      cy.closeModal()
    })
  // End of Update StudentServiceLog
  })
})
