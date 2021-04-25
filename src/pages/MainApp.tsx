import { Switch, Route, useHistory } from 'react-router-dom';
import { FC, useState, useEffect } from 'react';
import Home from './Home';
import Print from './Print';
import SelectStrip from './SelectStrip';
import TakePictures from './TakePictures';

interface PhotostripData {
  path: string;
  description: string;
}
export type PhotostripList = PhotostripData[];

interface MainAppProps {
  store: PhotoboothStore;
}

const MainApp: FC<MainAppProps> = ({ store }) => {
  const history = useHistory();
  const [photostrips, setPhotostrips] = useState<PhotostripList>([]);
  const [selectedStrip, setSelectedStrip] = useState<string>('');

  useEffect(() => {
    const openSettings = ({ key }: KeyboardEvent) => {
      if (key === 's') history.push('/settings');
    };
    window.addEventListener('keyup', openSettings);
    return () => window.removeEventListener('keyup', openSettings);
  }, [history]);

  return (
    <Switch>
      <Route path="/print">
        <Print
          printerName={store.printer.printerName}
          selectedStrip={selectedStrip}
        />
      </Route>
      <Route path="/selection">
        <SelectStrip
          photostrips={photostrips}
          setSelectedStrip={setSelectedStrip}
        />
      </Route>
      <Route path="/takePictures">
        <TakePictures
          initialCount={store.interface.initialCount}
          countTime={store.interface.countTime}
          waitTime={store.interface.waitTime}
          maxPhotos={store.photostrip.maxPhotos}
          photostrips={photostrips}
          setPhotostrips={setPhotostrips}
        />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default MainApp;