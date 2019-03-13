import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from '../Home/Home';
import { Gallery } from '../Gallery/Gallery';

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={props => <Home {...props}/>}/>
        <Route exact path="/gallery" render={props => <Gallery/>}/>
      </Switch>
    </BrowserRouter>
  );
};
