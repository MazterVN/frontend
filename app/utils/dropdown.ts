import type { ChangeEventArgs } from '@syncfusion/ej2-vue-dropdowns'
import type { EmitType } from '@syncfusion/ej2-base'

export function interactedChanged(args: ChangeEventArgs, callback: (args: ChangeEventArgs) => void): EmitType<ChangeEventArgs> {
  if (!args.isInteracted) return () => args
  callback(args)
  return () => args
}
