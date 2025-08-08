import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedProvinceDocument } from '../../../../app/graphql/generated/default'

describe('Working with provinces feature by Tester Role', () => {
  const provinceKm = 'ខេត្ត'
  const provinceEn = 'Province'
  const updateAppendKm = ' បានកែប្រែ'
  const updateAppendEn = ' Updated'

  const createProvinceVariable = {
    input: {
      id: uuidv4(),
      name: 'Master Record',
      language: 'KM',
      provinces: [
        {
          id: uuidv4(),
          name: provinceKm,
          language: 'KM',
        },
        {
          id: uuidv4(),
          name: provinceEn,
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
      cy.visit('/settings/addresses/provinces')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedProvinceDocument, createProvinceVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/addresses/provinces')
    cy.wait(1000)
    cy.openCreateModal()
    cy.submitForm()
    cy.validationErrorMessage('Please enter a valid name', 0)
    cy.validationErrorMessage('Please enter a valid name', 1)
    cy.dataTestId('km-input-field').type(provinceKm)
    cy.dataTestId('en-input-field').type(provinceEn)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('provinces', provinceKm)
    cy.dataGridSelectRow('provinces')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch('provinces', provinceKm)
    cy.sortDataGrid(0)
    cy.get('#grid-provinces').should('be.visible')
    cy.get('#grid-provinces_content_table')
      .contains('tbody .e-row', provinceKm)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch('provinces', provinceEn)
    cy.sortDataGrid(0)
    cy.get('#grid-provinces').should('be.visible')
    cy.get('#grid-provinces_content_table')
      .contains('tbody .e-row', provinceEn)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch('provinces', provinceKm)
    cy.dataGridSelectRow('provinces')
    cy.openEditModal()
    cy.dataTestId('km-input-field').type(updateAppendKm)
    cy.dataTestId('en-input-field').type(updateAppendEn)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('provinces', updateAppendKm)
    cy.dataGridSelectRow('provinces')
    cy.wait(1000)
  })
})
