import { FC } from 'react';
import { iconSize } from './Home';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import FullScreen from '../components/FullScreen';
import Text from '../components/Text';

const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: iconSize,
  },
  text: {
    marginTop: theme.spacing(4),
  },
}));

interface ErrorMessageProps {
  retry: () => void;
  message: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ retry, message }) => {
  const classes = useStyles();
  return (
    <FullScreen>
      <ErrorIcon color="primary" className={classes.icon} />
      <Text className={classes.text}>{message}</Text>
      <Button color="primary" variant="contained" onClick={retry}>
        Retry
      </Button>
    </FullScreen>
  );
};

export default ErrorMessage;
