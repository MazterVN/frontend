import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedStudentDocument, CreateRelatedRelativeDocument } from '../../../../app/graphql/generated/default'

describe('Student create and update feature', () => {
  const feature = 'students'
  const createStudentRelativeVariables = [
    {
      input: {
        id: uuidv4(),
        bookId: '00000',
        name: 'សាច់ញាត្តិប្រុស',
        latin: 'Male Relative',
        gender: 'MALE',
        dob: '2012-01-01',
        tel: '0123456781',
        contacts: [
          {
            id: uuidv4(),
            type: 'TEL',
            value: '0123456781',
          },
          {
            id: uuidv4(),
            type: 'TELEGRAM',
            value: '0123456781',
          },
        ],
        studentRelatives: [],
        studentParents: [],
        studentAddresses: [],
        studentImages: [],
      },
    },
    {
      input: {
        id: uuidv4(),
        bookId: '00000',
        name: 'សាច់ញាត្តិស្រី',
        latin: 'Female Relative',
        gender: 'FEMALE',
        dob: '2012-02-02',
        tel: '0123456782',
        contacts: [
          {
            id: uuidv4(),
            type: 'TEL',
            value: '0123456782',
          },
          {
            id: uuidv4(),
            type: 'TELEGRAM',
            value: '0123456782',
          },
        ],
        studentRelatives: [],
        studentParents: [],
        studentAddresses: [],
        studentImages: [],
      },
    },
    {
      input: {
        id: uuidv4(),
        bookId: '00000',
        name: 'សាច់ញាត្តិអ៊ុំ',
        latin: 'Uncle Relative',
        gender: 'MALE',
        dob: '2012-03-03',
        tel: '0123456783',
        contacts: [
          {
            id: uuidv4(),
            type: 'TEL',
            value: '0123456783',
          },
          {
            id: uuidv4(),
            type: 'TELEGRAM',
            value: '0123456783',
          },
        ],
        studentRelatives: [],
        studentParents: [],
        studentAddresses: [],
        studentImages: [],
      },
    },
  ]

  const relativeOneId = uuidv4()
  const relativeOneKm = 'សាច់ញាតិ្តទី១'
  const relativeOneEn = 'First Relative'
  const relativeTwoId = uuidv4()
  const relativeTwoKm = 'សាច់ញាតិ្តទី២'
  const relativeTwoEn = 'Second Relative'
  const relativeThreeId = uuidv4()
  const relativeThreeKm = 'សាច់ញាតិ្តទី៣'
  const relativeThreeEn = 'Third Relative'
  const createRelativeVariables = [
    {
      input: {
        id: relativeOneId,
        name: 'Master Record',
        language: 'KM',
        sortOrder: 0,
        relatives: [
          {
            id: uuidv4(),
            name: relativeOneKm,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: relativeOneEn,
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: relativeTwoId,
        name: 'Master Record',
        language: 'KM',
        sortOrder: 0,
        relatives: [
          {
            id: uuidv4(),
            name: relativeTwoKm,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: relativeTwoEn,
            language: 'EN',
          },
        ],
      },
    },
    {
      input: {
        id: relativeThreeId,
        name: 'Master Record',
        language: 'KM',
        sortOrder: 0,
        relatives: [
          {
            id: uuidv4(),
            name: relativeThreeKm,
            language: 'KM',
          },
          {
            id: uuidv4(),
            name: relativeThreeEn,
            language: 'EN',
          },
        ],
      },
    },
  ]
  const createVariable = {
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
      studentRelatives: [
        {
          id: uuidv4(),
          relatedStudentId: createStudentRelativeVariables[0]?.input.id || '',
          relativeId: relativeOneId,
        },
        {
          id: uuidv4(),
          relatedStudentId: createStudentRelativeVariables[1]?.input.id || '',
          relativeId: relativeTwoId,
        },
      ],
      studentParents: [],
      studentAddresses: [],
      studentImages: [],
    },
  }

  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.viewport(2048, 1152)
      cy.visit('/students').wait(3000)
      cy.setBearerToken()
      createRelativeVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedRelativeDocument, variable)
      })
      cy.wait(1000)
      createStudentRelativeVariables.map((variable) => {
        cy.factoryGraphqlData(CreateRelatedStudentDocument, variable)
      })
      cy.wait(1000)
      cy.factoryGraphqlData(CreateRelatedStudentDocument, createVariable)
      cy.wait(1000)
    })
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should create', () => {
    cy.visit('/students').wait(3000)
    cy.setBearerToken()
    createRelativeVariables.map((variable) => {
      cy.factoryGraphqlData(CreateRelatedRelativeDocument, variable)
    })
    cy.wait(1000)
    createStudentRelativeVariables.map((variable) => {
      cy.factoryGraphqlData(CreateRelatedStudentDocument, variable)
    })
    cy.wait(1000)
    cy.openCreateModal()
    cy.dataTestId('name').type('សិស្ស តេស្ដ')
    cy.dataTestId('latin').type('STUDENT TEST')
    cy.selectSetting('gender', 'ស្រី', 'female_gender_type')
    cy.get('[data-testid="dob"] input.el-input__inner').type('12/12/2012').blur()
    cy.dataTestId('tel').type('0123456789')
    cy.dataTestId('contacts.0.value').type('0123456789')
    cy.dataTestId('remove-contact-btn-2').click().wait(300)
    cy.dataTestId('remove-contact-btn-1').click().wait(300)
    cy.dataTestId('contacts.1.value').type('0123456789')
    cy.selectSetting('studentRelatives-0-relatedStudentId', createStudentRelativeVariables[0]?.input.name || '', createStudentRelativeVariables[0]?.input.id || '')
    cy.selectSetting('studentRelatives-0-relativeId', relativeOneKm, relativeOneId)
    cy.dataTestId('add-relative-btn').click()
    cy.selectSetting('studentRelatives-1-relatedStudentId', createStudentRelativeVariables[1]?.input.name || '', createStudentRelativeVariables[1]?.input.id || '')
    cy.selectSetting('studentRelatives-1-relativeId', relativeTwoKm, relativeTwoId)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.wait(1000)
  })
  it('should list in khmer language', () => {
    cy.dataGridSearch(feature, createVariable.input.name)
    cy.sortDataGrid(4)
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', createVariable.input.name)
      .contains('tbody .e-row', createVariable.input.latin)
      .contains('tbody .e-row', 'ស្រី')
      .contains('tbody .e-row', createVariable.input.tel)
      .should('exist')
    cy.wait(1000)
  })
  it('should list in english language', () => {
    cy.toggleLocal()
    cy.dataGridSearch(feature, createVariable.input.latin)
    cy.sortDataGrid(4)
    cy.get(`#grid-${feature}`).should('be.visible')
    cy.get(`#grid-${feature}_content_table`)
      .contains('tbody .e-row', createVariable.input.name)
      .contains('tbody .e-row', createVariable.input.latin)
      .contains('tbody .e-row', 'Female')
      .contains('tbody .e-row', createVariable.input.tel)
      .should('exist')
    cy.wait(1000)
  })
  it('should update', () => {
    cy.dataGridSearch(feature, createVariable.input.name)
    cy.dataGridSelectRow(feature)
    cy.openEditModal()
    cy.intercept('POST', '**/api/AmazonS3Provider/AmazonS3FileOperations').as('amazonS3Request')
    cy.dataTestId('upload-images')
      .find('button')
      .click()
    cy.wait('@amazonS3Request')

    // Alias for next time
    cy.contains('li.e-list-item', 'Test Folder').as('openTestFolder')

    // Open test folder
    cy.get('@openTestFolder').dblclick()
    cy.wait('@amazonS3Request')

    cy.contains('div.e-text-content', 'test-img.jpg').rightclick()
    cy.wait(500)
    cy.contains('li.e-menu-item', 'Choose').click()
    cy.wait(200)
    cy.closeModalX()

    cy.dataTestId('name').type(' កែប្រែ')
    cy.dataTestId('latin').type(' UPDATE')
    cy.selectSetting('gender', 'ប្រុស', 'male_gender_type')
    cy.get('[data-testid="dob"] input.el-input__inner').clear().type('10/10/2010').blur()
    cy.dataTestId('tel').clear().type('0987654321')
    cy.dataTestId('contacts-0-value').clear().type('0987654321')
    cy.dataTestId('remove-contact-btn-1').click().wait(300)
    cy.dataTestId('remove-relative-btn-1').click().wait(300)

    cy.selectSetting('studentRelatives-0-relatedStudentId', createStudentRelativeVariables[2]?.input.name || '', createStudentRelativeVariables[2]?.input.id || '')
    cy.selectSetting('studentRelatives-0-relativeId', relativeThreeKm, relativeThreeId)

    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
  })
})
