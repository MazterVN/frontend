import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedUpsertServiceDocument, CreateRelatedStudyYearDocument, CreateRelatedServiceNameDocument } from '../../../../app/graphql/generated/default'

describe('Working with services feature by Tester Role', () => {
  const feature = 'services'
  const createName = 'បន្ទប់ដេកកម្រិតផ្កាយ៥'
  const createDescription = 'ថ្នាក់សម្រាប់សិស្សមិនធម្មតា'

  const createServiceFees = [
    { price: '100', discount: '5' },
    { price: '300', discount: '10' },
    { price: '600', discount: '15' },
    { price: '1200', discount: '20' },
  ]

  const updateName = 'សេវាកម្មយន្តហោះ ០២ ជើង'
  const updateDescription = 'សេវាកម្មចំងាយឆ្ងាយប៉ោយប៉ែតបាវិត'
  const updateServiceFees = [
    { price: '200', discount: '10' },
    { price: '600', discount: '15' },
    { price: '1200', discount: '20' },
    { price: '2400', discount: '25' },
  ]

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

  const serviceNameVariables = [
    {
      input: {
        id: uuidv4(),
        name: 'Master Record',
        language: 'KM',
        serviceNames: [
          {
            id: uuidv4(),
            name: '13 ក',
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: '13 A',
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: uuidv4(),
        name: 'Master Record',
        language: 'KM',
        serviceNames: [
          {
            id: uuidv4(),
            name: '13 ខ',
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: '13 B',
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: uuidv4(),
        name: 'Master Record',
        language: 'KM',
        serviceNames: [
          {
            id: uuidv4(),
            name: '13 គ',
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: '13 C',
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: uuidv4(),
        name: 'Master Record',
        language: 'KM',
        serviceNames: [
          {
            id: uuidv4(),
            name: '13 ឃ',
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: '13 D',
            language: 'EN',
          },
        ],
      },
    },
  ]

  const createServiceVariable = {
    input: {
      id: uuidv4(),
      name: createName,
      description: createDescription,
      beginsAt: beginsAt1,
      endsAt: endsAt1,
      studyYearId: studyYearId1,
      type: 'STAY',
      serviceDetails: [
        {
          id: uuidv4(),
          serviceNameId: serviceNameVariables[0]?.input?.id || '',
        },
        {
          id: uuidv4(),
          serviceNameId: serviceNameVariables[1]?.input?.id || '',
        },
        {
          id: uuidv4(),
          serviceNameId: serviceNameVariables[2]?.input?.id || '',
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
  }

  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/settings/services/services')
      cy.wait(1000)
      cy.setBearerToken()
      studyYearVariables.map((studyYear) => {
        cy.factoryGraphqlData(CreateRelatedStudyYearDocument, studyYear)
      })
      serviceNameVariables.map((serviceName) => {
        cy.factoryGraphqlData(CreateRelatedServiceNameDocument, serviceName)
      })
      cy.factoryGraphqlData(CreateRelatedUpsertServiceDocument, createServiceVariable)
      cy.wait(1000)
    })
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/services/services')
    cy.wait(1000)
    cy.setBearerToken()
    studyYearVariables.map((studyYear) => {
      cy.factoryGraphqlData(CreateRelatedStudyYearDocument, studyYear)
    })
    serviceNameVariables.map((serviceName) => {
      cy.factoryGraphqlData(CreateRelatedServiceNameDocument, serviceName)
    })
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('name-input-field')
      .type(createName, { delay: 20 })
      .blur()
    cy.dateRangPicker(4)
    cy.selectSetting(
      'study-year-id-select-field',
      studyYearKmName1,
      studyYearId1,
    )
    cy.selectSetting('type-select-field', 'សេវាស្នាក់នៅ', 'stay_service_type')
    cy.dataTestId('description-input-field').type(createDescription)
    Array.from({ length: 3 }, (_, i) => {
      const filter = serviceNameVariables[i]?.input?.serviceNames?.find(item => item.language === 'KM')?.name || ''
      cy.selectSetting(
        `service-detail.service-name-${i}`,
        filter,
        serviceNameVariables[i]?.input.id || '',
      )
      cy.dataTestId('add-service-detail-btn').click()
    })
    cy.wait(500)
    cy.dataTestId('remove-service-detail-3').click()
    createServiceFees.forEach((fee, index) => {
      cy.dataTestId(`service-fees.price-${index}`)
        .first()
        .type(fee.price, { delay: 20 })
        .blur()
        .wait(300)
      cy.dataTestId(`service-fees.fixed-discount-${index}`)
        .first()
        .type(fee.discount, { delay: 20 })
        .blur()
        .wait(300)
    })
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.wait(500)
  })

  it('should list services feature in khmer language', () => {
    cy.sortDataGrid(0)
    cy.get('#grid-services').should('be.visible')
    cy.get('#grid-services_content_table')
      .contains('tbody .e-row', createName)
      .should('exist')
    cy.wait(500)
  })
  it('should list services feature in english language', () => {
    cy.toggleLocal()
    cy.sortDataGrid(0)
    cy.get('#grid-services').should('be.visible')
    cy.get('#grid-services_content_table')
      .contains('tbody .e-row', createName)
      .should('exist')
    cy.wait(500)
  })
  it('should update', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, createName)
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.dataTestId('name-input-field')
      .clear()
      .type(updateName, { delay: 20 })
      .blur()
    cy.dateRangPicker(2)
    cy.selectSetting('study-year-id-select-field', studyYearEnName2, studyYearId2)
    cy.selectSetting('type-select-field', 'Transport', 'transport_service_type')
    cy.dataTestId('description-input-field')
      .clear()
      .type(updateDescription)
    cy.dataTestId('remove-service-detail-2').click()
    cy.selectSetting('service-detail.service-name-1', '13', serviceNameVariables[3]?.input.id || '')
    updateServiceFees.forEach((fee, index) => {
      cy.dataTestId(`service-fees.price-${index}`)
        .first()
        .clear()
        .type(fee.price, { delay: 20 })
        .blur()
        .wait(300)
      cy.dataTestId(`service-fees.fixed-discount-${index}`)
        .first()
        .clear()
        .type(fee.discount, { delay: 20 })
        .blur()
        .wait(300)
    })
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch(feature, updateName)
    cy.wait(500)
  })
})
