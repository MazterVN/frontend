export function showSuccessToast(message: string): void {
  const toast = useToast()
  toast.add({
    title: message,
    icon: 'mdi:success-circle-outline',
  })
}

export function showErrorToast(message: string | FormError): void {
  const toast = useToast()
  if (typeof message === 'string') {
    toast.add({
      title: 'Error',
      description: message,
      icon: 'pajamas:error',
      color: 'error',
    })
  }
  else {
    const formattedErrors = message.errors
      .map(error => `${error.message} (${error.path})`)
      .join('\n- ')

    toast.add({
      title: 'Please fix the following errors:',
      description: '- ' + formattedErrors,
      icon: 'pajamas:error',
      color: 'error',
    })
  }
}

export function showGqlError(error: GraphQLResponse): void {
  const toast = useToast()
  if (!error?.gqlErrors?.length) {
    toast.add({
      title: 'មានកំហុសមួយកើតឡើង',
      icon: 'pajamas:error',
      color: 'error',
    })
    return
  }
  const errDesc: string
        = error?.gqlErrors[0]?.short_message || error?.gqlErrors[0]?.message || 'Unknown error'
  toast.add({
    title: 'កំហុសកើតឡើង',
    description: errDesc,
    icon: 'pajamas:error',
    color: 'error',
  })
}

export function showGqlMutationError(
  errors: Array<{ message?: string | null, fields?: Array<string> | null }>,
) {
  if (!errors.length)
    return

  const toast = useToast()
  const formattedErrors = errors
    .map((error, index) => {
      const message = error.message || 'An unknown error occurred'
      const fields = error.fields
        ? `Fields: ${error.fields.join(', ')}`
        : ''
      return `${index + 1}. ${message} ${fields}`
    })
    .join('\n')
  toast.add({
    title: 'កំហុសកើតឡើង',
    description: formattedErrors,
    icon: 'pajamas:error',
    color: 'error',
  })
}
