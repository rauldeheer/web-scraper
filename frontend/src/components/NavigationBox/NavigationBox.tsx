import React from 'react';
import { Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import { Title } from '../Title/Title';
import { BannerImage } from '../BannerImage/BannerImage';

import './NavigationBox.scss';

type Props = {
  title: string,
  text: string,
  imageSource: string,
  imageAlt: string,
  badge?: boolean,
  badgeCount?: number
};

export const NavigationBox = ({ title, text, badge, badgeCount, imageSource, imageAlt }: Props) => (
  <Col sm={12} md={4}>
    <Link to="/gallery" className="wrapper">
      <BannerImage src={imageSource} alt={imageAlt}/>
      <div className="description">
        <Title text={title} badge={badge} badgeCount={badgeCount}/>
        <div className="sub">
          <p>{text}</p>
        </div>
      </div>
    </Link>
  </Col>
);
