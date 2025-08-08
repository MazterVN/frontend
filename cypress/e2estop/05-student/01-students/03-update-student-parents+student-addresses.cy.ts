import { v4 as uuidv4 } from 'uuid'
import {
  CreateRelatedStudentDocument,
  CreateUpsertParentDocument,
  CreateRelatedStudyYearDocument,
  CreateRelatedProvinceDocument,
  CreateRelatedDistrictDocument,
  CreateRelatedCommuneDocument,
  CreateRelatedVillageDocument } from '../../../../app/graphql/generated/default'

describe('', () => {
  const feature = 'students'
  const createStudentVariable = {
    input: {
      id: uuidv4(),
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

  const createStudyYearId = uuidv4()
  const createStudyYearKm = '១៩៩៩-២០០០'
  const createStudyYearEn = '1999-2000'

  const beginsAt = '1999-01-01'
  const endsAt = '2000-12-31'
  const createStudyYearVariable = {
    input: {
      id: createStudyYearId,
      name: 'Master Record',
      language: 'KM',
      beginsAt,
      endsAt,
      studyYears: [
        {
          id: uuidv4(),
          name: createStudyYearKm,
          language: 'KM',
          beginsAt,
          endsAt,
        },
        {
          id: uuidv4(),
          name: createStudyYearEn,
          language: 'EN',
          beginsAt,
          endsAt,
        },
      ],
    },
  }

  const parentId1 = uuidv4()
  const parentKm1 = 'អ្នកម្ដាយ'
  const parentEn1 = 'Mother'
  const parentId2 = uuidv4()
  const parentKm2 = 'លោកឪពុក'
  const parentEn2 = 'Father'
  const createVariables = [
    {
      input: {
        id: parentId1,
        name: parentKm1,
        latin: parentEn1,
        type: 'MOTHER',
        job: 'EMPLOYEE',
        tel: '0123456781',
      },
    },
    {
      input: {
        id: parentId2,
        name: parentKm2,
        latin: parentEn2,
        type: 'FATHER',
        job: 'EMPLOYEE',
        tel: '0123456782',
      },
    },
  ]

  const provinceId = uuidv4()
  const provinceVariable = {
    input: {
      id: provinceId,
      name: 'Master Record',
      language: 'KM',
      provinces: [
        {
          id: uuidv4(),
          name: 'ខេត្ត',
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: 'Pronvince',
          language: 'EN',
        },
      ],
    },
  }

  const districtId = uuidv4()
  const districtVariable = {
    input: {
      id: districtId,
      name: 'Master Record',
      language: 'KM',
      provinceId: provinceId,
      districts: [
        {
          id: 'f26ba472-a1a0-4ca7-b443-c751b645c88b',
          name: 'តេស្ដ',
          provinceId: provinceId,
          language: 'KM',
        },
        {
          id: 'c8408e46-1f85-489f-b7b2-bba0f0b32ff4',
          name: 'Test',
          provinceId: provinceId,
          language: 'EN',
        },
      ],
    },
  }

  const communeId = uuidv4()
  const communeVariable = {
    input: {
      id: communeId,
      districtId: districtId,
      name: 'Master Record',
      language: 'KM',
      communes: [
        {
          id: uuidv4(),
          districtId: districtId,
          name: 'ឃុំ/សង្កាត់ ១',
          language: 'KM',
        },
        {
          id: uuidv4(),
          districtId: districtId,
          name: 'Commune 1',
          language: 'EN',
        },
      ],
    },
  }

  const villageId = uuidv4()
  const villageNameKm = 'ភូមិ'
  const villageNameEn = 'Village'
  const villageVariable = {
    input: {
      id: villageId,
      communeId: communeId,
      name: 'Master Record',
      language: 'KM',
      villages: [
        {
          id: uuidv4(),
          communeId: communeId,
          name: villageNameKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          communeId: communeId,
          name: villageNameEn,
          language: 'EN',
        },
      ],
    },
  }

  const skips = ['should redirect back']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.viewport(2048, 1152)
      cy.visit('/students').wait(3000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedStudentDocument, createStudentVariable)
      createVariables.map((variable) => {
        cy.factoryGraphqlData(CreateUpsertParentDocument, variable)
      })
      cy.factoryGraphqlData(CreateRelatedStudyYearDocument, createStudyYearVariable)
      cy.factoryGraphqlData(CreateRelatedProvinceDocument, provinceVariable)
      cy.factoryGraphqlData(CreateRelatedDistrictDocument, districtVariable)
      cy.factoryGraphqlData(CreateRelatedCommuneDocument, communeVariable)
      cy.factoryGraphqlData(CreateRelatedVillageDocument, villageVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should update student_parents', () => {
    cy.dataGridSearch(feature, createStudentVariable.input.name)
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.get('#tab-parents').click()
    cy.dataTestId('add-student-parent').click()
    cy.wait(1000)
    cy.selectSetting('student-parent-selectfield-0', parentKm1, parentId1)
    cy.dataTestId('add-student-parent').click()
    cy.selectSetting('student-parent-selectfield-1', parentKm2, parentId2)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.wait(1000)

    cy.get('#tab-address').click()
    cy.dataTestId('add-student-address').click()
    cy.wait(1000)
    cy.selectSetting('study-year-selectfield-0', createStudyYearKm, createStudyYearId)
    cy.selectSetting('study-year-selectfield-1', createStudyYearKm, createStudyYearId)
    cy.selectSetting('village-selectfield-0', villageNameKm, villageId)
    cy.selectSetting('village-selectfield-1', villageNameKm, villageId)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.wait(1000)
  })
})
