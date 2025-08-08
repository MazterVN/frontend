describe('Working with students feature by Tester Role', () => {
  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should list', () => {
    cy.visit('/buildings/room').wait(3000)

    cy.get('#grid-building-room').should('be.visible')
    cy.dataGridSearch('building-room', 'B')

    cy.get('#grid-building-room_content_table')
      .contains('tbody .e-row', 'B')
      .should('exist')
    cy.get('#grid-building-room_content_table')
      .contains('tbody .e-row', 'B3001')
      .should('exist')
    cy.wait(1000)
  })
  it('should create and update the record', () => {
    const createCellsToToggle = [
      [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1],
      [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2],
      [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
      [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5],
    ]
    cy.visit('/buildings/room').wait(3000)
    cy.openCreateModal()

    cy.dataTestId('building').type('Building Test')
    cy.dataTestId('floor').type('1')
    cy.dataTestId('room-no').type('101')
    createCellsToToggle.forEach(([row, col]) => {
      // Ensure row and col are numbers before passing to toggleRoomCell
      cy.toggleRoomCell(Number(row), Number(col))
    })
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('បន្ថែមបានជោគជ័យ')
    cy.closeModal()
    cy.wait(500)

    // End Create
    cy.dataGridSearch('building-room', 'Building Test')
    cy.dataGridSelectRow('building-room')
    cy.openEditModal()

    cy.dataTestId('building').type(' Update')
    cy.dataTestId('floor').clear().type('2')
    cy.dataTestId('room-no').clear().type('201')

    const updateCellsToToggle = [
      [1, 2], [2, 2], [3, 2], [4, 2],
      [1, 4], [2, 4], [3, 4], [4, 4],
      [1, 3], [2, 3], [3, 3], [5, 2],
      [5, 4], [4, 3],
    ]
    updateCellsToToggle.forEach(([row, col]) => {
      cy.toggleRoomCell(Number(row), Number(col))
    })
    cy.wait(500)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
    cy.closeModal()
    cy.wait(500)
  })
})
