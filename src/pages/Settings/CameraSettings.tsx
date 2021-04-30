import { forwardRef, useState, useCallback, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LivePreview from '../../components/LivePreview';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  cameraPreview: {
    display: 'flex',
    flexDirection: 'column',
  },
  stripPreview: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttons: {
    display: 'flex',
  },
  previewButton: {
    '&:not(:first-child)': {
      marginLeft: theme.spacing(2),
    },
    flex: 1,
    marginBottom: theme.spacing(3),
  },
  previewImage: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  previewBox: {
    flex: 1,
    height: '500px',
    textAlign: 'center',
  },
}));

interface CameraSettingsProps {
  className?: string;
}

const CameraSettings = forwardRef<HTMLDivElement, CameraSettingsProps>(
  ({ className }, ref) => {
    const classes = useStyles();
    const [run, setRun] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [sampleStrip, setSampleStrip] = useState<string>('');
    const [cameraRatio, setCameraRatio] = useState<ImageRatio>({
      width: 3,
      height: 2,
    });
    const [error, setError] = useState<string>('');
    const previewRef = useRef<HTMLDivElement>(null);

    const initialize = useCallback(
      async (callback: () => Promise<void> | void) => {
        try {
          setLoading(true);
          setRun(false);
          await window.camera.initialize();
          const ratio = await window.photostrip.initialize(
            window.store.store().photostrip,
          );
          setCameraRatio(ratio);
          await callback();
        } catch (err) {
          console.error(err);
          const messages = err.toString().split(':');
          messages.splice(1, 1);
          setError(messages.join(':'));
        } finally {
          setLoading(false);
          if (previewRef.current) {
            previewRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }
      },
      [],
    );

    const startCamera = useCallback(() => setRun(true), []);
    const getStrip = useCallback(async () => {
      if (sampleStrip) window.camera.deleteImg(sampleStrip);
      setSampleStrip('');
      const img = await window.camera.takePhoto();
      const sample = await window.photostrip.sampleStrip(img);
      window.camera.deleteImg(img);
      setSampleStrip(sample);
    }, [sampleStrip]);

    useEffect(() => {
      return () => {
        if (sampleStrip) window.camera.deleteImg(sampleStrip);
      };
    }, [sampleStrip]);

    const getPreview = () => {
      if (loading) return <CircularProgress color="primary" />;
      else if (error) return <Typography>{error}</Typography>;
      else if (run) {
        return (
          <LivePreview ratio={cameraRatio} run={run && !loading} hide={!run} />
        );
      } else if (sampleStrip) {
        return (
          <img
            className={classes.previewImage}
            src={`image://${sampleStrip}`}
            alt="sample photostrip"
          />
        );
      }
    };

    return (
      <div ref={ref} className={clsx(className)}>
        <Typography variant="h4">Camera</Typography>
        <div className={classes.cameraPreview}>
          <div className={classes.buttons}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => (run ? setRun(false) : initialize(startCamera))}
              disabled={loading}
              className={classes.previewButton}
            >
              {!run ? 'Start Camera Preview' : 'Stop Camera Preview'}
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => initialize(getStrip)}
              disabled={loading}
              className={classes.previewButton}
            >
              Generate Sample Strip
            </Button>
          </div>
          <div className={classes.previewBox} ref={previewRef}>
            {getPreview()}
          </div>
        </div>
      </div>
    );
  },
);

export default CameraSettings;
