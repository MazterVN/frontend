import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedUpsertCmsBlogDocument } from '../../../app/graphql/generated/default'

describe('Working with blog feature by Tester Role', () => {
  const feature = 'cms-blogs'
  const createTitle = 'Blog Test'
  const createSlug = 'blog-test'
  const createCompartment = 'PKS_MOBILE_HOME_PAGE'
  const createCategory = 'NEWS'
  const createNote = `**Bold text on line 1** *Italic text on line 2* Regular text on line 3 ![PKS](https://sms.cloudware.com.kh/images/pks-home.jpeg)`
  const updateNote = `**Bold text on line 1** *Italic text on line 2* Regular text on line 3 ![PKS](https://sms.cloudware.com.kh/images/pks-home.jpeg) Update this line`
  const updateTitle = 'Blog Test Updated'

  const bucket = 'pks-bucket-prod'
  const createVariable = {
    input: {
      id: uuidv4(),
      title: createTitle,
      slug: createSlug,
      compartment: createCompartment,
      category: createCategory,
      markdown: createNote,
      thumbnails: [
        {
          id: uuidv4(),
          bucket: bucket,
          key: 'uploads/3c799e85-7950-4273-9235-dfb54e0c87dc-test-img.jpg',
          namespace: 'BLOG_THUMBNAIL',
        },
      ],
      attachments: [
        {
          id: uuidv4(),
          bucket: bucket,
          key: 'uploads/e608baa1-a04d-4119-abaf-2a40abccbbeb-test-img.jpg',
          namespace: 'BLOG_ATTACHMENT',
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
      cy.visit('/cms/blog')
      cy.wait(1000)
      cy.setBearerToken()
      cy.factoryGraphqlData(CreateRelatedUpsertCmsBlogDocument, createVariable)
      cy.wait(1000)
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    // Alias waiting for request open file manager
    cy.intercept('POST', '**/api/AmazonS3Provider/AmazonS3FileOperations').as('amazonS3Request')

    cy.visit('/cms/blog')
    cy.wait(1000)

    // Start Create
    cy.openCreateModal()

    // Upload thumbnail
    cy.dataTestId('upload-thumbnails')
      .find('button')
      .click()
    cy.wait('@amazonS3Request')
    // End Open file manager

    // Alias for next time
    cy.contains('li.e-list-item', 'Test Folder').as('openTestFolder')

    // Open test folder
    cy.get('@openTestFolder').dblclick()
    cy.wait('@amazonS3Request')
    cy.contains('div.e-text-content', 'test-img.jpg').rightclick()
    cy.wait(500)
    cy.contains('li.e-menu-item', 'Choose').click()
    cy.closeModalX()
    cy.dataTestId('title-input-field').type(createTitle, { delay: 20 })
    cy.selectSetting('compartment', 'PKS Mobile', 'pks_mobile_home_page_blog_compartment_type')
    cy.selectSetting('category', 'ព័ត៌មាន', 'news_blog_category_type')
    cy.insertTextIntoEditor(
      [
        createNote,
      ],
    )
    cy.wait(500)
    cy.get('[data-testid="upload-attachments"]').scrollIntoView().should('be.visible')
    cy.wait(500)
    cy.dataTestId('upload-attachments')
      .find('button')
      .click()
    cy.wait('@amazonS3Request')
    cy.get('@openTestFolder').dblclick()
    cy.wait('@amazonS3Request')
    cy.wait(500)
    cy.contains('div.e-text-content', 'test-dog.jpeg').rightclick()
    cy.wait(500)
    cy.contains('li.e-menu-item', 'Choose').click()
    cy.closeModalX()
    cy.wait(500)
    cy.dataTestId('upload-attachments')
      .find('button')
      .click()
    cy.wait('@amazonS3Request')
    cy.get('@openTestFolder').dblclick()
    cy.wait('@amazonS3Request')
    cy.wait(500)
    cy.contains('div.e-text-content', 'test-img.jpg').rightclick()
    cy.wait(500)
    cy.contains('li.e-menu-item', 'Choose').click()
    cy.closeModalX()
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
  })
  it('should update', () => {
    cy.dataGridSearch(feature, createTitle)
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.wait(1000)
    cy.dataTestId('title-input-field').clear().type(updateTitle, { delay: 20 })
    cy.selectSetting('compartment', 'PKS Mobile', 'pks_mobile_home_page_blog_compartment_type')
    cy.selectSetting('category', 'ព្រឹត្តិការ', 'event_blog_category_type')
    cy.insertTextIntoEditor(
      [
        updateNote,
      ],
    )
    cy.wait(500)
    cy.get('[data-testid="upload-attachments"]').scrollIntoView().should('be.visible')
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.dataGridSearch(feature, 'Update')
  })
  it('should search', () => {
    cy.dataGridSearch(feature, createTitle)
    cy.sortDataGrid(1)
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', createTitle)
      .should('exist')
    cy.wait(1000)
  })
})
