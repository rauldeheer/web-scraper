import { Controller, Get } from 'routing-controllers';
import * as striptags from 'striptags';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import fetch from 'node-fetch';
// @ts-ignore
import * as download from 'image-downloader';

import { Categories } from '../entities/Categories';
import { Content } from '../entities/Content';

type Category = {
  id: number,
  count: number,
  description: string,
  link: string,
  name: string,
  slug: string,
  taxonomy: string,
  parent: number,
  meta: [any],
  _links: {
    self: [{
      href: string
    }],
    collection: [{
      href: string
    }],
    about: [{
      href: string
    }],
    'wp:post_type': [{
      href: string
    } | any],
    curies: [{
      name: string,
      href: string,
      templated: boolean
    }]
  }
}[];

type Post = {
  id: number,
  date: string,
  date_gmt: string,
  guid: {
    rendered: string
  },
  modified: string,
  modified_gmt: string,
  slug: string,
  status: string,
  type: string,
  link: string,
  title: {
    rendered: string
  },
  content: {
    rendered: string,
    protected: boolean
  },
  excerpt: {
    rendered: string,
    protected: boolean
  },
  author: number,
  featured_media: number,
  comment_status: string,
  ping_status: string,
  sticky: boolean,
  template: string,
  format: string,
  meta: [],
  categories: [number],
  tags: [],
  _links: {
    self: [{
      href: string
    }],
    collection: [{
      href: string
    }],
    about: [{
      href: string
    }],
    author: [{
      embeddable: boolean,
      href: string
    }],
    replies: [{
      embeddable: boolean,
      href: string
    }],
    'version-history': [{
      count: number,
      href: string
    }],
    'wp:featuredmedia': [{
      embeddable: boolean,
      href: string
    }],
    'wp:attachment': [{
      href: string
    }],
    'wp:term': [{
      taxonomy: string,
      embeddable: boolean,
      href: string
    }],
    curies: [{
      name: string,
      href: string,
      templated: boolean
    }]
  }
}[];

type Media = {
  media_details: {
    width: number,
    height: number,
    file: string,
    sizes: {
      full: {
        file: string,
        width: number,
        height: number,
        mime_type: string,
        source_url: string
      }
    }
  }
}[];

@Controller()
export class NewScrapeController {
  @InjectRepository(Content)
  private contentRepository!: Repository<Content>;

  @InjectRepository(Categories)
  private categoryRepository!: Repository<Categories>;

  private apiUrl: string = 'https://www.landingfolio.com/wp-json/wp/v2/';

  @Get('/v2/scrape')
  public async getData() {
    const categoryRequest = await fetch(`${this.apiUrl}categories?per_page=100`);
    const categoryData: Category = await categoryRequest.json();

    try {
      categoryData.map(async (category) => {
        const searchCategory = await this.categoryRepository.findOne({
          wpId: category.id
        });

        if(!searchCategory) {
          const newCategory = await this.categoryRepository.create({
            category: category.slug,
            wpId: category.id
          });

          await this.categoryRepository.save(newCategory);
        }
      });

      const categories = await this.categoryRepository.find();

      try {
        categories.map(async (category, index) => {
          const postRequest = await fetch(`${this.apiUrl}posts?categories=${category.wpId}&per_page=100&page=1`);
          const postData: Post = await postRequest.json();

          console.log(`Scraping: ${this.apiUrl}posts?categories=${category.wpId}&per_page=100&page=1`);

          // @ts-ignore
          if(!postData || typeof postData.data !== 'undefined') {
            return false;
          }

          postData.map(async (post) => {
            try {
              const categoryArray: any = [];

              post.categories.map(async (category) => {
                try {
                  const currentCategory = await this.categoryRepository.findOne({
                    wpId: category
                  });

                  if(currentCategory) {
                    categoryArray.push(currentCategory);
                  }
                } catch(e) {
                  return false;
                }
              });

              const imageRequest = await fetch(post._links['wp:attachment'][0].href);
              const imageData: Media = await imageRequest.json();

              const searchPost = await this.contentRepository.findOne({
                title: striptags(post.title.rendered),
                description: striptags(post.content.rendered),
                url: striptags(''),
              });

              if(!searchPost) {
                const description = striptags(post.content.rendered).split('Like');

                const newContent = await this.contentRepository.create({
                  title: striptags(post.title.rendered),
                  description: description[0].length > 0 ? description[0] : 'Geen omschrijving beschikbaar',
                  image: imageData[0].media_details.sizes.full.source_url.toString(),
                  url: striptags(''),
                  date: post.modified,
                  categories: categoryArray
                });

                await this.contentRepository.save(newContent);
              }
            } catch(e) {
              return false;
            }
          })
        });

        return { success: true, message: 'All items have been scraped!' };
      } catch (e) {
        return { success: false, error: e };
      }
    } catch(e) {
      return { success: false, error: e };
    }
  }
}
