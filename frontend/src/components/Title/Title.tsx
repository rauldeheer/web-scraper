import React from 'react';

import './Title.scss';

type Props = {
  text: string,
  badge?: boolean,
  badgeCount?: number
};

export const Title = ({ text, badge, badgeCount }: Props) => (
  <div className="title">
    <p>{text} {badge && (<span className="badge">{badgeCount}</span>)}</p>
  </div>
);
