import type {
  CreateRelatedScoreTypeInput,
  CreateRelatedScoreTypeMutation,
  EditScoreTypeQuery,
  UpdateRelatedScoreTypeInput,
  UpdateRelatedScoreTypeMutation,
} from '#gql'
import type { ScoreTypeService } from '#imports'

class ScoreTypeRepository {
  private service: ScoreTypeService

  constructor(service: ScoreTypeService) {
    this.service = service
  }

  async edit(id: string): Promise<EditScoreTypeQuery | null> {
    return await this.service.edit(id)
  }

  async createRelated(
    input: CreateRelatedScoreTypeInput,
  ): Promise<CreateRelatedScoreTypeMutation | null> {
    return await this.service.createRelated(input)
  }

  async updateRelated(
    id: string,
    input: UpdateRelatedScoreTypeInput,
  ): Promise<UpdateRelatedScoreTypeMutation | null> {
    return await this.service.updateRelated(id, input)
  }
}
export const scoreTypeRepository = new ScoreTypeRepository(scoreTypeService)
