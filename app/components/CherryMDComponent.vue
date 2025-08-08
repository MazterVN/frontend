<script setup lang="ts">
import 'cherry-markdown/dist/cherry-markdown.css'
import Cherry from 'cherry-markdown'
import * as echarts from 'echarts'
import * as mermaid from 'mermaid'
import { debounce } from '@syncfusion/ej2-base'
import type { CherryExternalsOptions } from 'cherry-markdown/types/cherry'

const emit = defineEmits(['update:modelValue', 'blur'])

const props = defineProps({
  modelValue: {
    type: [String, null],
    default: '',
  },
  id: {
    type: [String, null],
    default: null,
  },
  preview: {
    type: Boolean,
    default: false,
  },
})

const editorRef = ref<HTMLElement | undefined>()
const instance = ref<Cherry | null>(null)
const uuid = useId()
let internalChange = false

const resetInternalChange = debounce(() => {
  internalChange = false
}, 700)

const externals: object = {
  echarts,
  mermaid,
}
onMounted(() => {
  instance.value = new Cherry({
    ...(props.id
      ? {
          id: props.id,
        }
      : {
          el: editorRef.value,
        }),
    value: props.modelValue ?? '',
    locale: 'en_US',
    callback: {
      afterChange: (markdown: string) => {
        if (markdown === props.modelValue) return
        internalChange = true
        emit('update:modelValue', markdown)
        resetInternalChange()
      },
    },
    event: {
      blur: () => emit('blur'),
    },
    toolbars: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolbar: !props.preview
        ? [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'header',
            'sub',
            'sup',
            'size',
            'panel',
            'justify',
            'detail',
            '|',
            'color',
            'list',
            'ol',
            'ul',
            'table',
            'lineTable',
            'barTable',
            'quickTable',
            'quote',
            '|',
            'undo',
            'redo',
            '|',
            {
              insert: ['link', 'hr', 'br', 'code', 'quote', 'table'],
            },
            'graph',
            'settings',
          ]
        : false,
      sidebar: ['mobilePreview'],
      toolbarRight: ['fullScreen', 'export', 'switchModel'],
    },
    editor: {
      defaultModel: props.preview ? 'previewOnly' : 'edit&preview',
    },
    externals: externals as CherryExternalsOptions,
  })
})
watch(
  () => props.modelValue,
  (newValue) => {
    if (instance.value && !internalChange) {
      instance.value?.setMarkdown(newValue ?? '', true)
    }
  },
)
onUnmounted(() => {
  if (instance.value) {
    instance.value?.destroy()
  }
})
</script>

<template>
  <div
    :id="id ?? uuid"
    ref="editorRef"
  />
</template>
