<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { BaseFilemanager, ImagePreview } from '#components'
import { AttachmentNamespace } from '#gql/default'

const modal = useModalStore()
const emit = defineEmits(['update:fileList', 'pickImage'])
const { user } = useAuthentication()

const props = defineProps({
  fileList: {
    type: Array<FileMetadata>,
    default: [],
  },
  namespace: {
    type: String as PropType<AttachmentNamespace>,
    default: AttachmentNamespace.ALL,
  },
})

function handlePictureCardPreview(uploadFile: FileMetadata) {
  modal.open(ImagePreview, {
    fullscreen: false,
    s3Uri: uploadFile.uri,
    key: uuidv4(),
    ui: {
      width: 'w-full sm:max-w-6xl',
    },

    onClose: () => {

    },
  })
}

function addFileList(files: FileMetadata[]) {
  emit('update:fileList', files.concat(props.fileList))
}

function pickImage() {
  modal.open(BaseFilemanager, {
    fullscreen: false,
    namespace: props.namespace,
    picker: true,
    key: 'imagePickerKey',
    bucket: user.bucket ?? '',
    bucketFolder: user.bucketFolder ?? '',
    allowedExtensions: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg',
    onChoose: (files: FileMetadata[]) => {
      addFileList(files)
    },
    ui: {
      width: 'w-full sm:max-w-6xl',
    },

    onClose: () => {

    },
  })
}
// compute get set fileList writable

const writableFileList = computed<any>({
  get: () => props.fileList,
  set: (value: FileMetadata[]) => {
    emit('update:fileList', value)
  },
})
const handleRemove = (file: FileMetadata) => {
  const files = props.fileList.filter(item => item.id !== file.id)
  emit('update:fileList', files)
}
</script>

<template>
  <ElUpload
    v-model:file-list="writableFileList"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview as any"
  >
    <template #trigger>
      <UButton
        :ui="{
          base: 'w-full h-full flex items-center justify-center',
        }"
        color="neutral"
        variant="ghost"
        @click.stop.prevent="pickImage"
      >
        <i class="icon-[lucide--plus] w-5 h-5" />
      </UButton>
    </template>
    <template #file="{ file }">
      <div>
        <NuxtImg
          provider="cloudfront"
          placeholder
          class="w-full h-full el-upload-list__item-thumbnail"
          :src="(file as any).uri"
          :modifiers="{
            edits: {
              resize: { width: 200, height: 200, fit: 'cover' },
            },
          }"
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file as any)"
          >
            <ElIcon>
              <i class="icon-[lucide--zoom-in]" />
            </ElIcon>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(file as any)"
          >
            <ElIcon>
              <i class="icon-[lucide--trash-2]" />
            </ElIcon>
          </span>
        </span>
      </div>
    </template>
  </ElUpload>
</template>
