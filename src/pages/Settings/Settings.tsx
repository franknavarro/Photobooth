import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import SettingsAppBar from './SettingsAppBar';
import settingsTheme from './settingsTheme';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '100%',
  },
  main: {
    flex: 1,
  },
});

interface SettingsProps {
  store: PhotoboothStore;
}

const Settings: FC<SettingsProps> = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={settingsTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <SettingsAppBar />
        <div className={classes.main}>Settings Page</div>
      </div>
    </ThemeProvider>
  );
};

export default Settings;
