import React from 'react';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import './Category.scss';

type Props = {
  uid: string,
  name: string,
  favorite: boolean,
  setFavorite: (favorite: boolean, uid: string) => void
};

export const Category = ({ uid, name, favorite, setFavorite }: Props) => {
  return (
    <>
      <li className="category-item">
        <Link to={`/gallery/${uid}`}>{name}</Link>
      </li>
      <button onClick={() => setFavorite(!favorite, uid)}>
        <FontAwesomeIcon icon={faHeart} color={favorite ? 'red' : 'black'}/>
      </button>
    </>
  )
};
