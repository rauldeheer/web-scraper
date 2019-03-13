import React from 'react';

import './BannerImage.scss';

type Props = {
  src: string,
  alt: string
};

export const BannerImage = ({ src, alt }: Props) => (
  <div className="banner">
    <img src={src} alt={alt} className="banner-image"/>
  </div>
);
