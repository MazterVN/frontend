import { v4 as uuidv4 } from 'uuid'
import { CreateRelatedStudyYearDocument } from '../../../app/graphql/generated/default'

describe('Working with set current study year feature', () => {
  const studyYearId = uuidv4()
  const beginsAt = '1999-01-01'
  const endsAt = '1999-12-31'
  const studyYearKmName = '១៩៩៩-២០០០'
  const studyYearEnName = '1999-2000'
  const createVariables = {
    input: {
      id: studyYearId,
      name: 'Master Record',
      language: 'KM',
      beginsAt: beginsAt,
      endsAt: endsAt,
      studyYears: [
        {
          id: uuidv4(),
          name: studyYearKmName,
          language: 'KM',
          beginsAt: beginsAt,
          endsAt: endsAt,
        },
        {
          id: uuidv4(),
          name: studyYearEnName,
          language: 'EN',
          beginsAt: beginsAt,
          endsAt: endsAt,
        },
      ],
    },
  }

  it('should redirect back', () => {
    cy.visit('/').wait(1000)
  })
  it('should set current study-year', () => {
    cy.visit('/settings/current-study-years')
    cy.wait(1000)
    cy.setBearerToken()
    cy.factoryGraphqlData(CreateRelatedStudyYearDocument, createVariables)
    cy.wait(1000)
    cy.selectSetting('study-year-id-select-field', studyYearKmName, studyYearId)
    cy.submitForm()
      .submitAssertSuccessful('កែប្រែបានជោគជ័យ')
  })
})
