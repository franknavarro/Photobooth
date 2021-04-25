import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Text from '../../components/Text';
import Toolbar from '@material-ui/core/Toolbar';

const SettingsAppBar: FC = () => {
  const history = useHistory();
  const closeSettings = () => {
    history.push('/');
  };
  return (
    <AppBar position="sticky">
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
