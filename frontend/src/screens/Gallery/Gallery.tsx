<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { useAsyncEffect } from 'use-async-effect';
=======
import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { Col, Container, Row, Spinner } from "reactstrap";
import { useAsyncEffect } from "use-async-effect";
>>>>>>> Stashed changes

import { Header } from "../../components/Header/Header";
import { Category } from "../../components/Category/Category";
import { ContentBox } from "../../components/ContentBox/ContentBox";

import "./Gallery.scss";

type Category = {
  success: boolean;
  total: number;
  categories: Categories;
};

type Categories = Array<{
  id: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}>;

type Content = {
  success: boolean;
  total: number;
  content: Contents;
};

type Contents = Array<{
  id: string;
  title: string;
  date: string;
  url: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categories: Categories;
}>;

export const Gallery = ({
  match: {
    params: { gallery }
  }
}: RouteComponentProps<{ gallery: string }>) => {
  const [categories, setCategories] = useState<Categories>([]);
  const [content, setContent] = useState<Contents>([]);
<<<<<<< Updated upstream
  const [favorites, setFavorites] = useState<string[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [showItems, setShowItems] = useState<number>(9);
=======
  const [favorites, setFavorites] = useState<string[]>(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
>>>>>>> Stashed changes

  useAsyncEffect(
    async () => {
      const response = await fetch(
        gallery
          ? `http://localhost:3001/api/categories/content/${gallery}`
          : "http://localhost:3001/api/content"
      );

      if (!gallery) {
        const categoryData = await fetch(
          "http://localhost:3001/api/categories"
        );
        const categoryJson = await categoryData.json();

        if (categoryJson.success) {
          setCategories(categoryJson.categories);
        }
      }

      const contentJson = (await response.json()) as Content;

      if (contentJson.success) {
        setContent(contentJson.content);
      }
    },
    () => setContent([]),
    [gallery]
  );

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <>
      <Header />
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
<<<<<<< Updated upstream
            <Col sm={12} md={{ size: 3, offset: 5 }}>
              <Spinner color="primary"/>
=======
            <Col>
              <Spinner color="primary" />
>>>>>>> Stashed changes
            </Col>
          ) : (
            <>
              <Row>
                <Col sm={12}>
                  <ul className="category-list">
                    <div className="category-item">
                      <li className="category-list-item">
                        <Link to="/gallery">Alle categorieën</Link>
                      </li>
                    </div>
                    {categories.map((data, index) => (
                      <Category
                        key={data.id}
                        uid={data.id}
                        name={data.category}
                        favorite={favorites.indexOf(data.id) !== -1}
                        setFavorite={(favorite, uid) =>
                          setFavorites(
                            !favorite
                              ? favorites.filter((id: string) => id !== uid)
                              : [...favorites, uid]
                          )
                        }
                      />
                    ))}
                  </ul>
                </Col>
              </Row>
              <div className="content">
                <Row>
                  {content.slice(0, showItems).map((data, index) => (
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
                      <div onClick={() => {
                        setShowItems(
                          showItems >= content.length ? showItems : showItems + 6
                        )
                      }} className="category-item" style={{ width: '100%', textAlign: 'center' }}>
                        <li className="category-list-item">
                          Laad meer
                        </li>
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
