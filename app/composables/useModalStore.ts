import type { ComponentProps } from 'vue-component-type-helpers'
import type { BaseModal, UModal } from '#components'

export const useModalStore = defineStore('modalStore', () => {
  const overlay = useOverlay()

  function open<T extends Component>(component: T, props?: ComponentProps<T> & ComponentProps<typeof BaseModal> & ComponentProps<typeof UModal>) {
    overlay.create(component, {
      props: (props || {}) as ComponentProps<T>,
    }).open()
  }

  return {
    open,
  }
})
