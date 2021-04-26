import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select, { SelectProps } from '@material-ui/core/Select';

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
    if (dataFetch) dataFetch(setItemList);
  }, [dataFetch]);

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
        {itemList.length ? (
          itemList.map(({ value, label, disabled }, index) => (
            <MenuItem
              value={value}
              key={index}
              disabled={disabled === undefined ? false : disabled}
            >
              {label}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="" disabled>
            Loading...
          </MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
