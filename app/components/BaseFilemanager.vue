<script setup lang="ts">
import type { FileManagerModel, BeforeSendEventArgs, BeforeImageLoadEventArgs, BeforeDownloadEventArgs, MenuClickEventArgs, MenuOpenEventArgs } from '@syncfusion/ej2-vue-filemanager'
import { AttachmentNamespace } from '#gql/default'

const emit = defineEmits(['choose', 'close'])
const runtimeConfig = useRuntimeConfig()
const { user } = useAuthentication()
const session = useSupabaseSession()
const filemanagerRef = ref<HTMLElement>()
const props = defineProps({
  bucket: {
    type: String,
    required: true,
  },
  bucketFolder: {
    type: String,
    required: true,
  },
  allowMultiSelection: {
    type: Boolean,
    default: true,
  },
  allowedExtensions: {
    type: String,
    default: '*',
  },
  maxFileSize: {
    type: Number,
    default: 300000000,
  },
  minFileSize: {
    type: Number,
    default: 0,
  },
  picker: {
    type: Boolean,
    default: false,
  },
  inModal: {
    type: Boolean,
    default: true,
  },
  namespace: {
    type: String as PropType<AttachmentNamespace>,
    default: AttachmentNamespace.ALL,
  },
})

const hostUrl = `${runtimeConfig.public.s3Server}/api/AmazonS3Provider/`
const fileContexts: string[] = ['Open', '|', 'Cut', 'Copy', '|', 'Delete', 'Download', 'Rename', '|', 'Details']

function menuOpen(args: MenuOpenEventArgs) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fmId = filemanagerRef.value?.ej2Instances?.element?.id ?? ''
  for (const i of args.items ?? []) {
    if (i.id === fmId + '_cm_choose') {
      i.iconCss = 'e-icons icon-[tabler--hand-click]'
    }
  }
}
async function menuClick(args: MenuClickEventArgs) {
  if (args.item?.text === 'Choose') {
    const files = args.fileDetails as FileManagerType[]
    const uris = files.map((file) => {
      const fullPath = joinPaths(
        props.bucket,
        props.bucketFolder,
        file.filterPath,
        file.name,
      )
      return `s3://${fullPath}`
    })
    const resp = await s3CopyURI(uris, props.namespace) as FileMetadata[]
    emit('choose', resp)
  }
}
const filemanagerConfig: FileManagerModel = {
  ajaxSettings: {
    url: hostUrl + 'AmazonS3FileOperations',
    getImageUrl: hostUrl + 'AmazonS3GetImage',
    uploadUrl: hostUrl + 'AmazonS3Upload',
    downloadUrl: hostUrl + 'AmazonS3Download',
  },
  allowMultiSelection: props.allowMultiSelection,
  showItemCheckBoxes: false,
  rootAliasName: 'Cloud Drive',
  searchSettings: { allowSearchOnTyping: false },
  beforeSend: (evt: BeforeSendEventArgs) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    evt.ajaxSettings.beforeSend = function (args) {
      // add allowed extension
      args.httpRequest.setRequestHeader('X-Allowed-Extensions', props.allowedExtensions)
      args.httpRequest.setRequestHeader('Authorization', `Bearer ${session.value?.access_token ?? ''}`)
    }
  },
  beforeImageLoad: (evt: BeforeImageLoadEventArgs) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { bucket = '', bucketFolder = '' } = user
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { name = '', filterPath = '' } = evt.fileDetails.at(0)
    const imageName = joinPaths(filterPath, name)
    const cdnBody = {
      bucket: bucket,
      key: `${bucketFolder}${imageName}`,
    }
    const encoded = unicodeToBase64(JSON.stringify(cdnBody))
    const imageUrl = `${runtimeConfig.public.imageCdn}/${encoded}`
    evt.imageUrl = imageUrl
  },
  beforeDownload: (evt: BeforeDownloadEventArgs) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { bucket = '', bucketFolder = '' } = user
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    evt.data = { ...evt.data, bucket, bucketFolder }
  },
  uploadSettings: {
    maxFileSize: props.maxFileSize,
    minFileSize: props.minFileSize,
    allowedExtensions: props.allowedExtensions,
  },
  contextMenuSettings: {
    file: props.picker ? ['Choose', ...fileContexts] : fileContexts,
  },
  menuOpen: menuOpen,
  menuClick: menuClick,
}
</script>

<template>
  <BaseModal
    v-if="inModal"
    title="Cloud Drive"
    no-footer
    no-space
    @close="() => emit('close')"
  >
    <EjsFilemanager
      ref="filemanagerRef"
      v-bind="filemanagerConfig"
      height="700px"
    />
  </BaseModal>
  <EjsFilemanager
    v-else
    ref="filemanagerRef"
    v-bind="filemanagerConfig"
    height="700px"
  />
</template>
