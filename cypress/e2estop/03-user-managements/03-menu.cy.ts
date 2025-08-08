describe('Working with roles feature by Tester Role', () => {
  Cypress.on('uncaught:exception', (err, _) => {
    if (err.message.includes('Cannot read properties of null (reading \'focus\')')) {
      return false
    }
  })
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should list and create_related_upsert', () => {
    const menuEleSelector = '[data-testid^="menu-"]'
    cy.visit('/user-managements/menus').wait(1000)
    cy.get(menuEleSelector).then((elements) => {
      const initMenuEleSelectorLength = elements.length
      cy.dataTestId('add-menu-btn').click()
      cy.dataTestId(`menu-${initMenuEleSelectorLength}`).click()
      cy.wait(200)
      cy.dataTestId('translation-input-field').type('/testing-menus')
      cy.dataTestId('icon-class-input-field').type('icon-class')
      cy.dataTestId('menu-path-input-field').type('/testing-menus')
      cy.dataTestId('permission-input-field').type('menus:testing-menus')
      cy.dataTestId('add-active-path-btn').click()
      cy.dataTestId('active-paths.0.op')
        .click()
        .then(() => {
          cy.contains('[role="option"]', 'EQ').click()
        })
      cy.dataTestId('active-paths.0.path').type('/testing-menus')
      cy.dataTestId('add-menu-permission-btn').click()
      cy.selectSetting('menu-permissions.0.permission-id', 'home', 'eca5721f-84ac-497a-a927-8fd06df79536')
      cy.submitForm()
        .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    })
  })
})
