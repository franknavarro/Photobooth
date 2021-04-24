import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, FC } from 'react';
import { useHistory } from 'react-router-dom';
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

interface PrintProps {
  printerName: string;
  selectedStrip: string;
}

const Print: FC<PrintProps> = ({ printerName, selectedStrip }) => {
  const classes = useStyles();
  const history = useHistory();
  const [printing, setPrinting] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startPrint = async () => {
      try {
        if (!printerName) throw new Error('No printer specified.');
        if (!selectedStrip) throw new Error('No file found to print.');
        await window.printer.start(printerName, selectedStrip);
        setPrinting(1);
        setStarted(true);
      } catch (err) {
        console.error(err.message);
        setPrinting(0);
        setStarted(true);
      }
    };
    startPrint();
  }, [selectedStrip, printerName]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const getPrinterStatus = async () => {
      const status = await window.printer.status();
      if (status) setPrinting(printing + 1);
      else setPrinting(0);
    };

    if (printing && started) {
      timeout = setTimeout(getPrinterStatus, 500);
    } else if (!printing && started) {
      history.push('/');
    }

    return () => clearTimeout(timeout);
  }, [history, printing, started]);

  return (
    <FullScreen>
      <CircularProgress color="primary" size={iconSize} />
      <Text className={classes.text}>Printing...</Text>
    </FullScreen>
  );
};

export default Print;
