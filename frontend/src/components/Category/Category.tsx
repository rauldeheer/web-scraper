import React from 'react';
import { Link } from 'react-router-dom';

import './Category.scss';

type Props = {
  uid: string,
  name: string
};

export const Category = ({ uid, name }: Props) => <li className="category-item"><Link to={`/category/${uid}`}>{name}</Link></li>;
