import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { ReadyState } from '../App';
import Button from '@material-ui/core/Button';
import CameraAltRoundedIcon from '@material-ui/icons/CameraAltRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorIcon from '@material-ui/icons/Error';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';
import Text from '../components/Text';

const iconSize = '7rem';
const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: iconSize,
  },
  readyText: {
    marginTop: theme.spacing(4),
  },
}));

interface HomeProps {
  ready: ReadyState;
  retry: () => void;
}

const Home: FC<HomeProps> = ({ ready, retry }) => {
  const classes = useStyles();
  const history = useHistory();
  if (ready) {
    return (
      <FullScreen onClick={() => history.push('/takePictures')}>
        <FlexText>Photobooth</FlexText>
        <FlexText>
          <CameraAltRoundedIcon color="primary" className={classes.icon} />
        </FlexText>
        <FlexText>Touch Any Where To Start</FlexText>
      </FullScreen>
    );
  } else if (ready === null) {
    return (
      <FullScreen>
        <CircularProgress color="primary" size={iconSize} />
        <Text className={classes.readyText}>Getting App Ready...</Text>
      </FullScreen>
    );
  }
  return (
    <FullScreen>
      <ErrorIcon color="primary" className={classes.icon} />
      <Text className={classes.readyText}>Camera Failed to Initialize...</Text>
      <Button color="primary" variant="contained" onClick={retry}>
        Retry
      </Button>
    </FullScreen>
  );
};

export default Home;
