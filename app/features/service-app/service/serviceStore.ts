import type {
  Grid,
  GridModel,
  RowDeselectEventArgs,
  RowSelectEventArgs,
} from '@syncfusion/ej2-vue-grids'
import { v4 as uuidv4 } from 'uuid'
import * as v from 'valibot'
import type {
  ClickEventArgs,
  MenuEventArgs,
} from '@syncfusion/ej2-navigations'
import type { ServiceSettingFragment, ServiceFormFragment } from '#gql'
import { ServiceCreate, ServiceEdit } from '#components'
import type { FormSubmitEvent } from '#ui/types'
import {
  ServiceSettingType,
  type CreateRelatedUpsertServiceInput,
  type EditServiceQuery,
} from '#gql/default'

export const useServiceStore = defineStore('serviceStore', () => {
    type ServiceDetail = At<ServiceFormFragment, 'serviceDetails'>
    type ServiceFee = At<ServiceFormFragment, 'serviceFees'>
    type EditService = At<EditServiceQuery, 'editService'>
    const modal = useModalStore()
    const grid = ref<Grid | null>(null)
    const item = ref<ServiceFormFragment>(initItem())

    const validationSchema = v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      name: v.pipe(v.string(), v.nonEmpty('Please enter a name')),
      description: v.pipe(
        v.string(),
        v.nonEmpty('Please enter a description'),
      ),
      endsAt: v.pipe(v.string('Please enter a valid date'), v.nonEmpty('Please enter a valid date')),
      studyYearId: v.pipe(
        v.string(),
        v.nonEmpty('Please select a study year'),
      ),
      type: v.pipe(v.string(), v.nonEmpty('Please select a type')),
      serviceDetails: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          serviceNameId: v.pipe(
            v.string(),
            v.nonEmpty('Please select a service'),
          ),
        }),
      ),
      serviceFees: v.array(
        v.object({
          id: v.pipe(v.string(), v.nonEmpty()),
          monthRepeat: v.pipe(
            v.number('Please enter a valid number'),
            v.minValue(1),
            v.maxValue(12),
          ),
          price: v.pipe(
            v.number('Please enter a valid number'),
            v.minValue(0),
          ),
          fixedDiscount: v.pipe(
            v.number('Please enter a valid number'),
            v.minValue(0),
            v.maxValue(100),
          ),
        }),
      ),
    })
    const setGridRef = (component: GridComponent | null): void => {
      grid.value = component?.ej2Instances ? component?.ej2Instances : null
    }
    function initToolbar() {
      grid.value?.toolbarModule.enableItems(['edit'], false)
      grid.value?.contextMenuModule.contextMenu.enableItems(['Edit'], false)
    }
    function initServiceDetail(): ServiceDetail {
      return {
        id: uuidv4(),
        serviceNameId: '',
      }
    }

    function initServiceFee(monthRepeat: number): ServiceFee {
      return {
        id: uuidv4(),
        monthRepeat: monthRepeat,
        price: 0,
        fixedDiscount: 0,
      }
    }
    function initItem(): ServiceFormFragment {
      return {
        id: uuidv4(),
        name: '',
        description: '',
        beginsAt: null,
        endsAt: null,
        type: ServiceSettingType.GRADE,
        studyYearId: '',
        serviceDetails: [initServiceDetail()],
        serviceFees: [
          initServiceFee(1),
          initServiceFee(3),
          initServiceFee(6),
          initServiceFee(12),
        ],
      }
    }
    function resetItem() {
      item.value = initItem()
    }
    function addServiceDetail() {
      item.value.serviceDetails.push(initServiceDetail())
    }
    function removeServiceDetail(id: string) {
      item.value.serviceDetails = item.value.serviceDetails.filter(
        item => item.id !== id,
      )
    }
    function refreshGrid() {
      grid.value?.refresh()
    }
    function toItem(data: EditService) {
      const defaultServiceFees: ServiceFee[] = [
        initServiceFee(1),
        initServiceFee(3),
        initServiceFee(6),
        initServiceFee(12),
      ]

      const currentServiceFees: ServiceFee[] = data.serviceFees.map(sf => ({
        id: sf.id,
        monthRepeat: sf.monthRepeat,
        price: sf.price,
        fixedDiscount: sf.fixedDiscount,
      }))

      const existingMonthRepeats = new Set(
        currentServiceFees.map(sf => sf.monthRepeat),
      )

      defaultServiceFees.forEach((serviceFee) => {
        if (!existingMonthRepeats.has(serviceFee.monthRepeat)) {
          currentServiceFees.push(serviceFee)
          existingMonthRepeats.add(serviceFee.monthRepeat)
        }
      })
      currentServiceFees.sort((a, b) => a.monthRepeat - b.monthRepeat)
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        beginsAt: data.beginsAt,
        endsAt: data.endsAt,
        studyYearId: data.studyYearId,
        type: data.type,
        serviceDetails: data.serviceDetails.map(sd => ({
          id: sd.id,
          serviceNameId: sd.serviceNameId,
        })),
        serviceFees: currentServiceFees,
      }
    }
    function toInput(
      item: ServiceFormFragment,
    ): CreateRelatedUpsertServiceInput {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        beginsAt: item.beginsAt,
        endsAt: item.endsAt,
        studyYearId: item.studyYearId,
        type: item.type,
        serviceDetails: item.serviceDetails.map(sd => ({
          id: sd.id,
          serviceNameId: sd.serviceNameId,
        })),
        serviceFees: item.serviceFees.map(sf => ({
          id: sf.id,
          monthRepeat: sf.monthRepeat,
          price: sf.price,
          fixedDiscount: sf.fixedDiscount,
        })),
      }
    }

    function handleToolbarClick(args: ClickEventArgs): void {
      const selectedRecords
            = grid.value?.getSelectedRecords() as ServiceSettingFragment[]
      const toolbarId = args.item.id as 'add' | 'edit' | 'delete'
      switch (toolbarId) {
        case 'add':
          modal.open(ServiceCreate, {
            fullscreen: false,
            ui: {
              width: 'w-full sm:max-w-2xl',
            },

            onInit: async () => {
              resetItem()
            },
            onSubmit: async (
              evt: FormSubmitEvent<ServiceFormFragment>,
            ) => {
              const result
                            = await serviceRepository.createRelatedUpsert(
                              toInput(evt.data),
                            )
              if (!result?.createRelatedUpsertService.errors.length) {
                showSuccessToast('បន្ថែមបានជោគជ័យ')
                resetItem()
                refreshGrid()
              }
            },

          })
          break

        case 'edit':
          modal.open(ServiceEdit, {
            fullscreen: false,

            ui: {
              width: 'w-full sm:max-w-2xl',
            },
            onInit: async () => {
              resetItem()
              const id = selectedRecords[0]?.id ?? ''
              const result = await serviceRepository.edit(id)
              if (result?.editService) {
                item.value = toItem(result.editService)
              }
            },
            onSubmit: async (
              evt: FormSubmitEvent<ServiceFormFragment>,
            ) => {
              const result
                            = await serviceRepository.createRelatedUpsert(
                              toInput(evt.data),
                            )
              if (!result?.createRelatedUpsertService.errors.length) {
                showSuccessToast('កែប្រែបានជោគជ័យ')
                refreshGrid()
              }
            },

          })
          break

        case 'delete':
          console.log('Performing delete operation')
          break

        default:
          console.log('Unknown operation')
          break
      }
    }

    function handleContextMenuClick(args: MenuEventArgs): void {
      const toolbarId = args.item.id as 'edit'
      switch (toolbarId) {
        case 'edit':
          // editRef?.open(id);
          break

        default:
          console.log('Unknown operation')
          // Handle unknown operation
          break
      }
    }

    function handleRowSelect(_args: RowSelectEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords()
      grid.value?.toolbarModule.enableItems(
        ['edit'],
        selectedRecords?.length === 1,
      )
      grid.value?.contextMenuModule.contextMenu.enableItems(
        ['Edit'],
        selectedRecords?.length === 1,
      )
    }

    function handleRowDeselect(_args: RowDeselectEventArgs): void {
      const selectedRecords = grid.value?.getSelectedRecords()
      grid.value?.toolbarModule.enableItems(
        ['edit'],
        selectedRecords?.length === 1,
      )
      grid.value?.contextMenuModule.contextMenu.enableItems(
        ['Edit'],
        selectedRecords?.length === 1,
      )
    }
    const gridConfig = (): GridModel => ({
      ...globalGridConfig,
      dataSource: gridDataSource(ListServiceSettingDocument),
      contextMenuItems: toContextMenuItems([
        {
          id: 'edit',
          text: 'Edit',
          iconCss: 'e-menu-icon e-icons e-edit',
        },
        'AutoFit',
        'AutoFitAll',
        'SortAscending',
        'SortDescending',
        'FirstPage',
        'PrevPage',
        'LastPage',
        'NextPage',
      ]),
      toolbarClick: handleToolbarClick,
      contextMenuClick: handleContextMenuClick,
      rowSelected: handleRowSelect,
      rowDeselected: handleRowDeselect,
      toolbar: [
        { text: 'បន្ថែម', prefixIcon: 'icon-[heroicons--plus-20-solid] !w-4 !h-4', id: 'add' },
        { text: 'កែ', prefixIcon: 'icon-[heroicons--pencil-square-16-solid] !w-4 !h-4', id: 'edit' },
        'Search',
      ],
    })
    return {
      gridConfig,
      setGridRef,
      initToolbar,
      item,
      validationSchema,
      addServiceDetail,
      removeServiceDetail,
    }
})
