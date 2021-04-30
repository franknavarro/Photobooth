import { FC, useState, ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField, { FilledTextFieldProps } from '@material-ui/core/TextField';
import { Validation } from '../helpers/validations';

const useStyles = makeStyles((theme) => ({
  input: {
    margin: `${theme.spacing(2)}px 0`,
    display: 'flex',
    width: '100%',
  },
}));

interface TextInputProps
  extends Omit<FilledTextFieldProps, 'variant' | 'id' | 'error' | 'onChange'> {
  setId: string;
  validations?: Validation[];
  parser?: (value: any) => any;
  value: string | number;
  onChange?: (text: string) => void;
}

const TextInput: FC<TextInputProps> = ({
  value,
  setId,
  validations,
  parser,
  onChange,
  ...props
}) => {
  const classes = useStyles();
  const [controlledValue, setControlledValue] = useState(value.toString());
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    try {
      if (validations) {
        const errorIndex = validations.findIndex(({ rule }) => rule(newValue));
        if (errorIndex !== -1) throw new Error(validations[errorIndex].error);
      }
      window.store.set(setId, parser ? parser(newValue) : newValue);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setControlledValue(newValue);
      if (onChange) onChange(newValue);
    }
  };
  return (
    <TextField
      variant="filled"
      error={!!error}
      value={controlledValue}
      onChange={handleChange}
      helperText={error}
      className={classes.input}
      {...props}
    />
  );
};

export default TextInput;
