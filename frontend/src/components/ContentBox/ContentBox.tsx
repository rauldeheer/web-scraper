import React from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import { BannerImage } from "../BannerImage/BannerImage";
import { Title } from "../Title/Title";

type Categories = Array<{
  id: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}>;

import './ContentBox.scss';

type Props = {
  uid: string;
  image: string;
  imageAlt: string;
  title: string;
  date: string;
  url: string;
  description: string;
  categories: Categories;
};

export const ContentBox = ({
  uid,
  image,
  imageAlt,
  title,
  date,
  description,
  categories
}: Props) => (
  <Col sm={12} md={4}>
    <Link to={`/content/${uid}`} className="wrapper">
      <BannerImage src={image} alt={imageAlt} />
      <div className="description">
        <Title text={title} />
        <div className="date">
          <p>
            <FontAwesomeIcon icon={faClock} />{" "}
            {new Date(date).toLocaleDateString()}
          </p>
        </div>
        <div className="subtitleContent">
          <p>{description}</p>
        </div>
        <div className="detail-categorie-wrapper">
          {categories &&
            categories.map((category, index) => (
              <span className="label label-default" key={index}>
                {category.category.charAt(0).toUpperCase() +
                  category.category.slice(1)}
              </span>
            ))}
        </div>
      </div>
    </Link>
  </Col>
);
