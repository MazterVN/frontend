import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedUpsertRoleDocument } from '../../../app/graphql/generated/default'

describe('Working with roles feature by Tester Role', () => {
  Cypress.on('uncaught:exception', () => {
    return false
  })

  const name = 'Role Tester'
  const description = 'Role Tester Description'
  const createVariable = {
    input: {
      id: uuidv4(),
      name: name,
      description: description,
      rolePermissions: [
        {
          id: uuidv4(),
          permissionId: 'eca5721f-84ac-497a-a927-8fd06df79536',
        },
        {
          id: uuidv4(),
          permissionId: 'df4cfe85-db9f-46d7-9b0f-c2e7babbced4',
        },
        {
          id: uuidv4(),
          permissionId: 'cdf74c74-0698-46d5-8f6a-9293cebc17ac',
        },
        {
          id: uuidv4(),
          permissionId: '86ec504b-3db1-489e-aed5-333a711fb7c6',
        },
        {
          id: uuidv4(),
          permissionId: '594f88e1-7836-4f4e-ace0-2f73865e0bd2',
        },
      ],
    },
  }

  beforeEach(() => {
    cy.viewport(2048, 1152)
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should list', () => {
    cy.visit('/user-managements/roles').wait(1000)
    cy.sortDataGrid(0)
    cy.get('#grid-roles').should('be.visible')
    cy.get('#grid-roles_content_table')
      .contains('tbody .e-row', 'Default student')
      .contains('tbody .e-row', 'Default student role')
      .should('exist')
    cy.wait(1000)
  })

  it('should create', () => {
    cy.visit('/user-managements/roles').wait(1000)
    cy.openCreateModal()
    cy.wait(1000)
    cy.dataTestId('name-input-field').type('Role Tester')
    cy.dataTestId('description-input-field').type('Role Tester Description')
    cy.dataTestId('menu-item-0').click()
    cy.wait(300)
    cy.dataTestId('menu-item-0').eq(1).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.0.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.1.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.2.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.3.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.0.is-active-checkbox').eq(1).click()
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.wait(1000)
  })
  it('should update', () => {
    cy.visit('/user-managements/roles')
    cy.wait(1000)
    cy.setBearerToken()
    cy.factoryGraphqlData(CreateRelatedUpsertRoleDocument, createVariable)
    cy.wait(1000)
    cy.dataGridSearch('roles', 'Role Tester')
    cy.dataGridSelectRow('roles')
    cy.openEditModal()
    cy.dataTestId('name-input-field').type(' Updated')
    cy.dataTestId('description-input-field').type(' Updated')
    cy.dataTestId('menu-item-0').click()
    cy.wait(300)
    cy.dataTestId('menu-item-0').eq(1).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.0.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.1.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.2.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.3.is-active-checkbox').eq(0).click()
    cy.wait(300)
    cy.dataTestId('menu-permissions.0.is-active-checkbox').eq(1).click()
    cy.wait(300)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
  })
})
