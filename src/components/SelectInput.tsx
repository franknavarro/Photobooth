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

interface SelectInputProps extends SelectProps {
  setId: string;
  label: string;
  items?: SelectItem[];
  dataFetch?: ItemFetch;
}

const SelectInput: FC<SelectInputProps> = ({
  setId,
  items = [],
  label,
  className,
  value,
  dataFetch,
  ...props
}) => {
  const classes = useStyles();
  const [itemList, setItemList] = useState<SelectItem[]>(items);
  const [controlledValue, setControlledValue] = useState<unknown>(value);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const valueInItems = itemList.findIndex(
    (item) => item.value === controlledValue,
  );
  const htmlId = setId.replaceAll('.', '-');

  const handleChange: SelectProps['onChange'] = (event) => {
    const newValue = event.target.value;
    window.store.set(setId, newValue);
    setControlledValue(newValue);
  };

  useEffect(() => {
    const getData = async () => {
      if (dataFetch) {
        try {
          setLoading(true);
          setError('');
          await dataFetch(setItemList);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    getData();
  }, [dataFetch]);

  if (loading) return <CircularProgress color="primary" />;
  if (error) return <Typography>{error}</Typography>;
  return (
    <FormControl className={classes.input}>
      <InputLabel id={`${htmlId}-label`}>{label}</InputLabel>
      <Select
        labelId={`${htmlId}-label`}
        id={htmlId}
        value={valueInItems !== -1 ? controlledValue : ''}
        onChange={handleChange}
        {...props}
      >
        {itemList.map(({ value, label, disabled }, index) => (
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
