// cypress/support/commands.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = object> {
    dataTestId(id: string): Chainable<Subject>

    login(): Chainable<Subject>

    logout(): Chainable<Subject>

    selectSettingByIndex(dataTestId: string, filter: string, eq: number = 0): Chainable<Subject>

    selectSetting(dataTestId: string, filter: string, listId: string, eq: number = 0): Chainable<Subject>

    dataGridSearch(feature: string, valueToSearch: string): Chainable<Subject>

    dataGridSelectRow(feature: string, dataRowIndex: number = 1, colIndex: number = 1): Chainable<Subject>

    openCreateModal(): Chainable<Subject>

    openEditModal(): Chainable<Subject>

    toggleLocal(): Chainable<Subject>

    clearSelectSetting(dataTestId: string): Chainable<Subject>

    submitForm(): Chainable<Subject>

    closeModal(): Chainable<Subject>

    submitAssertSuccessful(successMessage: string): Chainable<Subject>

    submitFailure(failureMessage: string): Chainable<Subject>

    dateRangPicker(num: number): Chainable<Subject>

    startSandbox(): Chainable<Subject>

    stopSandbox(): Chainable<Subject>

    attachSandboxHeader(): Chainable<Subject>

    insertTextIntoEditor(textLines: [string]): Chainable<Subject>

    sortDataGrid(byColIndex: number): Chainable<Subject>

    toggleRoomCell(row: number, col: number): Chainable<Subject>

    setBearerToken(): Chainable<Subject>

    factoryGraphqlData(query: DocumentNode, variables: object): Chainable<Subject>
    seedGraphqlData(query: string, variables: object): Chainable<Subject>

    validationErrorMessage(errorText: string, index: number = 0): Chainable<Subject>

    closeModalX(): Chainable<Subject>

    skipBeforeEach(testsToSkip: string[]): Chainable<boolean>

    loginWithPassword(): Chainable<Subject>
  }
}
