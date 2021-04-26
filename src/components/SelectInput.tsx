import { FC, useState } from 'react';
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
}

interface SelectInputProps extends SelectProps {
  setId: string;
  label: string;
  items: SelectItem[];
}

const SelectInput: FC<SelectInputProps> = ({
  setId,
  items,
  label,
  className,
  value,
  ...props
}) => {
  const classes = useStyles();
  const [controlledValue, setControlledValue] = useState<unknown>(value);
  const htmlId = setId.replaceAll('.', '-');

  const handleChange: SelectProps['onChange'] = (event) => {
    const newValue = event.target.value;
    window.store.set(setId, newValue);
    setControlledValue(newValue);
  };

  return (
    <FormControl className={classes.input}>
      <InputLabel id={`${htmlId}-label`}>{label}</InputLabel>
      <Select
        labelId={`${htmlId}-label`}
        id={htmlId}
        value={controlledValue}
        onChange={handleChange}
        {...props}
      >
        {items.map(({ value, label }, index) => (
          <MenuItem value={value} key={index}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
