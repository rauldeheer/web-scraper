import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from '../Home/Home';
import { Gallery } from '../Gallery/Gallery';
import { Single } from '../Single/Single';

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={props => <Home {...props}/>}/>
        <Route exact path="/gallery/:gallery?" render={props => <Gallery {...props}/>}/>
        <Route exact path="/content/:content" render={props => <Single {...props}/>}/>
      </Switch>
    </BrowserRouter>
  );
};
