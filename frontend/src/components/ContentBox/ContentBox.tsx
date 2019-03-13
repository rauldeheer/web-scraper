import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons'

import { BannerImage } from '../BannerImage/BannerImage';
import { Title } from '../Title/Title';

type Props = {
  uid: string,
  image: string,
  imageAlt: string,
  title: string,
  date: string,
  url: string,
  description: string
};

export const ContentBox = ({ uid, image, imageAlt, title, date, description }: Props) => (
  <Col sm={12} md={4}>
    <Link to={`/content/${uid}`} className="wrapper">
      <BannerImage src={image} alt={imageAlt}/>
      <div className="description">
        <Title text={title}/>
        <div className="date">
          <p><FontAwesomeIcon icon={faClock}/>{date}</p>
        </div>
        <div className="subtitle">
          <p>{description}</p>
        </div>
      </div>
    </Link>
  </Col>
);
