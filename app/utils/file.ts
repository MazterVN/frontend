import { AttachmentNamespace } from '#gql/default'

export const S3_URI_IMAGE_PLACEHOLDER = 's3://pks-bucket-prod/placeholder.png'
export const IMAGE_PLACEHOLDER = 'https://image.pks.edu.kh/placeholder.png'

export function parseS3URI(s3Uri: string): { bucket: string, key: string } | null {
  const regex = /^s3:\/\/([^/]+)\/(.+)$/
  const match = s3Uri.match(regex)

  if (match) {
    const [, bucket, key] = match
    if (bucket === undefined || key === undefined) {
      return null
    }
    return { bucket, key }
  }

  return null
}

export function getFileNameFromS3URI(s3Uri: string): string {
  const fileName = s3Uri.split('/').pop()
  return fileName ?? ''
}

export async function s3CopyURI(uris: string[], namespace: AttachmentNamespace = AttachmentNamespace.ALL): Promise<FileMetadata[]> {
  const { start, finish } = useLoadingIndicator()
  const runtimeConfig = useRuntimeConfig()
  try {
    start()
    const data = await $fetch(joinPaths(runtimeConfig.public.apiHost, '/filemanager/s3-copy'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { uris, namespace },
    })
    finish()
    return data as FileMetadata[]
  }
  catch (error) {
    console.error('There was a problem with the fetch operation: ', error)
    throw error
  }
}

export async function downloadFile(url: string, filename?: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fileBlob = await $fetch(url, { responseType: 'blob' }) as Blob
    const originalFilename = filename ? filename : url.split('/').pop()?.split('?')[0] ?? 'unknown-type'
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = URL.createObjectURL(fileBlob)
    tempLink.download = originalFilename
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
  }
  catch (error) {
    console.error('Download error:', error)
  }
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map(path => path.replace(/(^\/+|\/+$)/g, '')) // Remove leading and trailing slashes
    .filter(path => path.length > 0) // Remove empty strings
    .join('/')
}
