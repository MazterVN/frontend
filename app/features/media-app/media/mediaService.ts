import type {
  UriToPresignedUrlQuery,
} from '#gql'
import { GqlUriToPresignedUrl } from '#gql'

export class MediaService {
  async uriToPresignedUrl(uri: string): Promise<UriToPresignedUrlQuery | null> {
    try {
      return await GqlUriToPresignedUrl({ uri: uri })
    }
    catch (error) {
      showGqlError(error as GraphQLResponse)
    }
    return null
  }
}

export const mediaService = new MediaService()
