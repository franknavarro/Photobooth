import { useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import useCountDown from '../hooks/useCountDown';
import Button from '@material-ui/core/Button';
import FlexBox from '../components/FlexBox';
import FlexText from '../components/FlexText';
import FullScreen from '../components/FullScreen';
import Grid from '@material-ui/core/Grid';
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

const STRIPS = [
  { name: 'Color', location: '/tmp/color.jpg' },
  { name: 'Black & White', location: '/tmp/greyscale.jpg' },
  { name: 'Both', location: '/tmp/both.jpg' },
];

const SelectStrip = () => {
  const classes = useStyles();
  const history = useHistory();
  const [count] = useCountDown(10);

  const select = useCallback(
    (option) => {
      console.log(option);
      history.push(
        `/print?file=${encodeURIComponent(STRIPS[option].location)}`,
      );
    },
    [history],
  );

  useEffect(() => {
    if (count === 0) select(0);
  }, [count, select]);

  return (
    <FullScreen>
      <FlexText>Select a print...</FlexText>
      <FlexBox>
        <Grid container spacing={3} className={classes.buttonBox}>
          {STRIPS.map(({ name, location }, index) => (
            <Grid
              item
              xs={12 / STRIPS.length}
              key={name}
              className={classes.gridBox}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => select(index)}
              >
                <div className={classes.imgBox}>
                  <img
                    src={`image://${location}`}
                    alt={name}
                    className={classes.img}
                  />
                  <Text variant="h5" className={classes.buttonText}>
                    {name}
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
