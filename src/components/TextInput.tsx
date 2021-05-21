import { FC, useState, ChangeEvent, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField, { FilledTextFieldProps } from '@material-ui/core/TextField';
import { Validation } from '../helpers/validations';
import { debounce } from 'throttle-debounce';

const useStyles = makeStyles((theme) => ({
  input: {
    margin: `${theme.spacing(2)}px 0`,
    display: 'flex',
    width: '100%',
  },
}));

interface TextInputProps
  extends Omit<
    FilledTextFieldProps,
    'variant' | 'id' | 'error' | 'onChange' | 'onError' | 'helperText'
  > {
  setId?: string;
  validations?: Validation[];
  parser?: (value: any) => any;
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  onError?: (text: string, value: string) => void;
  error?: string;
  helperText?: string;
}

const TextInput: FC<TextInputProps> = ({
  value,
  setId,
  validations,
  parser,
  onChange,
  onError,
  error,
  defaultValue,
  helperText,
  ...props
}) => {
  const classes = useStyles();
  const [controlledValue, setControlledValue] = useState<string>(
    defaultValue || '',
  );
  const [controlledError, setControlledError] = useState<string>('');

  const validateFields = useMemo(
    () =>
      debounce(500, false, async (newValue: string) => {
        try {
          if (validations) {
            const validationResults = await Promise.all(
              validations.map(({ rule }) => rule(newValue)),
            );
            const errorIndex = validationResults.findIndex((val) => val);
            if (errorIndex !== -1) {
              throw new Error(validations[errorIndex].error);
            }
          }
          if (setId) {
            window.store.set(setId, parser ? parser(newValue) : newValue);
          }
          if (onError) onError('', newValue);
          else setControlledError('');
        } catch (err) {
          if (onError) onError(err.message, newValue);
          else setControlledError(err.message);
        }
      }),
    [onError, parser, setId, validations],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (onChange) onChange(newValue);
    else setControlledValue(newValue);
    validateFields(newValue);
  };

  const showError = error !== undefined ? error : controlledError;
  return (
    <TextField
      variant="filled"
      error={!!showError}
      value={value !== undefined ? value : controlledValue}
      onChange={handleChange}
      helperText={!!showError ? showError : helperText}
      className={classes.input}
      {...props}
    />
  );
};

export default TextInput;
