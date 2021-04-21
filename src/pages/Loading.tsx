import { FC } from 'react';
import { iconSize } from './Home';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FullScreen from '../components/FullScreen';
import Text from '../components/Text';

interface LoadingProps {
  text: string;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: iconSize,
  },
  text: {
    marginTop: theme.spacing(4),
  },
}));

const Loading: FC<LoadingProps> = ({ text }) => {
  const classes = useStyles();
  return (
    <FullScreen>
      <CircularProgress color="primary" size={iconSize} />
      {text && <Text className={classes.text}>{text}</Text>}
    </FullScreen>
  );
};

export default Loading;
