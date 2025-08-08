import { v4 as uuidv4 } from 'uuid'
import type { CreateUpsertCurrentEnrollmentStudyYearInput, ReadOneCurrentEnrollmentStudyYearQuery } from '#gql'

export const useCurrentEnrollmentStudyYearStore = defineStore('currentEnrollmentStudyYearStore', () => {
  // Types
  type CurrentEnrollmentStudyYear = At<ReadOneCurrentEnrollmentStudyYearQuery, 'readOneCurrentEnrollmentStudyYear'>

  // Store Dependencies
  const { start, finish } = useLoadingIndicator()

  // State
  const item = ref<CurrentEnrollmentStudyYear>(initItem())
  const isReady = ref(false)
  function initItem(): CurrentEnrollmentStudyYear {
    return {
      id: uuidv4(),
      sourceStudyYearId: '',
      destinationStudyYearId: '',
    }
  }
  async function readOne(): Promise<void> {
    start()
    const data = await currentEnrollmentStudyYearRepository.readOne()
    if (data?.readOneCurrentEnrollmentStudyYear) {
      item.value = data.readOneCurrentEnrollmentStudyYear
    }
    await delay()
    finish()
  }

  async function createUpsert(): Promise<void> {
    start()
    const result = await currentEnrollmentStudyYearRepository.createUpsert(toInput(item.value))
    if (!result?.createUpsertCurrentEnrollmentStudyYear.errors.length) {
      showSuccessToast('រក្សាទុកបានជោគជ័យ')
    }
    await delay()
    finish()
  }

  // Data Transformation
  function toInput(data: CurrentEnrollmentStudyYear): CreateUpsertCurrentEnrollmentStudyYearInput {
    return {
      id: data.id,
      sourceStudyYearId: data.sourceStudyYearId,
      destinationStudyYearId: data.destinationStudyYearId,
    }
  }
  // Public API
  return {
    // State
    isReady,
    item,
    // Methods
    readOne,
    createUpsert,
  }
})
