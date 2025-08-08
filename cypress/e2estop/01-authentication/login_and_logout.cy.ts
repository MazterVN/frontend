describe('Login successful redirect to home page and Logout', () => {
  it('should logout after session has restored', () => {
    cy.visit('/')
    cy.wait(3000)
    cy.setBearerToken()
    cy.logout()
  })
})
