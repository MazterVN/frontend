export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    select: {
      slots: {
        base: 'w-full',
      },
    },
    input: {
      slots: {
        root: 'w-full',
      },
    },
    colors: {
      primary: 'md-scheme',
      neutral: 'slate',
    },
    button: {
      defaultVariants: {
        // Set default button color to neutral
        // color: 'neutral'
      },
    },
  },
})
