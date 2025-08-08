import gql from 'graphql-tag';
export const Currency = gql`
    fragment Currency on Currencies {
  id
  symbol
  flag
}
    `;
export const ActiveMenuPath = gql`
    fragment ActiveMenuPath on ActiveMenuPath {
  id
  op
  path
}
    `;
export const Menu = gql`
    fragment Menu on Menus {
  id
  iconClass
  localizedGettextId
  position
  gettextId
  path
  permissionKey
  activePaths {
    ...ActiveMenuPath
  }
  menuPermissions {
    id
    permissionId
  }
}
    `;
export const ServiceSetting = gql`
    fragment ServiceSetting on Services {
  id
  name
  description
  beginsAt
  endsAt
  type
  localizedType
  studyYearId
  studyYearLocalized
  insertedAt
}
    `;
export const ServiceForm = gql`
    fragment ServiceForm on Services {
  id
  name
  description
  beginsAt
  endsAt
  type
  studyYearId
  serviceDetails {
    id
    serviceNameId
  }
  serviceFees {
    id
    monthRepeat
    price
    fixedDiscount
  }
}
    `;
export const ListBestPracticeDocument = gql`
    query ListBestPractice($datamanager: DatamanagerInput) {
  listBestPractice(datamanager: $datamanager) {
    count
    results {
      id
      name
      description
      passedGpa
      insertedAt
    }
  }
}
    `;
export const EditBestPracticeDocument = gql`
    query EditBestPractice($id: ID!) {
  editBestPractice(id: $id) {
    id
    name
    description
    passedGpa
    bestPractices {
      id
      startCondOp
      startCondValue
      endCondOp
      endCondValue
      gradeLevelId
    }
  }
}
    `;
