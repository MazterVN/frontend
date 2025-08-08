import { v4 as uuidv4 } from 'uuid'
import { CreateUpsertImagePropertySettingDocument } from '../../../../app/graphql/generated/default'

describe('Working with image property settings feature', () => {
  const feature = 'image-property-settings'
  const createUseWithFilter = 'Transcript'
  const createUseWithData = 'TRANSCRIPT'
  const updateUseWithFilter = 'Print Invoice'
  const updateUseWithData = 'PRINT_INVOICE'
  const createWidth = '1080'
  const createHeight = '720'
  const updateWidth = '2160'
  const updateHeight = '1440'

  const createVariable = {
    input: {
      id: uuidv4(),
      useWith: createUseWithData,
      width: parseFloat(createWidth),
      height: parseFloat(createHeight),
    },
  }

  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/settings/medias/image-property-settings')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateUpsertImagePropertySettingDocument, createVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/medias/image-property-settings')
    cy.wait(1000)
    cy.openCreateModal()
    cy.selectSetting('use-with-select-field', createUseWithFilter, `${createUseWithData.toLowerCase()}_image_property_use_with_type`)
    cy.dataTestId('width-numeric-field').first().type(createWidth).blur()
    cy.dataTestId('height-numeric-field').first().type(createHeight).blur()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
  })
  it('should list in khmer language', () => {
    cy.reload()
    cy.wait(1000)
    cy.sortDataGrid(0)
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', createUseWithData)
      .contains('tbody .e-row', createWidth)
      .contains('tbody .e-row', createHeight)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.toggleLocal()
    cy.reload()
    cy.wait(1000)
    cy.sortDataGrid(0)
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', createUseWithData)
      .contains('tbody .e-row', createWidth)
      .contains('tbody .e-row', createHeight)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.reload()
    cy.wait(1000)
    cy.dataGridSearch(feature, createUseWithData)
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.selectSetting('use-with-select-field', updateUseWithFilter, `${updateUseWithData.toLowerCase()}_image_property_use_with_type`)
    cy.dataTestId('width-numeric-field').first().clear().type(updateWidth).blur()
    cy.dataTestId('height-numeric-field').first().clear().type(updateHeight).blur()
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch(feature, updateUseWithData)
    cy.dataGridSelectRow(feature)
    cy.wait(1000)
  })
})
