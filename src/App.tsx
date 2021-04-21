import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorMessage from './pages/ErrorMessage';
import FullScreen from './components/FullScreen';
import Loading from './pages/Loading';
import Router from './Router';
import theme from './theme';

const App = () => {
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const initializeApp = useCallback(async () => {
    try {
      await window.camera.initialize();
      await window.photostrip.initialize();
      setReady(true);
    } catch (err) {
      const messages = err.toString().split(':');
      messages.splice(1, 1);
      setError(messages.join(':'));
    }
  }, []);

  const reInitialize = () => {
    setReady(false);
    setError('');
  };

  useEffect(() => {
    if (!ready && !error) initializeApp();
  }, [ready, error, initializeApp]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FullScreen>
        {error ? (
          <ErrorMessage retry={reInitialize} message={error} />
        ) : ready ? (
          <Router />
        ) : (
          <Loading text="Getting photobooth ready..." />
        )}
      </FullScreen>
    </ThemeProvider>
  );
};

export default App;
