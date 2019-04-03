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
    const categories = await this.categoryRepository.findAndCount({
      relations: ['content']
    });

    if (!categories) {
      return { success: false, error: 'Something went wrong while getting the categories' };
    }

    categories[0].map((category, index) => {
      if (category.content.length === 0) {
        categories[0].splice(index, 1);
      }
    });

    return { success: true, total: categories[1], categories: categories[0] }
  }

  @Get('/categories/content/:uuid')
  public async getOne(@Param('uuid') uuid: string) {
    const category = await this.categoryRepository.createQueryBuilder("category").leftJoinAndSelect("category.content", "content").innerJoinAndSelect("content.categories", "categories").andWhere("category.id = :uuid", { uuid: uuid }).getOne();

    if (!category) {
      return { success: false, error: 'Something went wrong while getting the category with content' };
    }

    // @ts-ignore
    const sortedCategory = category.content.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { success: true, category: category.category, content: sortedCategory };
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
