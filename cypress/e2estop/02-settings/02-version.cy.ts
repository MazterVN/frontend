import { v4 as uuidv4 } from 'uuid'
import { CreateUpsertVersionDocument } from '../../../app/graphql/generated/default'

describe('Working with version feature by Tester Role', () => {
  const createPlatformName = 'Backend API'
  const createPlatformId = 'backend_api_platform_type'
  const createName = 'testing_app'
  const createVersion = 'v999.999.999'
  const createReleaseDate = '01/01/1999'
  const updateReleaseDate = '02/02/2999'
  const createChanges = '**Bold text on line 1**\n*Italic text on line 2*\nRegular text on line 3\n'
  const updateChanges = '**Bold text on line 1**\n*Italic text on line 2*\nRegular text on line 3\nUPDATE'

  const createVariable = {
    input: {
      id: uuidv4(),
      draft: false,
      platform: 'BACKEND_API',
      appName: createName,
      version: createVersion,
      released: '1999-01-01',
      changes: createChanges,
    },
  }

  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/settings/versions')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateUpsertVersionDocument, createVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/settings/versions')
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('draft-checkbox').click()
    cy.selectSetting('platform-selectfield', createPlatformName, createPlatformId)
    cy.dataTestId('app-name-inputfield').type(createName)
    cy.dataTestId('version-inputfield').type(createVersion)
    cy.dataTestId('date-release').type(createReleaseDate)
    cy.insertTextIntoEditor(
      [
        createChanges,
      ],
    )
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('versions', createVersion)
  })
  it('should list', () => {
    cy.sortDataGrid(2)
    cy.dataGridSearch('versions', createVersion)
    cy.get('#grid-versions').should('be.visible')
    cy.get('#grid-versions_content_table')
      .contains('tbody .e-row', createPlatformName)
      .contains('tbody .e-row', createName)
      .contains('tbody .e-row', createVersion)
      .contains('tbody .e-row', createReleaseDate)
      .should('exist')
  })
  it('should update', () => {
    cy.dataGridSearch('versions', createVersion)
    cy.dataGridSelectRow('versions')
    cy.openEditModal()
    cy.dataTestId('draft-checkbox').click()
    cy.dataTestId('date-release').clear().type(updateReleaseDate)
    cy.insertTextIntoEditor(
      [
        updateChanges,
      ],
    )
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch('versions', createVersion)
  })
})
