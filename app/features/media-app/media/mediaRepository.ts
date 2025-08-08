import type { UriToPresignedUrlQuery } from '#gql'
import type { MediaService } from '#imports'

class MediaRepository {
  private service: MediaService

  constructor(service: MediaService) {
    this.service = service
  }

  async uriToPresignedUrl(uri: string): Promise<UriToPresignedUrlQuery | null> {
    return await this.service.uriToPresignedUrl(uri)
  }
}

export const mediaRepository = new MediaRepository(mediaService)
