import { twMerge } from 'tailwind-merge'
import { h, defineComponent } from 'vue'
import { Icon } from '#components'

export function dnamicIconify(name: string) {
  return defineComponent({
    name: 'DynamicIconify',
    setup() {
      return () => h(Icon, { name: name })
    },
  })
}

export function twIcon(baseClass: string) {
  return defineComponent({
    name: 'TwIcon',
    props: {
      class: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      return () => h('span', { class: twMerge(baseClass, props.class) })
    },
  })
}

export const delay = (ms: number = 1000) =>
  new Promise(resolve => setTimeout(resolve, ms))