export const CreateRelatedBestPracticeDocument = gql`
    mutation CreateRelatedBestPractice($input: CreateRelatedBestPracticeInput!) {
  createRelatedBestPractice(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedBestPracticeDocument = gql`
    mutation UpdateRelatedBestPractice($id: ID!, $input: UpdateRelatedBestPracticeInput!) {
  updateRelatedBestPractice(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const CreateRelatedUpsertBuildingRoomDocument = gql`
    mutation CreateRelatedUpsertBuildingRoom($input: CreateRelatedUpsertBuildingRoomInput!) {
  createRelatedUpsertBuildingRoom(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListBuildingRoomDocument = gql`
    query ListBuildingRoom($datamanager: DatamanagerInput) {
  listBuildingRooms(datamanager: $datamanager) {
    count
    results {
      id
      building
      floor
      roomNo
      seatCount
      insertedAt
    }
  }
}
    `;
export const ListBuildingRoomDropdownDocument = gql`
    query ListBuildingRoomDropdown($datamanager: DatamanagerInput) {
  listBuildingRooms(datamanager: $datamanager) {
    count
    results {
      id
      fullBuildingRoomNameCalc
    }
  }
}
    `;
export const ListBuildingRoomSeatDropdownDocument = gql`
    query ListBuildingRoomSeatDropdown($datamanager: DatamanagerInput) {
  listBuildingRoomSeats(datamanager: $datamanager) {
    count
    results {
      id
      seatNo
    }
  }
}
    `;
export const EditBuildingRoomDocument = gql`
    query EditBuildingRoom($id: ID!) {
  editBuildingRoom(id: $id) {
    id
    building
    floor
    roomNo
    buildingRoomSeats {
      id
      row
      column
      seatNo
    }
  }
}
    `;
export const CreateRelatedUpsertCmsBlogDocument = gql`
    mutation CreateRelatedUpsertCmsBlog($input: CreateRelatedUpsertCmsBlogInput!) {
  createRelatedUpsertCmsBlog(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListCmsBlogDocument = gql`
    query ListCmsBlog($datamanager: DatamanagerInput) {
  listCmsBlogs(datamanager: $datamanager) {
    count
    results {
      id
      title
      slug
      thumbnail {
        uri
      }
      compartmentLocalized
      categoryLocalized
      durationLocalized
      authorName
      authorPicture
      authorEmailOrPhone
      insertedAt
    }
  }
}
    `;
export const EditCmsBlogDocument = gql`
    query EditCmsBlog($id: ID!) {
  editCmsBlog(id: $id) {
    id
    title
    slug
    compartment
    category
    markdown
    thumbnails {
      id
      bucket
      key
      name
      namespace
      uri
    }
    attachments {
      id
      bucket
      key
      name
      namespace
      uri
    }
  }
}
    `;
export const CreateUpsertCmsPageDocument = gql`
    mutation CreateUpsertCmsPage($input: CreateUpsertCmsPageInput!) {
  createUpsertCmsPage(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListCmsPageDocument = gql`
    query ListCmsPage($datamanager: DatamanagerInput) {
  listCmsPages(datamanager: $datamanager) {
    count
    results {
      id
      title
      slug
      markdown
      insertedAt
    }
  }
}
    `;
export const EditCmsPageDocument = gql`
    query EditCmsPage($id: ID!) {
  editCmsPage(id: $id) {
    id
    title
    slug
    markdown
  }
}
    `;
export const ListCommuneDocument = gql`
    query ListCommune($datamanager: DatamanagerInput) {
  listCommunes(datamanager: $datamanager) {
    count
    results {
      id
      value
      district {
        value
        province {
          value
        }
      }
      insertedAt
    }
  }
}
    `;
export const ListCommuneDropdownDocument = gql`
    query ListCommuneDropdown($datamanager: DatamanagerInput) {
  listCommunes(datamanager: $datamanager) {
    count
    results {
      id
      value
      nameWithHelper
    }
  }
}
    `;
export const EditCommuneDocument = gql`
    query EditCommune($id: ID!) {
  editCommune(id: $id) {
    id
    districtId
    name
    language
    communes {
      id
      districtId
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedCommuneDocument = gql`
    mutation CreateRelatedCommune($input: CreateRelatedCommuneInput!) {
  createRelatedCommune(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedCommuneDocument = gql`
    mutation UpdateRelatedCommune($id: ID!, $input: UpdateRelatedCommuneInput!) {
  updateRelatedCommune(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListCurrencyDocument = gql`
    query ListCurrency($datamanager: DatamanagerInput) {
  listCurrencies(datamanager: $datamanager) {
    count
    results {
      ...Currency
    }
  }
}
    ${Currency}`;
export const EditCurrencyDocument = gql`
    query EditCurrency($id: ID!) {
  editCurrency(id: $id) {
    ...Currency
  }
}
    ${Currency}`;
export const CreateUpsertCurrencyDocument = gql`
    mutation CreateUpsertCurrency($input: CreateUpsertCurrencyInput!) {
  createUpsertCurrency(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListCurrencyBaseDocument = gql`
    query ListCurrencyBase($datamanager: DatamanagerInput) {
  listCurrencyBases(datamanager: $datamanager) {
    count
    results {
      id
      currency {
        symbol
        flag
      }
    }
  }
}
    `;
export const EditCurrencyBaseDocument = gql`
    query EditCurrencyBase($id: ID!) {
  editCurrencyBase(id: $id) {
    id
    currencyId
    currencyRates {
      id
      currencyId
      rate
    }
  }
}
    `;
export const CreateUpsertCurrencyBaseDocument = gql`
    mutation CreateUpsertCurrencyBase($input: CreateUpsertCurrencyBaseInput!) {
  createUpsertCurrencyBase(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ReadOneCurrentEnrollmentStudyYearDocument = gql`
    query ReadOneCurrentEnrollmentStudyYear {
  readOneCurrentEnrollmentStudyYear {
    id
    sourceStudyYearId
    destinationStudyYearId
  }
}
    `;
export const CreateUpsertCurrentEnrollmentStudyYearDocument = gql`
    mutation CreateUpsertCurrentEnrollmentStudyYear($input: CreateUpsertCurrentEnrollmentStudyYearInput!) {
  createUpsertCurrentEnrollmentStudyYear(input: $input) {
    errors {
      fields
      message
    }
  }
}
    `;
export const CreateUpsertCurrentStudyYearDocument = gql`
    mutation CreateUpsertCurrentStudyYear($input: CreateUpsertCurrentStudyYearInput!) {
  createUpsertCurrentStudyYear(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const EditCurrentStudyYearDocument = gql`
    query EditCurrentStudyYear {
  readOneCurrentStudyYear {
    id
    studyYearId
  }
}
    `;
export const ListDaysOfWeekDocument = gql`
    query ListDaysOfWeek($language: Language, $datamanager: DatamanagerInput) {
  listDaysOfWeeks(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListDaysOfWeekDropdownDocument = gql`
    query ListDaysOfWeekDropdown($language: Language, $datamanager: DatamanagerInput) {
  listDaysOfWeeks(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditDaysOfWeekDocument = gql`
    query EditDaysOfWeek($id: ID!) {
  editDaysOfWeek(id: $id) {
    id
    name
    language
    sortOrder
    daysOfWeeks {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedDaysOfWeekDocument = gql`
    mutation CreateRelatedDaysOfWeek($input: CreateRelatedDaysOfWeekInput!) {
  createRelatedDaysOfWeek(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedDaysOfWeekDocument = gql`
    mutation UpdateRelatedDaysOfWeek($id: ID!, $input: UpdateRelatedDaysOfWeekInput!) {
  updateRelatedDaysOfWeek(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const CreateRelatedUpsertDiscountDocument = gql`
    mutation CreateRelatedUpsertDiscount($input: CreateRelatedUpsertDiscountInput!) {
  createRelatedUpsertDiscount(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const EditDiscountDocument = gql`
    query EditDiscount($id: ID) {
  editDiscount(id: $id) {
    id
    startsAt
    expiresAt
    value
    description
    studentServiceDiscounts {
      id
      studentServiceId
    }
  }
}
    `;
export const ListDiscountDocument = gql`
    query ListDiscount($datamanager: DatamanagerInput) {
  listDiscounts(datamanager: $datamanager) {
    count
    results {
      id
      valueCalc
      description
      startsAt
      expiresAt
      limitUsageCalc
    }
  }
}
    `;
export const ListDistrictDocument = gql`
    query ListDistrict($datamanager: DatamanagerInput) {
  listDistricts(datamanager: $datamanager) {
    count
    results {
      id
      value
      province {
        value
      }
      insertedAt
    }
  }
}
    `;
export const ListDistrictDropdownDocument = gql`
    query ListDistrictDropdown($datamanager: DatamanagerInput) {
  listDistricts(datamanager: $datamanager) {
    count
    results {
      id
      value
      nameWithHelper
    }
  }
}
    `;
export const EditDistrictDocument = gql`
    query EditDistrict($id: ID!) {
  editDistrict(id: $id) {
    id
    name
    language
    provinceId
    districts {
      id
      provinceId
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedDistrictDocument = gql`
    mutation CreateRelatedDistrict($input: CreateRelatedDistrictInput!) {
  createRelatedDistrict(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedDistrictDocument = gql`
    mutation UpdateRelatedDistrict($id: ID!, $input: UpdateRelatedDistrictInput!) {
  updateRelatedDistrict(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListDropReasonDocument = gql`
    query ListDropReason($datamanager: DatamanagerInput) {
  listDropReasons(datamanager: $datamanager) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListDropReasonDropdownDocument = gql`
    query ListDropReasonDropdown($datamanager: DatamanagerInput) {
  listDropReasons(datamanager: $datamanager) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditDropReasonDocument = gql`
    query EditDropReason($id: ID!) {
  editDropReason(id: $id) {
    id
    name
    language
    dropReasons {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedDropReasonDocument = gql`
    mutation CreateRelatedDropReason($input: CreateRelatedDropReasonInput!) {
  createRelatedDropReason(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedDropReasonDocument = gql`
    mutation UpdateRelatedDropReason($id: ID!, $input: UpdateRelatedDropReasonInput!) {
  updateRelatedDropReason(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListEmployeeDropdownDocument = gql`
    query ListEmployeeDropdown($datamanager: DatamanagerInput) {
  listEmployees(datamanager: $datamanager) {
    count
    results {
      id
      employeeCalc
    }
  }
}
    `;
export const CreateUpsertEmployeeDocument = gql`
    mutation CreateUpsertEmployee($input: CreateUpsertEmployeeInput!) {
  createUpsertEmployee(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListEmployeeDocument = gql`
    query ListEmployee($datamanager: DatamanagerInput) {
  listEmployees(datamanager: $datamanager) {
    count
    results {
      id
      name
      latin
      localizedGender
      dob
      localizedType
      tel
      insertedAt
    }
  }
}
    `;
export const EditEmployeeDocument = gql`
    query EditEmployee($id: ID!) {
  editEmployee(id: $id) {
    id
    name
    latin
    gender
    dob
    type
    tel
  }
}
    `;
export const ListEnrollmentDocument = gql`
    query ListEnrollment($datamanager: DatamanagerInput) {
  listEnrollments(datamanager: $datamanager) {
    count
    results {
      id
      studentService {
        serviceName {
          nameLocalized
        }
        student {
          name
          latin
          i18nGender {
            nameLocalized
          }
        }
      }
      enrollmentSettingDestination {
        serviceName {
          nameLocalized
        }
      }
      stateNameLocalized
      insertedAt
    }
  }
}
    `;
export const EditEnrollmentDocument = gql`
    query EditEnrollment($id: ID!) {
  editEnrollment(id: $id) {
    id
    state
    enrollmentSettingDestinationId
    buildingRoomSeatId
    studentServiceId
    sourceStudyYearId
    destinationStudyYearId
    enrollmentStudentDrafts {
      id
      name
      nameEditable
      latin
      latinEditable
      dob
      dobEditable
      gender
      genderEditable
      tel
      telEditable
      email
      emailEditable
      facebook
      facebookEditable
      lineId
      lineIdEditable
    }
    enrollmentAddressDrafts {
      id
      type
      villageId
      villageIdEditable
    }
    enrollmentParentDrafts {
      id
      name
      nameEditable
      latin
      latinEditable
      job
      jobEditable
      tel
      telEditable
      type
      typeEditable
    }
    enrollmentPaymentAttachments {
      id
      bucket
      key
      type
      namespace
      note
    }
  }
}
    `;
export const CreateRelatedEnrollmentDocument = gql`
    mutation CreateRelatedEnrollment($input: CreateRelatedEnrollmentInput!) {
  createRelatedEnrollment(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedEnrollmentDocument = gql`
    mutation UpdateRelatedEnrollment($id: ID!, $input: UpdateRelatedEnrollmentInput!) {
  updateRelatedEnrollment(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListEnrollmentSettingDestinationDropdownDocument = gql`
    query ListEnrollmentSettingDestinationDropdown($datamanager: DatamanagerInput) {
  listEnrollmentSettingDestinations(datamanager: $datamanager) {
    count
    results {
      id
      destinationName
    }
  }
}
    `;
export const ListEnrollmentSettingsDocument = gql`
    query ListEnrollmentSettings($datamanager: DatamanagerInput) {
  listEnrollmentSettings(datamanager: $datamanager) {
    count
    results {
      id
      name
      sourceStudyYear {
        nameLocalized
      }
      destinationStudyYear {
        nameLocalized
      }
      sourceStudyYear {
        nameLocalized
      }
      seatDatetimeStart
      seatDatetimeEnd
      insertedAt
    }
  }
}
    `;
export const EditEnrollmentSettingDocument = gql`
    query EditEnrollmentSetting($id: ID!) {
  editEnrollmentSetting(id: $id) {
    id
    sourceStudyYearId
    destinationStudyYearId
    name
    seatDatetimeStart
    seatDatetimeEnd
    enrollmentSettingSources {
      id
      studyYearId
      subjectGroupingId
      serviceDetailId
    }
    enrollmentSettingDestinations {
      id
      academicDiscipline
      buildingRoomId
      maxSeat
      serviceDetailId
      serviceNameCalc
      studyYearId
      subjectGroupingId
    }
  }
}
    `;
export const CreateRelatedEnrollmentSettingDocument = gql`
    mutation CreateRelatedEnrollmentSetting($input: CreateRelatedEnrollmentSettingInput!) {
  createRelatedEnrollmentSetting(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedEnrollmentSettingDocument = gql`
    mutation UpdateRelatedEnrollmentSetting($id: ID!, $input: UpdateRelatedEnrollmentSettingInput!) {
  updateRelatedEnrollmentSetting(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListGpaConditionDocument = gql`
    query ListGpaCondition($datamanager: DatamanagerInput) {
  listGpaConditions(datamanager: $datamanager) {
    count
    results {
      id
      name
      description
      passedGpa
      insertedAt
    }
  }
}
    `;
export const ListGpaConditionDropdownDocument = gql`
    query ListGpaConditionDropdown($datamanager: DatamanagerInput) {
  listGpaConditions(datamanager: $datamanager) {
    count
    results {
      id
      name
    }
  }
}
    `;
export const EditGpaConditionDocument = gql`
    query EditGpaCondition($id: ID!) {
  editGpaCondition(id: $id) {
    id
    name
    description
    passedGpa
    gpaConditionDetails {
      id
      startCondOp
      startCondValue
      endCondOp
      endCondValue
      gradeLevelId
    }
  }
}
    `;
export const CreateRelatedGpaConditionDocument = gql`
    mutation CreateRelatedGpaCondition($input: CreateRelatedGpaConditionInput!) {
  createRelatedGpaCondition(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedGpaConditionDocument = gql`
    mutation UpdateRelatedGpaCondition($id: ID!, $input: UpdateRelatedGpaConditionInput!) {
  updateRelatedGpaCondition(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListGradeLevelDocument = gql`
    query ListGradeLevel($language: Language, $datamanager: DatamanagerInput) {
  listGradeLevels(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListGradeLevelDropdownDocument = gql`
    query ListGradeLevelDropdown($language: Language, $datamanager: DatamanagerInput) {
  listGradeLevels(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditGradeLevelDocument = gql`
    query EditGradeLevel($id: ID!) {
  editGradeLevel(id: $id) {
    id
    name
    language
    sortOrder
    gradeLevels {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedGradeLevelDocument = gql`
    mutation CreateRelatedGradeLevel($input: CreateRelatedGradeLevelInput!) {
  createRelatedGradeLevel(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedGradeLevelDocument = gql`
    mutation UpdateRelatedGradeLevel($id: ID!, $input: UpdateRelatedGradeLevelInput!) {
  updateRelatedGradeLevel(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const BatchUpdateGradeScoreDocument = gql`
    mutation BatchUpdateGradeScore($id: ID!, $input: BatchUpdateGradeScoreInput!) {
  batchUpdateGradeScore(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListGradeScoreTemplateDocument = gql`
    query ListGradeScoreTemplate($datamanager: DatamanagerInput) {
  listGradeScoreTemplates(datamanager: $datamanager) {
    count
    results {
      id
      subjectGroupingId
      subjectGrouping {
        studyYear {
          value
        }
      }
      name
      nameEn
      note
      insertedAt
    }
  }
}
    `;
export const EditGradeScoreTemplateDocument = gql`
    query EditGradeScoreTemplate($id: ID!) {
  editGradeScoreTemplate(id: $id) {
    id
    name
    nameEn
    note
    subjectGroupingId
    subjectGrouping {
      studyYearId
    }
    gradeScoreTemplateDetails {
      id
      monthsOfYearId
      type
      sortOrder
    }
  }
}
    `;
export const CreateRelatedGradeScoreTemplateDocument = gql`
    mutation CreateRelatedGradeScoreTemplate($input: CreateRelatedGradeScoreTemplateInput!) {
  createRelatedGradeScoreTemplate(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedGradeScoreTemplateDocument = gql`
    mutation UpdateRelatedGradeScoreTemplate($id: ID!, $input: UpdateRelatedGradeScoreTemplateInput!) {
  updateRelatedGradeScoreTemplate(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ExportScoreSemesterListDocument = gql`
    query ExportScoreSemesterList($gradeScoreTemplateId: ID!, $serviceDetailId: ID!, $subjectGroupingId: ID!) {
  exportScoreSemesterList(
    gradeScoreTemplateId: $gradeScoreTemplateId
    serviceDetailId: $serviceDetailId
    subjectGroupingId: $subjectGroupingId
    isActive: true
  )
}
    `;
export const ExportScoreSemesterListSummaryDocument = gql`
    query ExportScoreSemesterListSummary($gradeScoreTemplateId: ID!, $serviceDetailId: ID!, $subjectGroupingId: ID!, $format: ReportFormat) {
  exportScoreSemesterListSummary(
    gradeScoreTemplateId: $gradeScoreTemplateId
    serviceDetailId: $serviceDetailId
    subjectGroupingId: $subjectGroupingId
    format: $format
    isActive: true
  )
}
    `;
export const ExportScoreSemesterCertificateDocument = gql`
    query ExportScoreSemesterCertificate($gradeScoreTemplateId: ID!, $serviceDetailId: ID!, $subjectGroupingId: ID!) {
  exportScoreSemesterCertificate(
    gradeScoreTemplateId: $gradeScoreTemplateId
    serviceDetailId: $serviceDetailId
    subjectGroupingId: $subjectGroupingId
    isActive: true
  )
}
    `;
export const ExportScoreSemesterCertificateFormalDocument = gql`
    query ExportScoreSemesterCertificateFormal($gradeScoreTemplateId: ID!, $serviceDetailId: ID!, $subjectGroupingId: ID!) {
  exportScoreSemesterCertificateFormal(
    gradeScoreTemplateId: $gradeScoreTemplateId
    serviceDetailId: $serviceDetailId
    subjectGroupingId: $subjectGroupingId
    isActive: true
  )
}
    `;
export const ExportScoreSemesterTranscriptDocument = gql`
    query ExportScoreSemesterTranscript($gradeScoreTemplateId: ID!, $serviceDetailId: ID!, $subjectGroupingId: ID!) {
  exportScoreSemesterTranscript(
    gradeScoreTemplateId: $gradeScoreTemplateId
    serviceDetailId: $serviceDetailId
    subjectGroupingId: $subjectGroupingId
    isActive: true
  )
}
    `;
export const ExportScoreSemesterHonorListDocument = gql`
    query ExportScoreSemesterHonorList($gradeScoreTemplateId: ID!, $serviceDetailId: ID!, $subjectGroupingId: ID!) {
  exportScoreSemesterHonorList(
    gradeScoreTemplateId: $gradeScoreTemplateId
    serviceDetailId: $serviceDetailId
    subjectGroupingId: $subjectGroupingId
    isActive: true
  )
}
    `;
export const CreateUpsertImagePropertySettingDocument = gql`
    mutation CreateUpsertImagePropertySetting($input: CreateUpsertImagePropertySettingInput!) {
  createUpsertImagePropertySetting(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const EditImagePropertySettingDocument = gql`
    query EditImagePropertySetting($id: ID) {
  editImagePropertySetting(id: $id) {
    id
    useWith
    width
    height
  }
}
    `;
export const ListImagePropertySettingSettingDocument = gql`
    query ListImagePropertySettingSetting($datamanager: DatamanagerInput) {
  listImagePropertySettings(datamanager: $datamanager) {
    count
    results {
      id
      useWith
      width
      height
    }
  }
}
    `;
export const CreateUpsertInvoiceIntervalDocument = gql`
    mutation CreateUpsertInvoiceInterval($input: CreateUpsertInvoiceIntervalInput!) {
  createUpsertInvoiceInterval(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const EditInvoiceIntervalDocument = gql`
    query EditInvoiceInterval($id: ID) {
  editInvoiceInterval(id: $id) {
    id
    day
    mode
  }
}
    `;
export const ListInvoiceIntervalDocument = gql`
    query ListInvoiceInterval($datamanager: DatamanagerInput) {
  listInvoiceIntervals(datamanager: $datamanager) {
    count
    results {
      id
      day
      mode
    }
  }
}
    `;
export const AttachmentTypeTypeDocument = gql`
    query AttachmentTypeType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: ATTACHMENT_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListEnrollmentStateTypeDocument = gql`
    query ListEnrollmentStateType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: ENROLLMENT_STATE_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListExamTypeDocument = gql`
    query ListExamType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: EXAM_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListPlatformTypeDocument = gql`
    query ListPlatformType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: PLATFORM_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListAttendanceTypeDocument = gql`
    query ListAttendanceType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: ATTENDANCE_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedBlogCompartmentTypeDocument = gql`
    query ListLocalizedBlogCompartmentType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [BLOG_COMPARTMENT_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedParentTypeDocument = gql`
    query ListLocalizedParentType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [PARENT_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedJobTypeDocument = gql`
    query ListLocalizedJobType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [JOB_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedBlogCategoryTypeDocument = gql`
    query ListLocalizedBlogCategoryType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [BLOG_CATEGORY_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedAddressTypeDocument = gql`
    query ListLocalizedAddressType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [ADDRESS_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedServiceLogTypeDocument = gql`
    query ListLocalizedServiceLogType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [STUDENT_SERVICE_LOG_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedShiftTypeDocument = gql`
    query ListLocalizedShiftType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [SHIFT_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedContactTypeDocument = gql`
    query ListLocalizedContactType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [CONTACT_TYPE]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedS3BucketFolderTypeDocument = gql`
    query ListLocalizedS3BucketFolderType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {in: [PKS_NAS]}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedS3BucketTypeDocument = gql`
    query ListLocalizedS3BucketType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: S3_BUCKET_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedTypeDocument = gql`
    query ListLocalizedType($datamanager: DatamanagerInput) {
  listLocalizedType(datamanager: $datamanager) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedGenderTypeDocument = gql`
    query ListLocalizedGenderType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: GENDER_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListTimetableEmployeeTypeDocument = gql`
    query ListTimetableEmployeeType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: TIMETABLE_EMPLOYEE_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedEmployeeRoleTypeDocument = gql`
    query ListLocalizedEmployeeRoleType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: EMPLOYEE_ROLE_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedServiceTypesDocument = gql`
    query ListLocalizedServiceTypes($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: SERVICE_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedCurrencySymbolTypesDocument = gql`
    query ListLocalizedCurrencySymbolTypes($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: CURRENCY_SYMBOL_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedImagePropertySettingUseWithTypeDocument = gql`
    query ListLocalizedImagePropertySettingUseWithType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: IMAGE_PROPERTY_USE_WITH_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const ListLocalizedIntervalModeTypeDocument = gql`
    query ListLocalizedIntervalModeType($datamanager: DatamanagerInput) {
  listLocalizedType(
    datamanager: $datamanager
    filter: {namespace: {eq: INTERVAL_MODE_TYPE}}
  ) {
    count
    results {
      id
      valueUpper
      text
    }
  }
}
    `;
export const UriToPresignedUrlDocument = gql`
    query UriToPresignedUrl($uri: String!) {
  uriToPresignedUrl(uri: $uri)
}
    `;
export const ListMenusDocument = gql`
    query ListMenus($datamanager: DatamanagerInput) {
  listMenus(datamanager: $datamanager) {
    count
    results {
      id
      gettextId
    }
  }
}
    `;
export const CreateRelatedUpsertMenuDocument = gql`
    mutation CreateRelatedUpsertMenu($input: CreateRelatedUpsertMenuInput!) {
  createRelatedUpsertMenu(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const ListRootMenuDocument = gql`
    query ListRootMenu {
  listRootMenus {
    ...Menu
    menus(sort: [{field: POSITION, order: ASC}]) {
      ...Menu
      menus(sort: [{field: POSITION, order: ASC}]) {
        ...Menu
      }
    }
  }
}
    ${Menu}
${ActiveMenuPath}`;
export const ListMonthsOfYearDocument = gql`
    query ListMonthsOfYear($language: Language, $datamanager: DatamanagerInput) {
  listMonthsOfYears(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListMonthsOfYearDropdownDocument = gql`
    query ListMonthsOfYearDropdown($language: Language, $datamanager: DatamanagerInput) {
  listMonthsOfYears(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditMonthsOfYearDocument = gql`
    query EditMonthsOfYear($id: ID!) {
  editMonthsOfYear(id: $id) {
    id
    name
    language
    sortOrder
    monthsOfYears {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedMonthsOfYearDocument = gql`
    mutation CreateRelatedMonthsOfYear($input: CreateRelatedMonthsOfYearInput!) {
  createRelatedMonthsOfYear(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedMonthsOfYearDocument = gql`
    mutation UpdateRelatedMonthsOfYear($id: ID!, $input: UpdateRelatedMonthsOfYearInput!) {
  updateRelatedMonthsOfYear(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListParentDropdownDocument = gql`
    query ListParentDropdown($datamanager: DatamanagerInput) {
  listParents(datamanager: $datamanager) {
    count
    results {
      id
      nameCalc
    }
  }
}
    `;
export const CreateUpsertParentDocument = gql`
    mutation CreateUpsertParent($input: CreateUpsertParentInput!) {
  createUpsertParent(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListParentDocument = gql`
    query ListParent($datamanager: DatamanagerInput) {
  listParents(datamanager: $datamanager) {
    count
    results {
      id
      name
      latin
      job
      tel
      localizedType
      localizedJob
      insertedAt
    }
  }
}
    `;
export const EditParentDocument = gql`
    query EditParent($id: ID!) {
  editParent(id: $id) {
    id
    name
    latin
    type
    job
    tel
    studentServices {
      id
      studyYear {
        nameLocalized
      }
      serviceName {
        nameLocalized
      }
      student {
        id
        name
        latin
        i18nGender {
          nameLocalized
        }
        s3ProfileUri
      }
    }
  }
}
    `;
export const GeneratePermissionsDocument = gql`
    mutation GeneratePermissions {
  generatePermissions
}
    `;
export const ListPermissionDropdownDocument = gql`
    query ListPermissionDropdown($datamanager: DatamanagerInput) {
  listPermissions(datamanager: $datamanager) {
    count
    results {
      id
      fullPermission
    }
  }
}
    `;
export const ListPermissionDocument = gql`
    query ListPermission($datamanager: DatamanagerInput) {
  listPermissions(datamanager: $datamanager) {
    count
    results {
      id
      resource
      action
      actionGroup
      description
      docPage
    }
  }
}
    `;
export const ListProvinceDocument = gql`
    query ListProvince($datamanager: DatamanagerInput) {
  listProvinces(datamanager: $datamanager) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListProvinceDropdownDocument = gql`
    query ListProvinceDropdown($datamanager: DatamanagerInput) {
  listProvinces(datamanager: $datamanager) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditProvinceDocument = gql`
    query EditProvince($id: ID!) {
  editProvince(id: $id) {
    id
    name
    language
    provinces {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedProvinceDocument = gql`
    mutation CreateRelatedProvince($input: CreateRelatedProvinceInput!) {
  createRelatedProvince(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedProvinceDocument = gql`
    mutation UpdateRelatedProvince($id: ID!, $input: UpdateRelatedProvinceInput!) {
  updateRelatedProvince(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListRegisterReasonDocument = gql`
    query ListRegisterReason($datamanager: DatamanagerInput) {
  listRegisterReasons(datamanager: $datamanager) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListRegisterReasonDropdownDocument = gql`
    query ListRegisterReasonDropdown($datamanager: DatamanagerInput) {
  listRegisterReasons(datamanager: $datamanager) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditRegisterReasonDocument = gql`
    query EditRegisterReason($id: ID!) {
  editRegisterReason(id: $id) {
    id
    name
    language
    registerReasons {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedRegisterReasonDocument = gql`
    mutation CreateRelatedRegisterReason($input: CreateRelatedRegisterReasonInput!) {
  createRelatedRegisterReason(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedRegisterReasonDocument = gql`
    mutation UpdateRelatedRegisterReason($id: ID!, $input: UpdateRelatedRegisterReasonInput!) {
  updateRelatedRegisterReason(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListRelativeDocument = gql`
    query ListRelative($language: Language, $datamanager: DatamanagerInput) {
  listRelatives(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListRelativeDropdownDocument = gql`
    query ListRelativeDropdown($language: Language, $datamanager: DatamanagerInput) {
  listRelatives(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditRelativeDocument = gql`
    query EditRelative($id: ID!) {
  editRelative(id: $id) {
    id
    name
    language
    sortOrder
    relatives {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedRelativeDocument = gql`
    mutation CreateRelatedRelative($input: CreateRelatedRelativeInput!) {
  createRelatedRelative(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedRelativeDocument = gql`
    mutation UpdateRelatedRelative($id: ID!, $input: UpdateRelatedRelativeInput!) {
  updateRelatedRelative(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const CreateRelatedUpsertRoleDocument = gql`
    mutation CreateRelatedUpsertRole($input: CreateRelatedUpsertRoleInput!) {
  createRelatedUpsertRole(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListRoleDropdownDocument = gql`
    query ListRoleDropdown($datamanager: DatamanagerInput) {
  listRoles(datamanager: $datamanager) {
    count
    results {
      id
      name
    }
  }
}
    `;
export const ListRoleDocument = gql`
    query ListRole($datamanager: DatamanagerInput) {
  listRoles(datamanager: $datamanager) {
    count
    results {
      id
      name
      description
    }
  }
}
    `;
export const EditRoleDocument = gql`
    query EditRole($id: ID!) {
  editRole(id: $id) {
    id
    name
    description
    rolePermissions {
      id
      permissionId
    }
  }
}
    `;
export const ListScoreTypeDocument = gql`
    query ListScoreType($language: Language, $datamanager: DatamanagerInput) {
  listScoreTypes(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListScoreTypeDropdownDocument = gql`
    query ListScoreTypeDropdown($language: Language, $datamanager: DatamanagerInput) {
  listScoreTypes(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditScoreTypeDocument = gql`
    query EditScoreType($id: ID!) {
  editScoreType(id: $id) {
    id
    name
    language
    sortOrder
    scoreTypes {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedScoreTypeDocument = gql`
    mutation CreateRelatedScoreType($input: CreateRelatedScoreTypeInput!) {
  createRelatedScoreType(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedScoreTypeDocument = gql`
    mutation UpdateRelatedScoreType($id: ID!, $input: UpdateRelatedScoreTypeInput!) {
  updateRelatedScoreType(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const CreateRelatedUpsertServiceDocument = gql`
    mutation CreateRelatedUpsertService($input: CreateRelatedUpsertServiceInput!) {
  createRelatedUpsertService(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const EditServiceDocument = gql`
    query EditService($id: ID) {
  editService(id: $id) {
    id
    name
    description
    beginsAt
    endsAt
    type
    studyYearId
    serviceDetails {
      id
      serviceNameId
    }
    serviceFees {
      id
      monthRepeat
      price
      fixedDiscount
    }
  }
}
    `;
export const ListServiceSettingDocument = gql`
    query ListServiceSetting($datamanager: DatamanagerInput) {
  listServices(datamanager: $datamanager) {
    count
    results {
      ...ServiceSetting
    }
  }
}
    ${ServiceSetting}`;
export const ListServiceNameSettingDocument = gql`
    query ListServiceNameSetting($language: Language, $datamanager: DatamanagerInput) {
  listServiceNames(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const ListServiceDropdownDocument = gql`
    query ListServiceDropdown($datamanager: DatamanagerInput) {
  listServices(datamanager: $datamanager) {
    count
    results {
      id
      name
    }
  }
}
    `;
export const ListServiceDetailDropdownDocument = gql`
    query ListServiceDetailDropdown($datamanager: DatamanagerInput) {
  listServiceDetails(datamanager: $datamanager) {
    count
    results {
      id
      serviceNameCalc
    }
  }
}
    `;
export const ExportBioCheckListDocument = gql`
    query ExportBioCheckList($studyYearId: ID!, $serviceDetailIds: [ID!]!, $studentServiceIds: [ID!]!) {
  exportBioCheckList(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    studentServiceIds: $studentServiceIds
  )
}
    `;
export const ListServiceNameDocument = gql`
    query ListServiceName($datamanager: DatamanagerInput) {
  listServiceNames(datamanager: $datamanager) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListServiceNameDropdownDocument = gql`
    query ListServiceNameDropdown($datamanager: DatamanagerInput) {
  listServiceNames(datamanager: $datamanager) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditServiceNameDocument = gql`
    query EditServiceName($id: ID!) {
  editServiceName(id: $id) {
    id
    name
    language
    serviceNames {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedServiceNameDocument = gql`
    mutation CreateRelatedServiceName($input: CreateRelatedServiceNameInput!) {
  createRelatedServiceName(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedServiceNameDocument = gql`
    mutation UpdateRelatedServiceName($id: ID!, $input: UpdateRelatedServiceNameInput!) {
  updateRelatedServiceName(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListServiceTypeDocument = gql`
    query ListServiceType($datamanager: DatamanagerInput) {
  listServiceTypes(datamanager: $datamanager) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListServiceTypeDropdownDocument = gql`
    query ListServiceTypeDropdown($datamanager: DatamanagerInput) {
  listServiceTypes(datamanager: $datamanager) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditServiceTypeDocument = gql`
    query EditServiceType($id: ID!) {
  editServiceType(id: $id) {
    id
    name
    language
    serviceTypes {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedServiceTypeDocument = gql`
    mutation CreateRelatedServiceType($input: CreateRelatedServiceTypeInput!) {
  createRelatedServiceType(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedServiceTypeDocument = gql`
    mutation UpdateRelatedServiceType($id: ID!, $input: UpdateRelatedServiceTypeInput!) {
  updateRelatedServiceType(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListStudentServiceDropdownDocument = gql`
    query ListStudentServiceDropdown($datamanager: DatamanagerInput) {
  listStudentServices(datamanager: $datamanager) {
    count
    results {
      id
      withStudentCalc
    }
  }
}
    `;
export const ListStudentServiceByStudentDocument = gql`
    query ListStudentServiceByStudent($studentId: ID!, $datamanager: DatamanagerInput) {
  listStudentServices(
    datamanager: $datamanager
    filter: {studentId: {eq: $studentId}}
  ) {
    count
    results {
      id
      subjectGrouping {
        id
      }
      serviceDetailId
      studyYearLocalized {
        name
      }
      serviceName {
        nameLocalized
      }
      transferCalc
      serviceTypeLocalized {
        name
      }
      note
      localizedShiftType
      isActive
    }
  }
}
    `;
export const ListStudentDropdownDocument = gql`
    query ListStudentDropdown($datamanager: DatamanagerInput) {
  listStudents(datamanager: $datamanager) {
    count
    results {
      id
      nameCalc
    }
  }
}
    `;
export const EditStudentDocument = gql`
    query EditStudent($id: ID!) {
  editStudent(id: $id) {
    id
    bookId
    name
    latin
    gender
    dob
    tel
    contacts {
      id
      type
      value
    }
    studentRelatives {
      id
      relatedStudentId
      relativeId
    }
    studentParents {
      id
      parentId
    }
    studentAddresses {
      id
      villageId
      studyYearId
      type
    }
    studentImages {
      id
      uri
    }
  }
}
    `;
export const CreateRelatedStudentDocument = gql`
    mutation CreateRelatedStudent($input: CreateRelatedStudentInput!) {
  createRelatedStudent(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedStudentDocument = gql`
    mutation UpdateRelatedStudent($id: ID!, $input: UpdateRelatedStudentInput!) {
  updateRelatedStudent(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListStudentDocument = gql`
    query ListStudent($datamanager: DatamanagerInput) {
  listStudents(datamanager: $datamanager) {
    count
    results {
      id
      bookId
      name
      latin
      localizedGender
      studentImage {
        uri
      }
      dob
      tel
    }
  }
}
    `;
export const ListStudentParentsByStudentDocument = gql`
    query ListStudentParentsByStudent($studentId: ID!) {
  listStudentParentsByStudent(studentId: $studentId) {
    id
    studentId
    parentId
  }
}
    `;
export const ListStudentParentDropdownDocument = gql`
    query ListStudentParentDropdown($datamanager: DatamanagerInput) {
  listStudentParents(datamanager: $datamanager) {
    count
    results {
      id
      parent {
        nameLocalized
      }
    }
  }
}
    `;
export const ListStudentNoteDocument = gql`
    query ListStudentNote($datamanager: DatamanagerInput) {
  listStudentNotes(datamanager: $datamanager) {
    count
    results {
      id
      title
      noteAt
      insertedAt
    }
  }
}
    `;
export const EditStudentNoteDocument = gql`
    query EditStudentNote($id: ID!) {
  editStudentNote(id: $id) {
    id
    title
    note
    noteAt
    attachments {
      id
      bucket
      key
      type
      namespace
    }
    studentNoteStudentServices {
      id
      studentServiceId
    }
    studentNoteStudentParents {
      id
      studentParentId
    }
    studentNoteEmployees {
      id
      employeeId
    }
  }
}
    `;
export const CreateRelatedStudentNoteDocument = gql`
    mutation CreateRelatedStudentNote($input: CreateRelatedStudentNoteInput!) {
  createRelatedStudentNote(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedStudentNoteDocument = gql`
    mutation UpdateRelatedStudentNote($id: ID!, $input: UpdateRelatedStudentNoteInput!) {
  updateRelatedStudentNote(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListStudentNoteReportDocument = gql`
    query ListStudentNoteReport($datamanager: DatamanagerInput, $startDate: Date, $endDate: Date) {
  listStudentNoteReport(
    datamanager: $datamanager
    startDate: $startDate
    endDate: $endDate
  ) {
    count
    results {
      id
      studyYear {
        nameLocalized
      }
      serviceName {
        nameLocalized
      }
      student {
        name
        latin
        i18nGender {
          nameLocalized
        }
        s3ProfileUri
      }
      studentNotePerformanceImprovementLetter
      studentNoteWarningLetter
      studentNoteContract
      studentNoteOther
    }
  }
}
    `;
export const GetStudentNoteReportDocument = gql`
    query GetStudentNoteReport($id: ID!, $startDate: Date, $endDate: Date) {
  getStudentNoteReport(id: $id, startDate: $startDate, endDate: $endDate) {
    id
    studyYear {
      nameLocalized
    }
    serviceName {
      nameLocalized
    }
    student {
      name
      latin
      i18nGender {
        nameLocalized
      }
      s3ProfileUri
    }
    studentNotePerformanceImprovementLetter
    studentNoteWarningLetter
    studentNoteContract
    studentNoteOther
    attachments {
      id
      studentNote {
        id
        title
      }
      uri
      typeNameLocalized
    }
  }
}
    `;
export const EditStudentServiceDocument = gql`
    query EditStudentService($id: ID!) {
  editStudentService(id: $id) {
    id
    isActive
    studentId
    studyYearId
    subjectGrouping {
      id
    }
    serviceDetail {
      serviceId
    }
    serviceDetailId
    serviceTypeId
    shiftType
    note
    allowEdit
  }
}
    `;
export const StudentServiceFillEnrollmentDraftDocument = gql`
    query StudentServiceFillEnrollmentDraft($studentServiceId: ID!) {
  studentServiceFillEnrollmentDraft(studentServiceId: $studentServiceId) {
    students {
      id
      name
      latin
      dob
      gender
      tel
      email
      facebook
      lineId
      nameEditable
      latinEditable
      dobEditable
      genderEditable
      telEditable
      emailEditable
      facebookEditable
      lineIdEditable
    }
    addresses {
      id
      type
      villageId
      villageIdEditable
    }
    parents {
      id
      job
      latin
      name
      tel
      type
      nameEditable
      latinEditable
      jobEditable
      telEditable
      typeEditable
    }
  }
}
    `;
export const CreateUpsertStudentServiceDocument = gql`
    mutation CreateUpsertStudentService($input: CreateUpsertStudentServiceInput!) {
  createUpsertStudentService(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListStudentServiceDocument = gql`
    query ListStudentService($datamanager: DatamanagerInput) {
  listStudentServices(datamanager: $datamanager) {
    count
    results {
      id
      subjectGrouping {
        id
      }
      isActive
      serviceDetailId
      studyYearLocalized {
        name
      }
      serviceTypeLocalized {
        name
      }
      serviceName {
        nameLocalized
      }
      student {
        id
        name
        latin
        gender
        localizedGender
        studentImage {
          uri
        }
        dob
        tel
      }
    }
  }
}
    `;
export const StudentServiceExportStudentProfileDocument = gql`
    query StudentServiceExportStudentProfile($serviceDetailIds: [ID!]!, $studentServiceIds: [ID!]!) {
  studentServiceExportStudentProfile(
    serviceDetailIds: $serviceDetailIds
    studentServiceIds: $studentServiceIds
  )
}
    `;
export const ListStudentServiceWithScoreDocument = gql`
    query ListStudentServiceWithScore($subjectGroupingId: ID!, $serviceDetailIds: [ID!]!, $subjectGroupingDetailIds: [ID!]!, $monthsOfYearId: ID!) {
  listStudentServiceWithScore(
    subjectGroupingId: $subjectGroupingId
    serviceDetailIds: $serviceDetailIds
    subjectGroupingDetailIds: $subjectGroupingDetailIds
    monthsOfYearId: $monthsOfYearId
    withPreparation: true
  ) {
    count
    results {
      id
      newTotalScore
      newGpa
      newRank
      student {
        name
        latin
        s3ProfileUri
      }
      scores {
        id
        score
        maxScore
        fullSubjectCalc
      }
    }
  }
}
    `;
export const CreateStudentServiceTransferDocument = gql`
    mutation CreateStudentServiceTransfer($input: CreateStudentServiceTransferInput!) {
  createStudentServiceTransfer(input: $input) {
    id
  }
}
    `;
export const BatchUpgradeStudentServiceDocument = gql`
    mutation BatchUpgradeStudentService($input: BatchUpgradeStudentServiceInput!) {
  batchUpgradeStudentService(input: $input)
}
    `;
export const ExportNewStudentListDocument = gql`
    query ExportNewStudentList($serviceDetailIds: [ID!]!, $studentServiceIds: [ID!]!) {
  exportNewStudentList(
    isActive: true
    serviceDetailIds: $serviceDetailIds
    studentServiceIds: $studentServiceIds
  )
}
    `;
export const EditStudentServiceLogDocument = gql`
    query EditStudentServiceLog($id: ID!) {
  editStudentServiceLog(id: $id) {
    id
    studentServiceId
    date
    type
    reasons {
      id
      dropReasonId
      registerReasonId
    }
  }
}
    `;
export const CreateRelatedUpsertStudentServiceLogDocument = gql`
    mutation CreateRelatedUpsertStudentServiceLog($input: CreateRelatedUpsertStudentServiceLogInput!) {
  createRelatedUpsertStudentServiceLog(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListStudentServiceLogDocument = gql`
    query ListStudentServiceLog($datamanager: DatamanagerInput, $studentServiceId: ID!) {
  listStudentServiceLogs(
    datamanager: $datamanager
    filter: {studentServiceId: {eq: $studentServiceId}}
  ) {
    count
    results {
      id
      date
      typeValue
      calcName
    }
  }
}
    `;
export const ListStudyYearDocument = gql`
    query ListStudyYear($language: Language, $datamanager: DatamanagerInput) {
  listStudyYears(datamanager: $datamanager, language: $language) {
    count
    results {
      id
      beginsAt
      endsAt
      value
      insertedAt
    }
  }
}
    `;
export const ListStudyYearDropdownDocument = gql`
    query ListStudyYearDropdown($datamanager: DatamanagerInput) {
  listStudyYears(datamanager: $datamanager) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditStudyYearDocument = gql`
    query EditStudyYear($id: ID!) {
  editStudyYear(id: $id) {
    id
    name
    language
    beginsAt
    endsAt
    studyYears {
      id
      name
      language
      languageValue
      beginsAt
      endsAt
    }
  }
}
    `;
export const CreateRelatedStudyYearDocument = gql`
    mutation CreateRelatedStudyYear($input: CreateRelatedStudyYearInput!) {
  createRelatedStudyYear(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedStudyYearDocument = gql`
    mutation UpdateRelatedStudyYear($id: ID!, $input: UpdateRelatedStudyYearInput!) {
  updateRelatedStudyYear(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ExportStudentCardSixSixByNineSevenMmDocument = gql`
    query ExportStudentCardSixSixByNineSevenMm($studyYearId: ID!, $serviceDetailIds: [ID!]!, $studentIds: [ID!]!) {
  exportStudentCardSixSixByNineSevenMm(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    studentIds: $studentIds
  )
}
    `;
export const ExportStudentCardFiveFourByEightyFiveMmDocument = gql`
    query ExportStudentCardFiveFourByEightyFiveMm($studyYearId: ID!, $serviceDetailIds: [ID!]!, $studentIds: [ID!]!) {
  exportStudentCardFiveFourByEightyFiveMm(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    studentIds: $studentIds
  )
}
    `;
export const ExportNewStudentInfoDocument = gql`
    query ExportNewStudentInfo($studyYearId: ID!, $serviceDetailIds: [ID!]!, $studentIds: [ID!]!) {
  exportNewStudentInfo(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    studentIds: $studentIds
  )
}
    `;
export const ExportCertificateOfEducationDocument = gql`
    query ExportCertificateOfEducation($studyYearId: ID!, $serviceDetailIds: [ID!]!, $studentServiceIds: [ID!]!) {
  exportCertificateOfEducation(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    studentServiceIds: $studentServiceIds
  )
}
    `;
export const ListSubjectDocument = gql`
    query ListSubject($datamanager: DatamanagerInput) {
  listSubjects(datamanager: $datamanager) {
    count
    results {
      id
      value
      insertedAt
    }
  }
}
    `;
export const ListSubjectDropdownDocument = gql`
    query ListSubjectDropdown($datamanager: DatamanagerInput) {
  listSubjects(datamanager: $datamanager) {
    count
    results {
      id
      value
    }
  }
}
    `;
export const EditSubjectDocument = gql`
    query EditSubject($id: ID!) {
  editSubject(id: $id) {
    id
    name
    language
    sortOrder
    subjects {
      id
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedSubjectDocument = gql`
    mutation CreateRelatedSubject($input: CreateRelatedSubjectInput!) {
  createRelatedSubject(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedSubjectDocument = gql`
    mutation UpdateRelatedSubject($id: ID!, $input: UpdateRelatedSubjectInput!) {
  updateRelatedSubject(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListSubjectGroupingDropdownDocument = gql`
    query ListSubjectGroupingDropdown($datamanager: DatamanagerInput) {
  listSubjectGroupings(datamanager: $datamanager) {
    count
    results {
      id
      nameCalc
    }
  }
}
    `;
export const ListSubjectGroupingServiceDetailDropdownDocument = gql`
    query ListSubjectGroupingServiceDetailDropdown($datamanager: DatamanagerInput) {
  listSubjectGroupingServiceDetails(datamanager: $datamanager) {
    count
    results {
      id
      serviceDetailId
      serviceNameCalc
    }
  }
}
    `;
export const ListSubjectGroupingDetailDropdownDocument = gql`
    query ListSubjectGroupingDetailDropdown($datamanager: DatamanagerInput) {
  listSubjectGroupingDetails(datamanager: $datamanager) {
    count
    results {
      id
      fullSubjectCalc
    }
  }
}
    `;
export const ListSubjectGroupingDocument = gql`
    query ListSubjectGrouping($datamanager: DatamanagerInput) {
  listSubjectGroupings(datamanager: $datamanager) {
    count
    results {
      id
      note
      gpa
      studyYearId
      studyYear {
        value
      }
      insertedAt
    }
  }
}
    `;
export const EditSubjectGroupingDocument = gql`
    query EditSubjectGrouping($id: ID!) {
  editSubjectGrouping(id: $id) {
    id
    studyYearId
    gpaConditionId
    gpa
    note
    subjectGroupingServiceDetails {
      id
      studyYearId
      serviceDetail {
        serviceId
      }
      serviceDetailId
    }
    subjectGroupingDetails {
      id
      subjectId
      scoreTypeId
      maxScore
      sortOrder
    }
  }
}
    `;
export const CreateRelatedSubjectGroupingDocument = gql`
    mutation CreateRelatedSubjectGrouping($input: CreateRelatedSubjectGroupingInput!) {
  createRelatedSubjectGrouping(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedSubjectGroupingDocument = gql`
    mutation UpdateRelatedSubjectGrouping($id: ID!, $input: UpdateRelatedSubjectGroupingInput!) {
  updateRelatedSubjectGrouping(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ExportScoreMonthlyCertificateDocument = gql`
    query ExportScoreMonthlyCertificate($studyYearId: ID!, $serviceDetailIds: [ID!]!, $monthsOfYearId: ID!, $subjectGroupingId: ID!) {
  exportScoreMonthlyCertificate(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    monthsOfYearId: $monthsOfYearId
    subjectGroupingId: $subjectGroupingId
  )
}
    `;
export const ExportScoreMonthlyTranscriptDocument = gql`
    query ExportScoreMonthlyTranscript($studyYearId: ID!, $serviceDetailIds: [ID!]!, $monthsOfYearId: ID!, $subjectGroupingId: ID!) {
  exportScoreMonthlyTranscript(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    monthsOfYearId: $monthsOfYearId
    subjectGroupingId: $subjectGroupingId
  )
}
    `;
export const ExportScoreMonthlyRankingTableDocument = gql`
    query ExportScoreMonthlyRankingTable($studyYearId: ID!, $serviceDetailIds: [ID!]!, $monthsOfYearId: ID!, $format: ReportFormat, $subjectGroupingId: ID!) {
  exportScoreMonthlyRankingTable(
    isActive: true
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    monthsOfYearId: $monthsOfYearId
    format: $format
    subjectGroupingId: $subjectGroupingId
  )
}
    `;
export const ExportScoreMonthlyCheckListDocument = gql`
    query ExportScoreMonthlyCheckList($subjectGroupingId: ID!, $studyYearId: ID!, $serviceDetailIds: [ID!]!, $monthsOfYearId: ID!) {
  exportScoreMonthlyCheckList(
    isActive: true
    subjectGroupingId: $subjectGroupingId
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    monthsOfYearId: $monthsOfYearId
  )
}
    `;
export const ExportScoreMonthlyCheckListTemplateDocument = gql`
    query ExportScoreMonthlyCheckListTemplate($subjectGroupingId: ID!, $studyYearId: ID!, $serviceDetailIds: [ID!]!, $monthsOfYearId: ID!) {
  exportScoreMonthlyCheckListTemplate(
    isActive: true
    subjectGroupingId: $subjectGroupingId
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    monthsOfYearId: $monthsOfYearId
  )
}
    `;
export const ExportScoreMonthlyHonorListDocument = gql`
    query ExportScoreMonthlyHonorList($subjectGroupingId: ID!, $studyYearId: ID!, $serviceDetailIds: [ID!]!, $monthsOfYearId: ID!) {
  exportScoreMonthlyHonorList(
    isActive: true
    subjectGroupingId: $subjectGroupingId
    studyYearId: $studyYearId
    serviceDetailIds: $serviceDetailIds
    monthsOfYearId: $monthsOfYearId
  )
}
    `;
export const CreateUpsertSubscriptionIntervalDocument = gql`
    mutation CreateUpsertSubscriptionInterval($input: CreateUpsertSubscriptionIntervalInput!) {
  createUpsertSubscriptionInterval(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const EditSubscriptionIntervalDocument = gql`
    query EditSubscriptionInterval($id: ID) {
  editSubscriptionInterval(id: $id) {
    id
    day
    mode
  }
}
    `;
export const ListSubscriptionIntervalDocument = gql`
    query ListSubscriptionInterval($datamanager: DatamanagerInput) {
  listSubscriptionIntervals(datamanager: $datamanager) {
    count
    results {
      id
      day
      mode
    }
  }
}
    `;
export const GetTimetableAsTableDocument = gql`
    query GetTimetableAsTable($subjectGroupingId: ID!, $serviceDetailId: ID!) {
  getTimetableAsTable(
    subjectGroupingId: $subjectGroupingId
    serviceDetailId: $serviceDetailId
  ) {
    id
    subjectGroupingId
    serviceDetailId
    headers {
      id
      value
    }
    times {
      id
      startTime
      endTime
      days {
        id
        subjectGroupingId
        subjectGroupingDetailId
        serviceDetailId
        daysOfWeekId
        daysOfWeekSortOrder
        startTime
        endTime
        subjectCalc
      }
    }
  }
}
    `;
export const BulkCreateUpsertTimetableDocument = gql`
    mutation BulkCreateUpsertTimetable($input: BulkCreateUpsertTimetableInput!) {
  bulkCreateUpsertTimetable(input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const ListTimetableEmployeDocument = gql`
    query ListTimetableEmploye($datamanager: DatamanagerInput) {
  listTimetableEmployees(datamanager: $datamanager) {
    count
    results {
      id
      subjectGroupingDetailId
      type
      localizedType
      startDate
      endDate
      employee {
        id
        name
        latin
        gender
        localizedGender
        dob
        tel
        type
        localizedType
      }
    }
  }
}
    `;
export const ListTimetableSubjectDropdownDocument = gql`
    query ListTimetableSubjectDropdown($datamanager: DatamanagerInput) {
  listTimetables(datamanager: $datamanager) {
    count
    results {
      id
      fullSubjectCalc
    }
  }
}
    `;
export const ListTimetablesForEmployeeDocument = gql`
    query ListTimetablesForEmployee($id: ID!, $dayOfWeek: Int!) {
  listTimetables(
    filter: {daysOfWeekSortOrder: {eq: $dayOfWeek}, timetableEmployees: {employeeId: {eq: $id}}}
  ) {
    count
    results {
      id
      serviceNameCalc
      daysOfWeekSortOrder
      subjectCalc
      startTime
      endTime
    }
  }
}
    `;
export const CreateRelatedUpsertTimetableEmployeeDocument = gql`
    mutation CreateRelatedUpsertTimetableEmployee($input: CreateRelatedUpsertTimetableEmployeeInput!) {
  createRelatedUpsertTimetableEmployee(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListTimetableEmployeeDocument = gql`
    query ListTimetableEmployee($datamanager: DatamanagerInput) {
  listTimetableEmployees(datamanager: $datamanager) {
    count
    results {
      id
      subjectGroupingDetailId
      localizedType
      startDate
      endDate
      employee {
        id
        name
        latin
        localizedGender
        tel
        localizedType
      }
      insertedAt
    }
  }
}
    `;
export const EditTimetableEmployeeDocument = gql`
    query EditTimetableEmployee($id: ID!) {
  editTimetableEmployee(id: $id) {
    id
    timetableEmployeeTimetables {
      id
      timetableId
    }
    employeeId
    type
    startDate
    endDate
  }
}
    `;
export const SignInDocument = gql`
    mutation SignIn($accessToken: String!) {
  signIn(input: {accessToken: $accessToken}) {
    errors {
      message
      fields
    }
    result {
      id
      profile
      emailOrPhone
      bucket
      bucketFolder
      telegramChatId
      employeeId
      active
      superUser
      currentStudyYearId
    }
  }
}
    `;
export const GetAuthenticatedDocument = gql`
    query GetAuthenticated($accessToken: String!) {
  getAuthenticated(accessToken: $accessToken) {
    id
    profile
    emailOrPhone
    bucket
    bucketFolder
    telegramChatId
    employeeId
    active
    superUser
    currentStudyYearId
  }
}
    `;
export const UpdateRelatedUserDocument = gql`
    mutation UpdateRelatedUser($id: ID!, $input: UpdateRelatedUserInput!) {
  updateRelatedUser(id: $id, input: $input) {
    errors {
      fields
      message
    }
    result {
      id
    }
  }
}
    `;
export const EditUserDocument = gql`
    query EditUser($id: String!) {
  editUser(id: $id) {
    id
    emailOrPhone
    active
    superUser
    fullName
    employeeId
    studentId
    bucket
    bucketFolder
    userRoles {
      id
      isDefault
      roleId
    }
  }
}
    `;
export const ListUserDocument = gql`
    query ListUser($datamanager: DatamanagerInput) {
  listUsers(datamanager: $datamanager) {
    count
    results {
      id
      fullName
      emailOrPhone
      bucket
      bucketFolder
      superUser
      active
      picture
      employee {
        employeeCalc
      }
    }
  }
}
    `;
export const CurrentUserDatetimeDocument = gql`
    query CurrentUserDatetime {
  currentUserDatetime
}
    `;
export const CreateUpsertVersionDocument = gql`
    mutation CreateUpsertVersion($input: CreateUpsertVersionInput!) {
  createUpsertVersion(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListVersionDocument = gql`
    query ListVersion($datamanager: DatamanagerInput) {
  listVersions(datamanager: $datamanager) {
    count
    results {
      id
      draft
      localizedPlatform
      appName
      version
      released
      insertedAt
    }
  }
}
    `;
export const EditVersionDocument = gql`
    query EditVersion($id: ID!) {
  editVersion(id: $id) {
    id
    draft
    platform
    appName
    version
    released
    changes
  }
}
    `;
export const ListVillageDocument = gql`
    query ListVillage($datamanager: DatamanagerInput) {
  listVillages(datamanager: $datamanager) {
    count
    results {
      id
      value
      commune {
        value
        district {
          value
          province {
            value
          }
        }
      }
      insertedAt
    }
  }
}
    `;
export const ListVillageDropdownDocument = gql`
    query ListVillageDropdown($datamanager: DatamanagerInput) {
  listVillages(datamanager: $datamanager) {
    count
    results {
      id
      value
      addressName
    }
  }
}
    `;
export const EditVillageDocument = gql`
    query EditVillage($id: ID!) {
  editVillage(id: $id) {
    id
    communeId
    name
    language
    villages {
      id
      communeId
      name
      language
      languageValue
    }
  }
}
    `;
export const CreateRelatedVillageDocument = gql`
    mutation CreateRelatedVillage($input: CreateRelatedVillageInput!) {
  createRelatedVillage(input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const UpdateRelatedVillageDocument = gql`
    mutation UpdateRelatedVillage($id: ID!, $input: UpdateRelatedVillageInput!) {
  updateRelatedVillage(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const ListStudentServiceWithAttendanceDocument = gql`
    query ListStudentServiceWithAttendance($timetableId: ID!, $filterDate: Date!) {
  listStudentServiceWithAttendance(
    timetableId: $timetableId
    filterDate: $filterDate
  ) {
    results {
      id
      student {
        id
        s3ProfileUri
        name
        latin
        localizedGender
      }
      attendance {
        id
        timetableId
        studentServiceId
        datetime
        isAbsent
        type
        lateTime
        note
        draftAt
        checked
      }
    }
  }
}
    `;
export const ReadStudentAttendanceWithGenerateDocument = gql`
    query ReadStudentAttendanceWithGenerate($startDate: Date!, $endDate: Date!, $timetableIds: [ID!]!, $studentServiceIds: [ID!]!) {
  readStudentAttendanceWithGenerate(
    startDate: $startDate
    endDate: $endDate
    timetableIds: $timetableIds
    studentServiceIds: $studentServiceIds
  ) {
    id
    timetableId
    studentServiceId
    datetime
    isAbsent
    type
    lateTime
    note
    attachments {
      id
      bucket
      key
      note
    }
    draftAt
    checked
    student {
      id
      s3ProfileUri
      name
      latin
      localizedGender
    }
    timetable {
      id
      subjectCalc
      timeRange
    }
  }
}
    `;
export const ListStudentServiceWithAttendanceReportDocument = gql`
    query ListStudentServiceWithAttendanceReport($datamanager: DatamanagerInput, $startDate: Date, $endDate: Date) {
  listStudentServices(
    datamanager: $datamanager
    startDate: $startDate
    endDate: $endDate
  ) {
    count
    results {
      id
      studyYear {
        value
      }
      serviceName {
        nameLocalized
      }
      student {
        name
        latin
        s3ProfileUri
      }
      attendanceAbsent
      attendanceAbsentExcused
      attendanceLate
    }
  }
}
    `;
export const UpdateRelatedStudentAttendanceDocument = gql`
    mutation UpdateRelatedStudentAttendance($id: ID!, $input: UpdateRelatedStudentAttendanceInput!) {
  updateRelatedStudentAttendance(id: $id, input: $input) {
    errors {
      message
      fields
    }
    result {
      id
    }
  }
}
    `;
export const BatchUpdateRelatedStudentAttendanceDocument = gql`
    mutation BatchUpdateRelatedStudentAttendance($input: BatchUpdateRelatedStudentAttendanceInput!) {
  batchUpdateRelatedStudentAttendance(input: $input)
}
    `;