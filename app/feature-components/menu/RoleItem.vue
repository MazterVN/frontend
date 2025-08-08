<script setup lang="ts">
import type { UFormInterface } from '#components'
import type { ListRootMenuQuery } from '#gql'
import { ActiveMenuPathOp } from '#gql/default'

const roleStore = useRoleStore()
type Menu = At<ListRootMenuQuery, 'listRootMenus'>
const props = defineProps<{
  formRef: InstanceType<typeof UFormInterface> | null
  items: Menu[]
  level?: number
  maxLevel: number
}>()
const level = props.level ?? 1
</script>

<template>
  <UCard v-bind="CARD_ACCORDION">
    <Accordion
      type="single"
      collapsible
    >
      <AccordionItem
        v-for="(item, index) in items"
        :key="item.id"
        :value="item.id"
        :data-testid="`menu-item-${index}`"
      >
        <AccordionTrigger>
          <div class="flex gap-2 items-center">
            <UAvatar>
              <i :class="[item.iconClass, 'w-4 h-4']" />
            </UAvatar>
            <span class="truncate">{{ index + 1 }}. {{ item.localizedGettextId }}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent class="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-12 px-4">
          <div class="sm:col-span-1">
            <UFormField
              :name="`${index}.position`"
              label="Position"
            >
              <UInput
                v-model="item.position"
                type="number"
                disabled
              />
            </UFormField>
          </div>
          <div class="sm:col-span-2">
            <UFormField
              :name="`${index}.gettextId`"
              label="Translation Key"
            >
              <UInput
                v-model="item.gettextId"
                disabled
              />
            </UFormField>
          </div>
          <div class="sm:col-span-2">
            <UFormField
              :name="`${index}.iconClass`"
              label="CSS Icon Class"
            >
              <UInput
                v-model="item.iconClass"
                disabled
              />
            </UFormField>
          </div>
          <div class="sm:col-span-3">
            <UFormField
              :name="`${index}.path`"
              label="Menu Path"
            >
              <UInput
                v-model="item.path"
                disabled
              />
            </UFormField>
          </div>

          <div class="sm:col-span-3">
            <UFormField
              :name="`${index}.permissionKey`"
              label="Permission"
            >
              <UInput
                v-model="item.permissionKey"
                disabled
              />
            </UFormField>
          </div>
          <div class="sm:col-span-5">
            <UCard
              class="w-full card-table"
              :ui="CARD_TABLE_UI"
            >
              <template #header>
                ACTIVE PATHS
              </template>
              <Table class="table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Operation
                    </TableHead>
                    <TableHead>
                      Path
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="(row, activePathIdx) in item.activePaths"
                    :key="row.id"
                  >
                    <TableCell>
                      <UFormField :name="`activePaths.${activePathIdx}.op`">
                        <USelect
                          v-model="row.op"
                          :items="Object.values(ActiveMenuPathOp)"
                          disabled
                        />
                      </UFormField>
                    </TableCell>
                    <TableCell>
                      <UFormField :name="`activePaths.${activePathIdx}.path`">
                        <UInput
                          v-model="row.path"
                          disabled
                        />
                      </UFormField>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </UCard>
          </div>
          <div class="sm:col-span-7">
            <UCard
              class="w-full card-table"
              :ui="CARD_TABLE_UI"
            >
              <template #header>
                Permissions
              </template>
              <Table class="table-fixed">
                <TableBody>
                  <TableRow
                    v-for="(row, permissionIdx) in item.menuPermissions"
                    :key="row.id"
                  >
                    <TableCell>
                      <div class="flex gap-1 items-center">
                        <UCheckbox
                          :model-value="
                            roleStore.isActivePermission(row.permissionId)
                          "
                          :data-testid="`menu-permissions.${permissionIdx}.is-active-checkbox`"
                          @update:model-value="roleStore.togglePermission($event as boolean, row.permissionId)"
                        />
                        <UFormField
                          :key="`menuPermissions.${row.id}.permissionId`"
                          :name="`menuPermissions.${permissionIdx}.permissionId`"
                        >
                          <DropdownList
                            :id="`menuPermissions.${permissionIdx}.permissionId`"
                            v-model="row.permissionId"
                            :data-testid="`menu-permissions.${permissionIdx}.permission-id`"
                            :graphql-query="ListPermissionDropdownDocument"
                            :fields="{ text: 'fullPermission', value: 'id' }"
                            :enabled="false"
                          />
                        </UFormField>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </UCard>
          </div>
          <div class="sm:col-span-full">
            <MenuRoleItem
              v-if="item.menus?.length && level < maxLevel"
              :form-ref="formRef"
              :items="item.menus as Menu[]"
              :level="level + 1"
              :max-level="maxLevel"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </UCard>
</template>
