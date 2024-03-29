import { FC, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import PreviewSettings from './PreviewSettings';
import EventSettings from './EventSettings';
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
  const previewRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  return (
    <ThemeProvider theme={settingsTheme}>
      <CssBaseline />
      <Paper className={classes.root}>
        <SettingsAppBar />
        <SettingsNavigation
          list={[
            { name: 'Photostrip', ref: photostripRef },
            { name: 'Preview', ref: previewRef },
            { name: 'Printer', ref: printerRef },
            { name: 'Event', ref: eventRef },
            { name: 'Interface', ref: interfaceRef },
          ]}
        />
        <main className={classes.main}>
          <PhotostripSettings
            ref={photostripRef}
            settings={store.photostrip}
            className={classes.settingsSection}
          />
          <PreviewSettings
            ref={previewRef}
            className={classes.settingsSection}
          />
          <PrinterSettings
            ref={printerRef}
            settings={store.printer}
            className={classes.settingsSection}
          />
          <EventSettings
            ref={eventRef}
            settings={store.cloud}
            className={classes.settingsSection}
          />
          <InterfaceSettings
            ref={interfaceRef}
            settings={store.interface}
            className={classes.settingsSection}
          />
        </main>
      </Paper>
    </ThemeProvider>
  );
};

export default Settings;
