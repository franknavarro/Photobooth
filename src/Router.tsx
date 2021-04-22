import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { FC, useState } from 'react';
import Home from './pages/Home';
import Print from './pages/Print';
import SelectStrip from './pages/SelectStrip';
import TakePictures from './pages/TakePictures';

interface PhotostripData {
  path: string;
  description: string;
}
export type PhotostripList = PhotostripData[];

const Router: FC = () => {
  const [photostrips, setPhotostrips] = useState<PhotostripList>([]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/print">
          <Print />
        </Route>
        <Route path="/selection">
          <SelectStrip photostrips={photostrips} />
        </Route>
        <Route path="/takePictures">
          <TakePictures
            photostrips={photostrips}
            setPhotostrips={setPhotostrips}
          />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
