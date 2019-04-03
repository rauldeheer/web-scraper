import { faArrowLeft, faClock, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Col, Container, Row, Spinner } from 'reactstrap';
import { useAsyncEffect } from 'use-async-effect';

import { Header } from '../../components/Header/Header';

import './Single.scss';

type Content = {
  createdAt: string,
  date: string,
  description: string,
  id: string,
  image: string,
  title: string,
  updatedAt: string,
  url: string,
  categories: [{
    category: string,
    id: string
  }]
};

export const Single = ({ match: { params: { content } } }: RouteComponentProps<{ content: string }>) => {
  const [contentData, setContent] = useState<Content>();
  const [randomData, setRandomData] = useState<Content[]>();

  useAsyncEffect(async () => {
    const response = await fetch(`http://62.75.171.162/api/content/${content}`);
    const randomResponse = await fetch('http://62.75.171.162/api/content/random');
    const data = await response.json();
    const randomData = await randomResponse.json();

    if (data.success && randomData.success) {
      setContent(data.content);
      setRandomData(randomData.content)
    }
  }, () => {
    // @ts-ignore
    setContent('');
    // @ts-ignore
    setRandomData('');
  }, [content]);

  return (
    <>
      <Header/>
      <div className="content">
        <Container>
          {contentData && randomData ? (
            <>
              <Row>
                <Col xs={12}>
                  <div className="back-btn">
                    <Link to="/gallery" className="dark-btn">
                  <span className="label label-button">
                    <FontAwesomeIcon icon={faArrowLeft}/>
                    Overzicht
                  </span>
                    </Link>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={8}>
                  <div className="banner-img-wrapper">
                    <img src={contentData.image} alt={contentData.title}/>
                  </div>
                </Col>
                <Col sm={12} md={4}>
                  <div className="info-wrapper">
                    <h1 className="detail-title">{contentData.title}</h1>
                    <p className="detail-description">{contentData.description}</p>
                    <div className="landingpage-date">
                      <p><FontAwesomeIcon icon={faClock}/> {new Date(contentData.date).toLocaleDateString()}</p>
                    </div>
                    <div className="landingpage-link">
                      <a className="btn-dark" href="https://adpage.io" target="_blank">
                        <span className="label label-button"><FontAwesomeIcon icon={faDesktop}/> Direct aan de slag</span>
                      </a>
                    </div>
                  </div>
                  <div className="info-wrapper">
                    <h2 className="detail-element-title">Landingspagina info</h2>
                    <span className="color-title">Categorieën</span>
                    <div className="detail-categorie-wrapper">
                      {contentData.categories.map((category, index) => (
                          <Link to={`/gallery/${category.id}`} key={index}>
                            <span className="label label-default">{category.category.charAt(0).toUpperCase() + category.category.slice(1)}</span>
                          </Link>
                      ))}
                    </div>
                  </div>
                  <div className="referals-wrapper">
                    <h2 className="referal-title">Misschien vind je deze ook leuk.</h2>
                    <Row>
                      {randomData.map((content, index) => (
                        <Col xs={6} key={index}>
                          <div className="referal-img-wrapper">
                            <Link to={`/content/${content.id}`}>
                              <img src={content.image} alt={content.title}/>
                            </Link>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <Col sm={12} md={{ size: 3, offset: 5 }}>
              <Spinner color="primary"/>
            </Col>
          )}
        </Container>
      </div>
    </>
  );
};
