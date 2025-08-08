import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedProvinceDocument, CreateRelatedDistrictDocument } from '../../../../app/graphql/generated/default'

describe('Working with districts feature', () => {
  const feature: string = 'districts'

  const provinceId1 = uuidv4()
  const provinceId2 = uuidv4()
  const createProvinceVariables = [
    {
      input: {
        id: provinceId1,
        name: 'Master Record',
        language: 'KM',
        provinces: [
          {
            id: uuidv4(),
            name: 'ខេត្ត ១',
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: 'Province 1',
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: provinceId2,
        name: 'Master Record',
        language: 'KM',
        provinces: [
          {
            id: uuidv4(),
            name: 'ខេត្ត ២',
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: 'Province 2',
            language: 'EN',
          },
        ],
      },
    },
  ]

  const districtNameKm = 'ស្រុក/ខណ្ឌ'
  const districtNameEn = 'District'
  const updateAppendKm = ' កែប្រែ'
  const updateAppendEn = ' Update'

  const createDistrictVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      provinceId: provinceId1,
      districts: [
        {
          id: uuidv4(),
          name: districtNameKm,
          provinceId: provinceId1,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: districtNameEn,
          provinceId: provinceId1,
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
      cy.visit('/settings/addresses/districts')
      cy.wait(1000)
      cy.setBearerToken()
      createProvinceVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedProvinceDocument, variable)
      })
      cy.factoryGraphqlData(CreateRelatedDistrictDocument, createDistrictVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/addresses/districts')
    cy.wait(1000)
    cy.setBearerToken()
    createProvinceVariables.map((variable) => {
      cy.factoryGraphqlData(CreateRelatedProvinceDocument, variable)
    })
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('submit-btn').click()
    cy.validationErrorMessage('Please select a province', 0)
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.selectSetting('province-id', createProvinceVariables[0]?.input?.provinces?.[0]?.name || '', createProvinceVariables[0]?.input?.id || '')
    cy.dataTestId('km-input-field').type(districtNameKm)
    cy.dataTestId('en-input-field').type(districtNameEn)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch(feature, districtNameKm)
    cy.dataGridSelectRow(feature)
  })
  it('should list districts in khmer language', () => {
    cy.dataGridSearch(feature, districtNameKm)
    cy.sortDataGrid(1)
    cy.get('#grid-districts').should('be.visible')
    cy.get('#grid-districts_content_table')
      .contains('tbody .e-row', districtNameKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list districts in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, districtNameEn)
    cy.sortDataGrid(1)
    cy.get('#grid-districts').should('be.visible')
    cy.get('#grid-districts_content_table')
      .contains('tbody .e-row', districtNameEn)
      .should('exist')
    cy.wait(1000)
  })
  it('should update existing record', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, districtNameEn)
    cy.dataGridSelectRow(feature)
    // Edit
    cy.openEditModal()
    cy.selectSetting(
      'province-id',
      createProvinceVariables[1]?.input?.provinces?.[1]?.name || '',
      createProvinceVariables[1]?.input?.id || '',
    )
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
