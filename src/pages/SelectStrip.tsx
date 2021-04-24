import { useEffect, useCallback, FC, Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { PhotostripList } from '../Router';
import useCountDown from '../hooks/useCountDown';
import Button from '@material-ui/core/Button';
import FlexBox from '../components/FlexBox';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';
import Grid, { GridSize } from '@material-ui/core/Grid';
import Text from '../components/Text';

const useStyles = makeStyles((theme) => ({
  buttonBox: {
    width: '100%',
    margin: 0,
  },
  gridBox: {
    display: 'flex',
    width: '100%',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  imgBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonText: {
    marginTop: theme.spacing(2),
  },
}));

interface SelectStripProps {
  photostrips: PhotostripList;
  setSelectedStrip: Dispatch<SetStateAction<string>>;
}

const SelectStrip: FC<SelectStripProps> = ({
  photostrips,
  setSelectedStrip,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [count] = useCountDown(10);
  const gridSize = Math.round(12 / photostrips.length) as GridSize;

  const select = useCallback(
    (option: number) => {
      setSelectedStrip(photostrips[option].path);
      history.push('/print');
    },
    [history, photostrips, setSelectedStrip],
  );

  useEffect(() => {
    if (count === 0) select(0);
  }, [count, select]);

  return (
    <FullScreen>
      <FlexText>Select a print...</FlexText>
      <FlexBox>
        <Grid container spacing={3} className={classes.buttonBox}>
          {photostrips.map(({ description, path }, index) => (
            <Grid
              item
              xs={gridSize}
              key={description}
              className={classes.gridBox}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => select(index)}
              >
                <div className={classes.imgBox}>
                  <img
                    src={`image://${path}`}
                    alt={description}
                    className={classes.img}
                  />
                  <Text variant="h5" className={classes.buttonText}>
                    {description}
                  </Text>
                </div>
              </Button>
            </Grid>
          ))}
        </Grid>
      </FlexBox>
      <FlexText>Auto Selecting in {count}</FlexText>
    </FullScreen>
  );
};

export default SelectStrip;
