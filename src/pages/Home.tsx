import { makeStyles } from '@material-ui/core/styles';
import { FC } from 'react';
import { useHistory } from 'react-router-dom';
import CameraAltRoundedIcon from '@material-ui/icons/CameraAltRounded';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';

export const iconSize = '13rem';
const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: iconSize,
  },
  readyText: {
    marginTop: theme.spacing(4),
  },
}));

const Home: FC = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <FullScreen onClick={() => history.push('/takePictures')}>
      <FlexText>Photobooth</FlexText>
      <FlexText>
        <CameraAltRoundedIcon color="primary" className={classes.icon} />
      </FlexText>
      <FlexText>Touch Any Where To Start</FlexText>
    </FullScreen>
  );
};

export default Home;
