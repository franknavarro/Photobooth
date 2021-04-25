import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Text from '../../components/Text';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const SettingsAppBar: FC = () => {
  const history = useHistory();
  const classes = useStyles();

  const closeSettings = () => {
    history.push('/');
  };

  return (
    <AppBar position="sticky" className={classes.appBar}>
      <Paper>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="close settings"
            edge="start"
            onClick={closeSettings}
          >
            <CloseRoundedIcon />
          </IconButton>
          <Text variant="h6">Settings</Text>
        </Toolbar>
      </Paper>
    </AppBar>
  );
};

export default SettingsAppBar;
