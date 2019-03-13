import React, { FunctionComponent, useState } from 'react';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { useAsyncEffect } from 'use-async-effect';

import { Header } from '../../components/Header/Header';
import { Category } from '../../components/Category/Category';

import './Gallery.scss';
import { ContentBox } from '../../components/ContentBox/ContentBox';

type Category = {
  success: boolean,
  total: number,
  categories: Categories
};

type Categories = {
  id: string,
  category: string,
  createdAt: string,
  updatedAt: string
}[];

type Content = {
  success: boolean,
  total: number,
  content: ContentArray
};

type ContentArray = {
  id: string,
  title: string,
  date: string,
  url: string,
  image: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  categories: Categories
}[];

export const Gallery: FunctionComponent<{ initialCategory?: Categories, initialContent?: ContentArray }> = ({ initialCategory = [], initialContent = [] }) => {
  const [categories, setCategories] = useState(initialCategory);
  const [content, setContent] = useState(initialContent);

  useAsyncEffect(async () => {
    const categoryData: Response = await fetch('http://localhost:3001/api/categories');
    const contentData: Response = await fetch('http://localhost:3001/api/content');

    const contentJson: Content = await contentData.json();
    const categoryJson: Category = await categoryData.json();

    if (categoryJson.success) {
      setCategories(categoryJson.categories);
    }

    if (contentJson.success) {
      setContent(contentJson.content);
    }
  }, () => {
    setCategories([]);
    setContent([]);
  }, []);

  return (
    <>
      <Header/>
      <div className="content">
        <Container>
          <Row>
            <Col sm={12}>
              <h1 className="title">Social Media Ondernemer Inspiratie tool</h1>
              <h4 className="subtitle">Ga aan de slag en laat je inspireren door meer dan 1000 verschillende
                landingspagina's</h4>
            </Col>
          </Row>
          {!categories || !content ? (
            <Col>
              <Spinner color="primary"/>
            </Col>
          ) : (
            <>
              <Row>
                <Col sm={12}>
                  <ul className="category-list">
                    {categories.map((data, index) => (
                      <Category key={index} name={data.category} uid={data.id}/>
                    ))}
                  </ul>
                </Col>
              </Row>
              <div className="content">
                <Row>
                  {content.map((data, index) => {
                    const alt = data.title.toLowerCase();

                    return (
                      <ContentBox
                        key={index}
                        uid={data.id}
                        image={data.image}
                        imageAlt={alt}
                        title={data.title}
                        date={data.date}
                        url={data.url}
                        description={data.description}
                      />
                    );
                  })}
                </Row>
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};
