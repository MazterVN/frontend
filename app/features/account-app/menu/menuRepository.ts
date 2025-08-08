import type { MenuService } from './menuService'
import type {
  CreateRelatedUpsertMenuInput,
  CreateRelatedUpsertMenuMutation,
  ListRootMenuQuery,
} from '#gql'

export class MenuRepository {
  private service: MenuService

  constructor(service: MenuService) {
    this.service = service
  }

  async listRoot(): Promise<ListRootMenuQuery> {
    return await menuService.listRoot()
  }

  async createRelatedUpsert(
    input: CreateRelatedUpsertMenuInput,
  ): Promise<CreateRelatedUpsertMenuMutation | null> {
    return await this.service.createRelatedUpsert(input)
  }
}

export const menuRepository = new MenuRepository(menuService)
