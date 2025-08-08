describe('Grades', () => {
  const skips = ['should redirect back', 'should create']
  beforeEach(function () {
    cy.skipBeforeEach(skips).then((shouldSkip) => {
      if (shouldSkip) {
        return
      }
      cy.log('Before each=============================================End')
    })
  })

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })

  it('should test 1', () => {
    cy.visit('/settings/grades/study-years')
    cy.wait(1000)
    cy.openCreateModal()
  })

  it('should test s', () => {
    cy.visit('/')
  })

  it('should test 3', () => {
    cy.visit('/')
  })

  it('should test 4', () => {
    cy.visit('/')
  })
})
