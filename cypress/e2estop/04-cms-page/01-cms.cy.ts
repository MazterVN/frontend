import { v4 as uuidv4 } from 'uuid'
import { CreateUpsertCmsPageDocument } from '../../../app/graphql/generated/default'

describe('Working with CMS feature by Tester Role', () => {
  const feature = 'cms-pages'
  const title = 'Test CMS'
  const slug = 'test-cms'
  const content = '**Bold text on line 1**\n*Italic text on line 2*\nRegular text on line 3\n![PKS](https://sms.cloudware.com.kh/images/pks-home.jpeg)\n/Underline text on line 1/'

  const titleUpdate = ' Update'
  const slugUpdate = '-update'
  const contentUpdate = '**Bold text on line 1**\n*Italic text on line 2*\nRegular text on line 3\n![PKS](https://sms.cloudware.com.kh/images/pks-home.jpeg)\n/Underline text on line 1/'

  const createVariable = {
    input: {
      id: uuidv4(),
      title: title,
      slug: slug,
      markdown: content,
    },
  }
  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.visit('/cms')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateUpsertCmsPageDocument, createVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/cms')
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('title-input-field').type(title).blur()
    cy.dataTestId('slug-input-field').type(slug).blur()
    cy.insertTextIntoEditor(
      [
        content,
      ],
    )
    cy.wait(1000)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
  })
  it('should update', () => {
    cy.dataGridSearch(feature, title)
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.dataTestId('title-input-field').type(titleUpdate).blur()
    cy.dataTestId('slug-input-field').type(slugUpdate).blur()
    cy.insertTextIntoEditor(
      [
        contentUpdate,
      ],
    )
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.wait(1000)
  })
  it('should search', () => {
    cy.dataGridSearch(feature, title)
    cy.sortDataGrid(0)
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', title)
      .should('exist')
    cy.wait(1000)
  })
})
