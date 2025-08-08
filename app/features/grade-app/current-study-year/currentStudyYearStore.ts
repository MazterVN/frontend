import { v4 as uuidv4 } from 'uuid'
import * as v from 'valibot'
import type {
  CreateUpsertCurrentStudyYearInput,
  EditCurrentStudyYearQuery,
} from '#gql/default'

import type { FormSubmitEvent } from '#ui/types'

export const useCurrentStudyYearStore = defineStore(
  'currentStudyYearStore',
  () => {
        type CurrentStudyYear = At<
          EditCurrentStudyYearQuery,
          'readOneCurrentStudyYear'
        >
        const item = ref<CurrentStudyYear>(initItem())

        const validationSchema = v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          studyYearId: v.pipe(
            v.string('Please select a study year'),
            v.nonEmpty('Please select a study year'),
          ),
        })
        function initItem(): CurrentStudyYear {
          return {
            id: uuidv4(),
            studyYearId: '',
          }
        }
        async function edit() {
          const result = await currentStudyYearRepository.edit()
          if (result?.readOneCurrentStudyYear) {
            item.value = result.readOneCurrentStudyYear
          }
        }
        async function createUpsert(evt: FormSubmitEvent<CurrentStudyYear>) {
          const result = await currentStudyYearRepository.createUpsert(
            toInput(evt.data),
          )
          if (result && !result?.createUpsertCurrentStudyYear.errors.length) {
            showSuccessToast('កែប្រែបានជោគជ័យ')
          }
        }
        function toInput(
          item: CurrentStudyYear,
        ): CreateUpsertCurrentStudyYearInput {
          return {
            id: item.id,
            studyYearId: item.studyYearId,
          }
        }

        return {
          item,
          validationSchema,
          edit,
          createUpsert,
        }
  },
)
