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
import clsx from 'clsx';
import useCountDown from '../hooks/useCountDown';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';
import LivePreview from '../components/LivePreview';
import ResponsiveImage from '../components/ResponsiveImage';

const useStyles = makeStyles((theme) => ({
  mainView: {
    flex: 5,
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    padding: theme.spacing(3),
  },
  mainTop: {
    flexDirection: 'column-reverse',
    paddingTop: theme.spacing(3),
  },
  mainBottom: {
    flexDirection: 'column',
    paddingBottom: theme.spacing(3),
  },
  mainLeft: {
    flexDirection: 'row-reverse',
    paddingLeft: theme.spacing(3),
  },
  mainRight: {
    flexDirection: 'row',
    paddingRight: theme.spacing(3),
  },
  view: {
    flex: 5,
    height: '100%',
    width: '100%',
  },
  photoPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  horizontalPreview: {
    display: 'flex',
    flexDirection: 'row',
  },
  verticalPreview: {
    display: 'flex',
    flexDirection: 'column',
  },
  noPreview: {
    display: 'none',
  },
  previewBox: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
}));

interface TakePicturesProps {
  initialCount: PhotoboothStore['interface']['initialCount'];
  countTime: PhotoboothStore['interface']['countTime'];
  waitTime: PhotoboothStore['interface']['waitTime'];
  maxPhotos: PhotoboothStore['photostrip']['maxPhotos'];
  photostrips: PhotostripList;
  setPhotostrips: Dispatch<SetStateAction<PhotostripList>>;
  ratio: ImageRatio;
  photoPreview: PhotoboothStore['interface']['photoPreview'];
}

const TakePictures: FC<TakePicturesProps> = ({
  initialCount,
  countTime,
  waitTime,
  maxPhotos,
  photostrips,
  setPhotostrips,
  photoPreview,
  ratio,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [run, setRun] = useState<boolean>(true);
  const [count, setCount] = useCountDown(initialCount);
  const [photos, setPhotos] = useState<string[]>([]);
  const [takingPhoto, setTakingPhoto] = useState<boolean>(false);
  const startingCount = photos.length ? countTime : initialCount;

  const reset = useCallback((): void => {
    setCount(countTime);
    setRun(true);
  }, [setCount, countTime]);

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
  }, [photos, reset, waitTime, maxPhotos]);

  // Stop live preview and take an image
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
    <FullScreen
      className={clsx({
        [classes.mainTop]: photoPreview === 'top',
        [classes.mainBottom]: photoPreview === 'bottom',
        [classes.mainLeft]: photoPreview === 'left',
        [classes.mainRight]: photoPreview === 'right',
      })}
    >
      <div className={classes.mainView}>
        <div className={classes.view}>
          <LivePreview
            ratio={ratio}
            run={run}
            hide={takingPhoto}
            defaultSrc={photos[photos.length - 1]}
          />
        </div>
        <FlexText>{countText}</FlexText>
      </div>
      <div
        className={clsx(classes.photoPreview, {
          [classes.horizontalPreview]:
            photoPreview === 'top' || photoPreview === 'bottom',
          [classes.verticalPreview]:
            photoPreview === 'left' || photoPreview === 'right',
          [classes.noPreview]: photoPreview === 'none',
        })}
      >
        {[...Array(maxPhotos)].map((_, photoI) => (
          <div className={classes.previewBox} key={photoI}>
            {photoI < photos.length && (
              <ResponsiveImage
                ratio={ratio}
                src={`image://${photos[photoI]}`}
              />
            )}
          </div>
        ))}
      </div>
    </FullScreen>
  );
};

export default TakePictures;
