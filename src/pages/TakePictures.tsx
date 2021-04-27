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
import { PhotostripList } from './MainApp';
import useCountDown from '../hooks/useCountDown';
import useLivePreview from '../hooks/useLivePreview';
import FlexBox from '../components/FlexBox';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';
import Grid, { GridSize } from '@material-ui/core/Grid';
import ResponsiveImage from '../components/ResponsiveImage';

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

interface TakePicturesProps {
  initialCount: PhotoboothStore['interface']['initialCount'];
  countTime: PhotoboothStore['interface']['countTime'];
  waitTime: PhotoboothStore['interface']['waitTime'];
  maxPhotos: PhotoboothStore['photostrip']['maxPhotos'];
  photostrips: PhotostripList;
  setPhotostrips: Dispatch<SetStateAction<PhotostripList>>;
}

const TakePictures: FC<TakePicturesProps> = ({
  initialCount,
  countTime,
  waitTime,
  maxPhotos,
  photostrips,
  setPhotostrips,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [preview, run, setRun] = useLivePreview();
  const [count, resetCount] = useCountDown(initialCount);
  const [photos, setPhotos] = useState<string[]>([]);
  const [takingPhoto, setTakingPhoto] = useState<boolean>(false);
  const gridSize = Math.round(12 / maxPhotos) as GridSize;
  const startingCount = photos.length ? countTime : initialCount;

  const reset = useCallback((): void => {
    resetCount(countTime);
    setRun(true);
  }, [resetCount, setRun, countTime]);

  const takePhoto = useCallback(async (): Promise<ReturnType<
    typeof setTimeout
  > | void> => {
    setRun(false);
    setTakingPhoto(true);
    const image = await window.camera.takePhoto(photos.length);
    setPhotos([...photos, image]);
    setTakingPhoto(false);

    if (photos.length < maxPhotos - 1) {
      return setTimeout(reset, waitTime * 1000);
    }
  }, [photos, reset, setRun, waitTime, maxPhotos]);

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
    if (photos.length === maxPhotos && photostrips.length === 0) {
      createStrips();
    } else if (photos.length === 0 && photostrips.length !== 0) {
      setPhotostrips([]);
    }
  }, [photos, history, photostrips, setPhotostrips, maxPhotos]);

  let countText;
  if (count === startingCount) countText = 'Get Ready...';
  else if (count) countText = count;
  else if (takingPhoto) countText = 'SNAP';
  else countText = 'Looking Good!';

  return (
    <FullScreen>
      <FlexBox />
      {(preview && run) || !takingPhoto ? (
        <ResponsiveImage
          decorated
          src={`image://${run ? preview : photos[photos.length - 1]}`}
        />
      ) : (
        <div className={classes.view} />
      )}
      <FlexText>{countText}</FlexText>
      <Grid container spacing={3} className={classes.photoPreview}>
        {photos.map((photo, index) => {
          return (
            <Grid item xs={gridSize} key={index}>
              <ResponsiveImage src={`image://${photo}`} />
            </Grid>
          );
        })}
      </Grid>
    </FullScreen>
  );
};

export default TakePictures;
