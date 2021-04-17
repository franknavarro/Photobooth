import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import FullScreen from '../components/FullScreen';
import Text from '../components/Text';

const iconSize = '7rem';
const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: iconSize,
  },
  text: {
    marginTop: theme.spacing(4),
  },
}));

const Print = () => {
  const classes = useStyles();
  const history = useHistory();
  const file = new URLSearchParams(useLocation().search).get('file');
  const [printing, setPrinting] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    window.printer.start(file).then(() => {
      setPrinting(true);
      setStarted(1);
    });
  }, [file]);

  useEffect(() => {
    let timeout;
    if (printing && started) {
      timeout = setTimeout(() => {
        window.printer.status().then((status) => {
          if (status) setPrinting(printing + 1);
          else setPrinting(0);
        });
      }, 1000);
    } else if (!printing && started) {
      history.push('/');
    }
    return () => clearTimeout(timeout);
  }, [history, printing, started]);

  return (
    <FullScreen>
      <CircularProgress color="primary" size={iconSize} />
      <Text className={classes.text}>Printing... {file}</Text>
    </FullScreen>
  );
};

export default Print;
