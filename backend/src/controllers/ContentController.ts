import { Controller, Get, Param } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Content } from '../entities/Content';

@Controller()
export class ContentController {
  @InjectRepository(Content)
  private contentRepository!: Repository<Content>;

  @Get('/content')
  public async getAll() {
    const content = await this.contentRepository.findAndCount({ relations: ['categories'] });

    if (!content) {
      return { success: false, error: 'Something went wrong while getting the content' };
    }

    return { success: true, total: content[1], content: content[0] };
  }

  @Get('/content/:uuid')
  public async getOne(@Param('uuid') uuid: string) {
    const content = await this.contentRepository.findOne(uuid, { relations: ['categories'] });

    if (!content) {
      return { success: false, error: 'No content with this ID was found' };
    }

    return { success: true, content: content };
  }

  @Get('/content/random')
  public async getRandom() {
    const content = await this.contentRepository.createQueryBuilder("content").orderBy("RAND()").limit(4).getMany();

    if (!content) {
      return { success: false, error: 'Something went wrong while getting the content' };
    }

    return { success: true, content: content };
  }
}
