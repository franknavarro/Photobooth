import { makeStyles } from '@material-ui/core/styles';
import {
  useEffect,
  useState,
  useCallback,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';
import { useHistory } from 'react-router-dom';
import { PhotostripList } from '../Router';
import useCountDown from '../hooks/useCountDown';
import useLivePreview from '../hooks/useLivePreview';
import FlexBox from '../components/FlexBox';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';
import Grid, { GridSize } from '@material-ui/core/Grid';

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

interface TakePicturesProps {
  photostrips: PhotostripList;
  setPhotostrips: Dispatch<SetStateAction<PhotostripList>>;
}

const TakePictures: FC<TakePicturesProps> = ({
  photostrips,
  setPhotostrips,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [preview, run, setRun] = useLivePreview();
  const [count, resetCount] = useCountDown(COUNT_DOWN);
  const [photos, setPhotos] = useState<string[]>([]);
  const [takingPhoto, setTakingPhoto] = useState<boolean>(false);
  const gridSize = Math.round(12 / MAX_PHOTOS) as GridSize;

  const reset = useCallback((): void => {
    resetCount(COUNT_DOWN);
    setRun(true);
  }, [resetCount, setRun]);

  const takePhoto = useCallback(async (): Promise<ReturnType<
    typeof setTimeout
  > | void> => {
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
    let timeout: ReturnType<typeof setTimeout>;
    if (!count && run) {
      takePhoto().then((t) => {
        if (t) timeout = t;
      });
    }
    return () => clearTimeout(timeout);
  }, [count, run, takePhoto]);

  // Generate Photostrips
  useEffect(() => {
    const createStrips = async () => {
      const stripData = await window.photostrip.createStrips();
      setPhotostrips([...stripData]);
      history.push('/selection');
    };
    if (photos.length === MAX_PHOTOS && photostrips.length === 0) {
      createStrips();
    } else if (photos.length === 0 && photostrips.length !== 0) {
      setPhotostrips([]);
    }
  }, [photos, history, photostrips, setPhotostrips]);

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
            <Grid item xs={gridSize} key={index}>
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
