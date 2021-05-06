import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select, { SelectProps } from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  input: {
    margin: `${theme.spacing(2)}px 0`,
    display: 'flex',
  },
}));

interface SelectItem {
  value: any;
  label: string;
  disabled?: boolean;
}

export type ItemFetch = (
  setItems: Dispatch<SetStateAction<SelectItem[]>>,
) => void | Promise<void>;

interface SelectInputProps extends Omit<SelectProps, 'error'> {
  setId: string;
  label: string;
  items?: SelectItem[];
  defaultItems?: SelectItem[];
  dataFetch?: ItemFetch;
  loading?: boolean;
  defaultValue?: unknown;
  value?: string;
  onChange?: (value: unknown) => void;
  error?: string;
  showNone?: boolean;
}

const SelectInput: FC<SelectInputProps> = ({
  setId,
  items,
  defaultItems = [],
  label,
  className,
  value,
  defaultValue,
  loading,
  onChange,
  dataFetch,
  error,
  showNone = false,
  ...props
}) => {
  const classes = useStyles();
  const [controlledItems, setControlledItems] = useState<SelectItem[]>(
    defaultItems,
  );
  const [controlledValue, setControlledValue] = useState<unknown>(
    defaultValue || '',
  );
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string>('');

  const valueInItems = controlledItems.findIndex(
    (item) => item.value === controlledValue,
  );
  const htmlId = setId.replaceAll('.', '-');

  const handleChange: SelectProps['onChange'] = (event) => {
    const newValue = event.target.value;
    window.store.set(setId, newValue);
    if (onChange) onChange(newValue);
    else setControlledValue(newValue);
  };

  useEffect(() => {
    const getData = async () => {
      if (dataFetch) {
        try {
          setDataLoading(true);
          setDataError('');
          await dataFetch(setControlledItems);
        } catch (error) {
          setDataError(error.message);
        } finally {
          setDataLoading(false);
        }
      }
    };
    getData();
  }, [dataFetch]);

  if (dataLoading || loading) return <CircularProgress color="primary" />;
  if (error || dataError) return <Typography>{error || dataError}</Typography>;

  const useValue =
    value !== undefined ? value : valueInItems !== -1 ? controlledValue : '';
  return (
    <FormControl className={classes.input}>
      <InputLabel id={`${htmlId}-label`}>{label}</InputLabel>
      <Select
        labelId={`${htmlId}-label`}
        id={htmlId}
        value={useValue}
        onChange={handleChange}
        {...props}
      >
        {showNone && <MenuItem value="">None</MenuItem>}
        {(items || controlledItems).map(({ value, label, disabled }, index) => (
          <MenuItem
            value={value}
            key={index}
            disabled={disabled === undefined ? false : disabled}
          >
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
