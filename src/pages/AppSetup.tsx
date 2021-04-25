import { FC, useState, useCallback, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';
import MainApp from './MainApp';
import theme from '../theme';
import useStore from '../hooks/useStore';

const AppSetup: FC = () => {
  const store = useStore();
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const initializeApp = useCallback(async () => {
    try {
      await window.camera.initialize();
      await window.photostrip.initialize(
        store.photostrip.stripImage,
        store.photostrip.borders,
        store.photostrip.stripSize,
      );
      setReady(true);
    } catch (err) {
      const messages = err.toString().split(':');
      messages.splice(1, 1);
      setError(messages.join(':'));
    }
  }, [store]);

  useEffect(() => {
    if (!ready && !error) initializeApp();
  }, [ready, error, initializeApp]);

  const reInitialize = () => {
    setReady(false);
    setError('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {error ? (
        <ErrorMessage retry={reInitialize} message={error} />
      ) : ready ? (
        <MainApp store={store} />
      ) : (
        <Loading text="Getting photobooth ready..." />
      )}
    </ThemeProvider>
  );
};

export default AppSetup;
