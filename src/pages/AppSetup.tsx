import { FC, useState, useCallback, useEffect, useRef } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';
import MainApp from './MainApp';
import useStore from '../hooks/useStore';

const AppSetup: FC = () => {
  const store = useStore();
  const [ready, setReady] = useState<boolean>(false);
  const [cameraRatio, setCameraRatio] = useState<ImageRatio>({
    width: 3,
    height: 2,
  });
  const [error, setError] = useState<string>('');
  const theme = useRef(
    createMuiTheme({
      palette: {
        primary: {
          main: store.interface.secondaryColor,
        },
        background: {
          default: store.interface.primaryColor,
        },
      },
    }),
  );

  const initializeApp = useCallback(async () => {
    try {
      await window.camera.initialize();
      const ratio = await window.photostrip.initialize(store.photostrip);
      setCameraRatio(ratio);
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
    <ThemeProvider theme={theme.current}>
      <CssBaseline />
      {error ? (
        <ErrorMessage retry={reInitialize} message={error} />
      ) : ready ? (
        <MainApp store={store} ratio={cameraRatio} />
      ) : (
        <Loading text="Getting photobooth ready..." />
      )}
    </ThemeProvider>
  );
};

export default AppSetup;
