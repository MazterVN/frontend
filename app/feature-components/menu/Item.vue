<script setup lang="ts">
import type { UFormInterface } from '#components'
import type { ListRootMenuQuery } from '#gql'
import { ActiveMenuPathOp } from '#gql/default'

const store = useMenuStore()
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
        :data-testid="`menu-${index}`"
        :value="item.id"
      >
        <AccordionTrigger class="w-full">
          <div class="flex gap-2 items-center">
            <UAvatar>
              <i :class="[item.iconClass, 'w-4 h-4']" />
            </UAvatar>
            <span class="truncate">{{ index + 1 }}. {{ item.localizedGettextId }}</span>
          </div>
          <div class="ms-auto flex gap-1 items-center">
            <i
              class="icon-[heroicons--trash] w-4 h-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500"
              @click.stop.prevent="store.removeMenu(ref(items), item.id)"
            />
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
                data-testid="position-numeric-field"
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
                data-testid="translation-input-field"
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
                data-testid="icon-class-input-field"
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
                data-testid="menu-path-input-field"
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
                data-testid="permission-input-field"
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Operation
                    </TableHead>
                    <TableHead>
                      Path
                    </TableHead>
                    <TableHead class="w-[40px]" />
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
                          :data-testid="`active-paths.${activePathIdx}.op`"
                        />
                      </UFormField>
                    </TableCell>
                    <TableCell>
                      <UFormField :name="`activePaths.${activePathIdx}.path`">
                        <UInput
                          v-model="row.path"
                          :data-testid="`active-paths.${activePathIdx}.path`"
                        />
                      </UFormField>
                    </TableCell>
                    <TableCell class="text-center">
                      <TrashButton
                        :data-testid="`active-paths-delete-row-${activePathIdx}`"
                        @click="store.removeActivePath(item.activePaths as ActivePath[], row.id)"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <template #footer>
                <div class="footer">
                  <PlusButton
                    data-testid="add-active-path-btn"
                    @click="store.addActivePath(item.activePaths as ActivePath[])"
                  />
                </div>
              </template>
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
              <Table>
                <TableBody>
                  <TableRow
                    v-for="(row, permissionIdx) in item.menuPermissions"
                    :key="row.id"
                  >
                    <TableCell>
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
                        />
                      </UFormField>
                    </TableCell>
                    <TableCell class="text-center w-[40px]">
                      <TrashButton
                        :data-testid="`menu-permissions-delete-row-${permissionIdx}`"
                        @click="store.removeMenuPermission(item.menuPermissions, row.id)"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <template #footer>
                <div class="footer">
                  <PlusButton
                    data-testid="add-menu-permission-btn"
                    @click="store.addMenuPermission(item.menuPermissions)"
                  />
                </div>
              </template>
            </UCard>
          </div>
          <div class="sm:col-span-full">
            <MenuItem
              v-if="item.menus?.length && level < maxLevel"
              :form-ref="formRef"
              :items="item.menus as Menu[]"
              :level="level + 1"
              :max-level="maxLevel"
            />
            <UCard
              v-else-if="level < maxLevel"
              class="w-full"
              :ui="{
                body: '',
                footer: 'p-2',
              }"
            >
              <template #footer>
                <div class="flex flex-wrap justify-end items-center">
                  <div>
                    <PlusButton
                      data-testid="add-submenu-btn"
                      @click="store.addMenu(ref(item.menus as Menu[]))"
                    />
                  </div>
                </div>
              </template>
            </UCard>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <template #footer>
      <div class="flex flex-wrap justify-end items-center">
        <div>
          <PlusButton
            data-testid="add-menu-btn"
            @click="store.addMenu(ref(items))"
          />
        </div>
      </div>
    </template>
  </UCard>
</template>
