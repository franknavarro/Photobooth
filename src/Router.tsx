import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { FC } from 'react';
import Home from './pages/Home';
import Print from './pages/Print';
import SelectStrip from './pages/SelectStrip';
import TakePictures from './pages/TakePictures';

const Router: FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/print">
          <Print />
        </Route>
        <Route path="/selection">
          <SelectStrip />
        </Route>
        <Route path="/takePictures">
          <TakePictures />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
