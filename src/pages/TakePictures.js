import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import useCountDown from '../hooks/useCountDown';
import useLivePreview from '../hooks/useLivePreview';
import FlexBox from '../components/FlexBox';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  view: {
    width: `calc(100% - ${theme.spacing(5)}px)`,
    border: `${theme.spacing()}px solid white`,
    borderRadius: theme.spacing(3),
    backgroundColor: 'white',
  },
  photoPreview: {
    minHeight: '190px',
    width: '100%',
    margin: 0,
  },
  photo: {
    maxWidth: '100%',
    borderRadius: theme.spacing(3),
  },
}));

const COUNT_DOWN = 6;
const MAX_PHOTOS = 3;
const WAIT_SECONDS = 4;

const TakePictures = () => {
  const classes = useStyles();
  const history = useHistory();
  const [preview, run, setRun] = useLivePreview();
  const [count, resetCount] = useCountDown(COUNT_DOWN);
  const [photos, setPhotos] = useState([]);
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [photostripsMade, setPhotostripMade] = useState(null);

  const reset = useCallback(() => {
    resetCount(COUNT_DOWN);
    setRun(true);
  }, [resetCount, setRun]);

  const takePhoto = useCallback(async () => {
    setRun(false);
    setTakingPhoto(true);
    const image = await window.camera.takePhoto(photos.length);
    setPhotos([...photos, image]);
    setTakingPhoto(false);

    if (photos.length < MAX_PHOTOS - 1) {
      return setTimeout(reset, WAIT_SECONDS * 1000);
    }
  }, [photos, reset, setRun]);

  useEffect(() => {
    setRun(true);
  }, [setRun]);

  useEffect(() => {
    let timeout;
    if (!count && run) timeout = takePhoto();
    return () => clearTimeout(timeout);
  }, [count, run, takePhoto]);

  useEffect(() => {
    let timeout;
    const createStrips = async () => {
      const made = await window.photostrip.createStrips();
      setPhotostripMade(made);
    };
    if (photos.length === MAX_PHOTOS) {
      if (photostripsMade === null) createStrips();
      else if (photostripsMade) history.push('/selection');
    }
    return () => clearTimeout(timeout);
  }, [photos, history, photostripsMade]);

  return (
    <FullScreen>
      <FlexBox />
      {(preview && run) || !takingPhoto ? (
        <img
          src={`image://${run ? preview : photos[photos.length - 1]}`}
          className={classes.view}
          alt=""
        />
      ) : (
        <div className={classes.view} />
      )}
      <FlexText>
        {count === COUNT_DOWN
          ? 'Get Ready...'
          : count
          ? count
          : takingPhoto
          ? 'SNAP'
          : 'Looking Good!'}
      </FlexText>
      <Grid container spacing={3} className={classes.photoPreview}>
        {photos.map((photo, index) => {
          return (
            <Grid item xs={Math.floor(12 / MAX_PHOTOS)} key={index}>
              <img
                src={`image://${photo}`}
                alt={`${index + 1}`}
                className={classes.photo}
              />
            </Grid>
          );
        })}
      </Grid>
    </FullScreen>
  );
};

export default TakePictures;
