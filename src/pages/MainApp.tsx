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
  ratio: ImageRatio;
}

const MainApp: FC<MainAppProps> = ({ store, ratio }) => {
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
          adjustLeftCut={store.printer.adjustLeftCut}
          adjustRightCut={store.printer.adjustRightCut}
          cloudSettings={store.cloud}
          countTime={store.interface.countTime}
          initialCount={store.interface.initialCount}
          maxPhotos={store.photostrip.maxPhotos}
          photoPreview={store.interface.photoPreview}
          photostrips={photostrips}
          printerName={store.printer.printerName}
          ratio={ratio}
          setPhotostrips={setPhotostrips}
          waitTime={store.interface.waitTime}
        />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default MainApp;
