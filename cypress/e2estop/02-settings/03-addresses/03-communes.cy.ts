import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedProvinceDocument, CreateRelatedDistrictDocument, CreateRelatedCommuneDocument } from '../../../../app/graphql/generated/default'

describe('Working with communes feature', () => {
  const feature: string = 'communes'

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

  const districtId1 = uuidv4()
  const districtId2 = uuidv4()
  const createDistrictVariables = [
    {
      input: {
        id: districtId1,
        name: 'Master Record',
        language: 'KM',
        provinceId: provinceId,
        districts: [
          {
            id: uuidv4(),
            name: 'ស្រុក/ខណ្ឌ ១',
            provinceId: provinceId,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: 'District 1',
            provinceId: provinceId,
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: districtId2,
        name: 'Master Record',
        language: 'KM',
        provinceId: provinceId,
        districts: [
          {
            id: uuidv4(),
            name: 'ស្រុក/ខណ្ឌ ២',
            provinceId: provinceId,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: 'District 2',
            provinceId: provinceId,
            language: 'EN',
          },
        ],
      },
    },
  ]

  const communeNameKm = 'ឃុំ/សង្កាត់'
  const communeNameEn = 'Commune'
  const updateAppendKm = ' កែប្រែ'
  const updateAppendEn = ' Update'

  const createCommuneVariable = {
    input: {
      id: uuidv4(),
      districtId: districtId1,
      name: 'Master Record',
      language: 'KM',
      communes: [
        {
          id: uuidv4(),
          districtId: districtId1,
          name: communeNameKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          districtId: districtId1,
          name: communeNameEn,
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
      cy.visit('/settings/addresses/communes')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedProvinceDocument, provinceVariables)
      createDistrictVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedDistrictDocument, variable)
      })
      cy.factoryGraphqlData(CreateRelatedCommuneDocument, createCommuneVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/addresses/communes')
    cy.wait(1000)
    cy.setBearerToken()
    cy.factoryGraphqlData(CreateRelatedProvinceDocument, provinceVariables)
    createDistrictVariables.map((variable) => {
      cy.factoryGraphqlData(CreateRelatedDistrictDocument, variable)
    })
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('submit-btn').click()
    cy.validationErrorMessage('Please select a district', 0)
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.selectSetting('district-id', createDistrictVariables[0]?.input?.districts?.[0]?.name || '', districtId1)
    cy.dataTestId('km-input-field').type(communeNameKm).blur()
    cy.dataTestId('en-input-field').type(communeNameEn).blur()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch(feature, communeNameKm)
    cy.dataGridSelectRow(feature)
  })
  it('should list communes in khmer language', () => {
    cy.dataGridSearch(feature, communeNameKm)
    cy.sortDataGrid(2)
    cy.get('#grid-communes').should('be.visible')
    cy.get('#grid-communes_content_table')
      .contains('tbody .e-row', communeNameKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list communes in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, communeNameEn)
    cy.sortDataGrid(2)
    cy.get('#grid-communes').should('be.visible')
    cy.get('#grid-communes_content_table')
      .contains('tbody .e-row', communeNameEn)
      .should('exist')
    cy.wait(1000)
  })
  it('should update existing record', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, communeNameEn)
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.selectSetting('district-id', createDistrictVariables[1]?.input?.districts?.[1]?.name || '', districtId2)
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
