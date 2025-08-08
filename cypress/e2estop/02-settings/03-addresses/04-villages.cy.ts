import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedProvinceDocument, CreateRelatedDistrictDocument, CreateRelatedCommuneDocument, CreateRelatedVillageDocument } from '../../../../app/graphql/generated/default'

describe('Working with villages feature', () => {
  const feature: string = 'villages'

  const provinceId = uuidv4()
  const provinceVariables = {
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
  const districtVariables = {
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

  const communeId1 = uuidv4()
  const communeId2 = uuidv4()
  const communeVariables = [
    {
      input: {
        id: communeId1,
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
    },
    {
      input: {
        id: communeId2,
        districtId: districtId,
        name: 'Master Record',
        language: 'KM',
        communes: [
          {
            id: uuidv4(),
            districtId: districtId,
            name: 'ឃុំ/សង្កាត់ ២',
            language: 'KM',
          },
          {
            id: uuidv4(),
            districtId: districtId,
            name: 'Commune 2',
            language: 'EN',
          },
        ],
      },
    },
  ]

  const villageNameKm = 'ភូមិ'
  const villageNameEn = 'Village'
  const updateAppendKm = ' កែប្រែ'
  const updateAppendEn = ' Update'

  const createVillageVariable = {
    input: {
      id: uuidv4(),
      communeId: communeId1,
      name: 'Master Record',
      language: 'KM',
      villages: [
        {
          id: uuidv4(),
          communeId: communeId1,
          name: villageNameKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          communeId: communeId1,
          name: villageNameEn,
          language: 'EN',
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
      cy.visit('/settings/addresses/villages')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedProvinceDocument, provinceVariables)
      cy.factoryGraphqlData(CreateRelatedDistrictDocument, districtVariables)
      communeVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedCommuneDocument, variable)
      })
      cy.factoryGraphqlData(CreateRelatedVillageDocument, createVillageVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/addresses/villages')
    cy.wait(1000)
    cy.setBearerToken()
    cy.factoryGraphqlData(CreateRelatedProvinceDocument, provinceVariables)
    cy.factoryGraphqlData(CreateRelatedDistrictDocument, districtVariables)
    communeVariables.map((variable) => {
      cy.factoryGraphqlData(CreateRelatedCommuneDocument, variable)
    })
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('submit-btn').click()
    cy.validationErrorMessage('Please select a commune', 0)
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.selectSetting('commune-id', communeVariables[0]?.input?.communes?.[0]?.name ?? '', communeId1)
    cy.dataTestId('km-input-field').type(villageNameKm).blur()
    cy.dataTestId('en-input-field').type(villageNameEn).blur()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch(feature, villageNameKm)
    cy.dataGridSelectRow(feature)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch(feature, villageNameKm)
    cy.sortDataGrid(3)
    cy.get('#grid-villages').should('be.visible')
    cy.get('#grid-villages_content_table')
      .contains('tbody .e-row', villageNameKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, villageNameEn)
    cy.sortDataGrid(3)
    cy.sortDataGrid(3)
    cy.get('#grid-villages').should('be.visible')
    cy.get('#grid-villages_content_table')
      .contains('tbody .e-row', villageNameEn)
      .should('exist')
    cy.wait(1000)
  })
  it('should update existing record', () => {
    cy.factoryGraphqlData(CreateRelatedVillageDocument, createVillageVariable)
    cy.wait(1000)
    cy.toggleLocal()
    cy.dataGridSearch(feature, villageNameEn)
    cy.dataGridSelectRow(feature)
    // Edit
    cy.openEditModal()
    cy.selectSetting('commune-id', communeVariables[1]?.input?.communes?.[1]?.name ?? '', communeId2)
    cy.dataTestId('km-input-field').type(updateAppendKm)
    cy.dataTestId('en-input-field').type(updateAppendEn)
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch(feature, updateAppendEn)
    cy.dataGridSelectRow(feature)
  })
})
