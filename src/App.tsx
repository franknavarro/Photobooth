import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FullScreen from './components/FullScreen';
import Home from './pages/Home';
import Print from './pages/Print';
import SelectStrip from './pages/SelectStrip';
import TakePictures from './pages/TakePictures';
import theme from './theme';

export type ReadyState = boolean | null;

const App = () => {
  const [ready, setReady] = useState<ReadyState>(null);

  useEffect(() => {
    if (ready === null) {
      window.photostrip.initialize().then((initialized) => {
        setReady(initialized);
      });
    }
  }, [ready]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FullScreen>
        <Router>
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
              <Home ready={ready} retry={() => setReady(null)} />
            </Route>
          </Switch>
        </Router>
      </FullScreen>
    </ThemeProvider>
  );
};

export default App;
