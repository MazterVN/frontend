import type { ActiveMenuPathFragment } from '#gql'
import { ActiveMenuPathOp } from '#gql/default'

export function trimLocalePath(path: string): string {
  // trim leading '/en' or '/km' from the path
  const withoutLocalce = path.replace(/^\/(en|km)/, '')
  if (withoutLocalce === '') {
    return '/'
  }
  return withoutLocalce
}

export function isActiveMenu(
  activePaths: ActiveMenuPathFragment[],
  currentPath: string,
): boolean {
  return activePaths.some((pathObj) => {
    return (
      (pathObj.op === ActiveMenuPathOp.EQ
        && pathObj.path === trimLocalePath(currentPath))
      || (pathObj.op === ActiveMenuPathOp.CONTAINS
        && trimLocalePath(currentPath).startsWith(pathObj.path))
    )
  })
}
