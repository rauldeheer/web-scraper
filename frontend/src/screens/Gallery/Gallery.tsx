import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { useAsyncEffect } from 'use-async-effect';
import { Category } from '../../components/Category/Category';
import { ContentBox } from '../../components/ContentBox/ContentBox';
import { ReactComponent as NoFavorites } from '../../images/no-favorites.svg';

import { Header } from '../../components/Header/Header';

import './Gallery.scss';

type Category = {
  success: boolean,
  total: number,
  categories: Categories
};

type Categories = Array<{
  id: string,
  category: string,
  createdAt: string,
  updatedAt: string,
}>;

type Content = {
  success: boolean,
  total: number,
  category: string,
  content: Contents
};

type Contents = Array<{
  id: string,
  title: string,
  date: string,
  url: string,
  image: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  categories: Categories
}>;

export const Gallery = ({ match: { params: { gallery } } }: RouteComponentProps<{ gallery: string }>) => {
  const [ categories, setCategories ] = useState<Categories>([]);
  const [ content, setContent ] = useState<Contents>([]);
  const [ showItems, setShowItems ] = useState<number>(9);
  const [ showCategories, setShowCategories ] = useState<number>(6);
  const [ currentCategory, setCurrentCategory ] = useState<string>('');
  const [ favoriteContent, setFavoriteContent ] = useState<Contents>([]);
  const [ favorites, setFavorites ] = useState<string[]>(
    JSON.parse(localStorage.getItem('favorites') || '[]'),
  );

  useAsyncEffect(async () => {
      const response = await fetch(gallery ? `http://62.75.171.162/api/categories/content/${gallery}` : 'http://62.75.171.162/api/content');

      const categoryData = await fetch('http://62.75.171.162/api/categories');
      const categoryJson = await categoryData.json();

      if ( categoryJson.success ) {
        setCategories(categoryJson.categories);
      }

      const contentJson = (await response.json()) as Content;

      if ( contentJson.success ) {
        setCurrentCategory(contentJson.category);
        setContent(contentJson.content);
      }
    },
    () => {
      setContent([]);
      setCurrentCategory('');
    },
    [ gallery ],
  );

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [ favorites ]);

  useAsyncEffect(async () => {
    if ( favorites.length > 0 ) {
      const randomFavorite = favorites[ Math.floor(Math.random() * favorites.length) ];
      const response = await fetch(`http://62.75.171.162/api/categories/content/${randomFavorite}`);

      const contentJson = (await response.json()) as Content;
      let currentIndex = contentJson.content.length;

      while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        const temporaryValue = contentJson.content[currentIndex];
        contentJson.content[currentIndex] = contentJson.content[randomIndex];
        contentJson.content[randomIndex] = temporaryValue;
      }

      if ( contentJson.success ) {
        setFavoriteContent(contentJson.content.slice(0, 3));
      }
    }
  }, () => {
    setFavoriteContent([]);
  }, [ favorites, gallery ]);

  return (
    <>
      <Header/>
      <div className="content">
        <Container>
          <Row>
            <Col sm={12}>
              <h1 className="title">Social Media Ondernemer Inspiratie tool</h1>
              <h4 className="subtitle">
                Ga aan de slag en laat je inspireren door meer dan 1000
                verschillende landingspagina's
              </h4>
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
                    <div className="category-item" style={{ backgroundColor: !gallery ? '#ff4470' : '' }}>
                      <li className="category-list-item">
                        <Link to="/gallery">Alle categorieën</Link>
                      </li>
                    </div>
                    {categories.slice(0, showCategories).map((
                      data,
                      index,
                    ) => (
                      <Category
                        key={data.id}
                        uid={data.id}
                        name={data.category}
                        favorite={favorites.indexOf(data.id) !== -1}
                        setFavorite={(
                          favorite,
                          uid,
                        ) => setFavorites(!favorite ? favorites.filter((id: string) => id !== uid) : [
                          ...favorites,
                          uid,
                        ])}
                        isActive={gallery === data.id}
                      />
                    ))}
                    <div className="category-item">
                      <li className="category-list-item">
                        <a onClick={() => setShowCategories(showCategories !== 6 ? 6 : categories.length)}>{showCategories !== 6 ? 'Minder...' : 'Meer...'}</a>
                      </li>
                    </div>
                  </ul>
                </Col>
              </Row>
              {!favorites.length ? (
                <div className="fav-empty">
                  <Row>
                    <Col sm={12}>
                      <h3 className="favorite-title">Speciaal voor jou</h3>
                      <div className="fav-empty-wrapper">
                        <div className="empty-illustration">
                          <NoFavorites/>
                        </div>
                        <h4 className="fav-empty-title">Je hebt nog geen favorieten gekozen, klik op het hart icoontje
                          bij een categorie om hem op te slaan bij je favorieten.</h4>
                        <div className="fav-devider"/>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div className="favorite">
                  <Row>
                    <Col sm={12}>
                      <h3 className="favorite-title">Speciaal voor jou</h3>
                      <p className="favorite-subtitle">Deze templates worden getoont op basis van jouw gekozen
                        categorien.</p>
                    </Col>
                  </Row>
                  <Row>
                    {favoriteContent.map((
                      data,
                      index,
                    ) => (
                      <ContentBox
                        key={index}
                        uid={data.id}
                        image={data.image}
                        imageAlt={data.title.toLowerCase()}
                        title={data.title}
                        date={data.date}
                        url={data.url}
                        description={data.description}
                        categories={data.categories}
                      />
                    ))}
                  </Row>
                </div>
              )}
              <div className="content">
                <Row>
                  <Col sm={12}>
                    <h3
                      className="favorite-title">{gallery ? currentCategory && currentCategory.toString().charAt(0).toUpperCase() + currentCategory.toString().slice(1) : 'Alle categorieën'}</h3>
                  </Col>
                </Row>
                <Row>
                  {content.slice(0, showItems).map((
                    data,
                    index,
                  ) => (
                    <ContentBox
                      key={index}
                      uid={data.id}
                      image={data.image}
                      imageAlt={data.title.toLowerCase()}
                      title={data.title}
                      date={data.date}
                      url={data.url}
                      description={data.description}
                      categories={data.categories}
                    />
                  ))}
                </Row>
                {content.length > showItems && (
                  <Row>
                    <Col sm={12} md={{ size: 3, offset: 5 }}>
                      <div
                        onClick={() => {
                          setShowItems(
                            showItems >= content.length
                              ? showItems
                              : showItems + 6,
                          );
                        }}
                        className="category-item"
                        style={{ width: '100%', textAlign: 'center' }}
                      >
                        <li className="category-list-item">Laad meer</li>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            </>
          )}
        </Container>
      </div>
    </>
  );
};
