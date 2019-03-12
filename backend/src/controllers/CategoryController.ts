import { Controller, Get, Param } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';

import { Categories } from '../entities/Categories';
import { Content } from '../entities/Content';

@Controller()
export class CategoryController {
  @InjectRepository(Categories)
  private categoryRepository!: Repository<Categories>;

  @InjectRepository(Content)
  private contentRepository!: Repository<Content>;

  @Get('/categories')
  public async getAll() {
    const categories = await this.categoryRepository.findAndCount();

    if (!categories) {
      return { success: false, error: 'Something went wrong while getting the categories' };
    }

    return { success: true, total: categories[1], categories: categories[0] }
  }

  @Get('/categories/content/:uuid')
  public async getOne(@Param('uuid') uuid: string) {
    const category = await this.categoryRepository.createQueryBuilder("category").leftJoinAndSelect("category.content", "content").andWhere("category.id = :uuid", { uuid: uuid }).getOne();

    if (!category) {
      return { success: false, error: 'Something went wrong while getting the category with content' };
    }

    return { success: true, category: category };
  }

  @Get('/categories/content')
  public async getByCategory() {
    const category = await this.categoryRepository.createQueryBuilder("category").leftJoinAndSelect("category.content", "content").getMany();

    if (!category) {
      return { success: false, error: 'Something went wrong while getting the categories with content' };
    }

    return { success: true, category: category };
  }
}
