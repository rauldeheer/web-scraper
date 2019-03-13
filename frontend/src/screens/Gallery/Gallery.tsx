import React, { useState, useRef } from 'react';
import { RouteComponentProps } from 'react-router';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { useAsyncEffect } from 'use-async-effect';

import { Header } from '../../components/Header/Header';
import { Category } from '../../components/Category/Category';
import { ContentBox } from '../../components/ContentBox/ContentBox';

import './Gallery.scss';

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

export const Gallery = ({ match }: RouteComponentProps<{ gallery: string }>) => {
  const [categories, setCategories] = useState([] as Categories);
  const [content, setContent] = useState([] as ContentArray);
  const isInitialMount = useRef(true);

  let contentData: Response;

  useAsyncEffect(async () => {
    if (match.params.gallery) {
      contentData = await fetch(`http://localhost:3001/api/categories/content/${match.params.gallery}`);
    } else {
      contentData = await fetch('http://localhost:3001/api/content');
    }

    let categoryData: Response;
    let categoryJson: Category;

    if (!match.params.gallery || isInitialMount) {
      categoryData = await fetch('http://localhost:3001/api/categories');
      categoryJson = await categoryData.json();

      if (categoryJson.success) {
        setCategories(categoryJson.categories);
      }
    }

    const contentJson: Content = await contentData.json();

    if (contentJson.success) {
      setContent(contentJson.content);
    }
  }, () => {
    setContent([]);
  }, [match.params.gallery]);

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
