import { FC, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CameraSettings from './CameraSettings';
import CssBaseline from '@material-ui/core/CssBaseline';
import InterfaceSettings from './InterfaceSettings';
import Paper from '@material-ui/core/Paper';
import PhotostripSettings from './PhotostripSettings';
import PrinterSettings from './PrinterSettings';
import SettingsAppBar from './SettingsAppBar';
import SettingsNavigation, { drawerWidth } from './SettingsNavigation';
import settingsTheme from './settingsTheme';
import useStore from '../../hooks/useStore';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
  },
  main: {
    flex: 1,
    marginLeft: drawerWidth,
    padding: theme.spacing(3),
  },
  settingsSection: {
    scrollMarginTop: `${theme.mixins.toolbar.minHeight}px`,
  },
}));

const Settings: FC = () => {
  const classes = useStyles();
  const store = useStore();

  const photostripRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const printerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={settingsTheme}>
      <CssBaseline />
      <Paper className={classes.root}>
        <SettingsAppBar />
        <SettingsNavigation
          list={[
            { name: 'Photostrip', ref: photostripRef },
            { name: 'Interface', ref: interfaceRef },
            { name: 'Printer', ref: printerRef },
            { name: 'Camera', ref: cameraRef },
          ]}
        />
        <main className={classes.main}>
          <PhotostripSettings
            ref={photostripRef}
            settings={store.photostrip}
            className={classes.settingsSection}
          />
          <InterfaceSettings
            ref={interfaceRef}
            settings={store.interface}
            className={classes.settingsSection}
          />
          <PrinterSettings
            ref={printerRef}
            settings={store.printer}
            className={classes.settingsSection}
          />
          <CameraSettings ref={cameraRef} className={classes.settingsSection} />
        </main>
      </Paper>
    </ThemeProvider>
  );
};

export default Settings;
