import { FC, useState, useMemo, useCallback } from 'react';
import { debounce } from 'throttle-debounce';
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ColorizeRoundedIcon from '@material-ui/icons/ColorizeRounded';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  colorSelector: {
    margin: `${theme.spacing(2)}px 0`,
    display: 'flex',
    alignItems: 'center',
  },
  colorText: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  colorPicker: {
    minHeight: '50px',
  },
}));

interface ColorInputProps {
  setId: string;
  label: string;
  value: string;
}

const ColorInput: FC<ColorInputProps> = ({ setId, label, value }) => {
  const classes = useStyles();
  const [color, setColor] = useState(value[0] !== '#' ? '#' + value : value);
  const htmlId = setId.replaceAll('.', '-');
  const theme = createMuiTheme({
    palette: { primary: { main: color === '#' ? '#000' : color } },
  });

  const colorPickerChange = useMemo(
    () =>
      debounce(500, false, (c: string) => {
        setColor(c);
        window.store.set(setId, c);
      }),
    [setId],
  );

  const setColorStore = useMemo(
    () =>
      debounce(500, false, (c: string) => {
        window.store.set(setId, c);
      }),
    [setId],
  );

  const textChange = useCallback(
    (c: string) => {
      const colorNoHex = c.slice(1);
      if (!colorNoHex) setColor('#');
      else if (colorNoHex.length <= 6 && !/[^a-fA-F0-9]/.test(colorNoHex)) {
        setColor(c);
        setColorStore(c);
      }
    },
    [setColorStore],
  );

  return (
    <div className={classes.colorSelector}>
      <FormControl>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            className={classes.colorPicker}
          >
            <ColorizeRoundedIcon />
            <input
              hidden
              id={htmlId}
              type="color"
              onChange={(e) => colorPickerChange(e.target.value)}
              value={color}
            />
          </Button>
        </ThemeProvider>
      </FormControl>
      <TextField
        id={`${htmlId}-text`}
        label={label}
        value={color}
        className={classes.colorText}
        onChange={(e) => textChange(e.target.value)}
      />
    </div>
  );
};

export default ColorInput;
