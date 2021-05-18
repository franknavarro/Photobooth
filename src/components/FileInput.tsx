import { FC, useState, ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

interface FileType extends File {
  path: string;
}

const useStyles = makeStyles((theme) => ({
  clear: {
    padding: 0,
    margin: `${theme.spacing(2)}px ${theme.spacing()}px 0 ${theme.spacing()}px`,
  },
  fileSelector: {
    margin: `${theme.spacing(2)}px 0`,
    display: 'flex',
    alignItems: 'center',
  },
  fileText: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

interface FileInputProps {
  setId: string;
  label: string;
  value: string;
  accept?: string;
  onChange?: (file: string) => void;
  error?: string;
  disabled?: boolean;
}

const FileInput: FC<FileInputProps> = ({
  setId,
  label,
  value,
  onChange,
  accept,
  error,
  disabled = false,
}) => {
  const classes = useStyles();
  const [file, setFile] = useState(value);
  const htmlId = setId.replaceAll('.', '-');

  const setChange = (value: string) => {
    window.store.set(setId, value);
    setFile(value);
    if (onChange) onChange(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles && newFiles.length) {
      const newFile = (newFiles[0] as FileType).path;
      setChange(newFile);
    }
    event.target.value = '';
  };

  return (
    <div className={classes.fileSelector}>
      <FormControl>
        <Button
          variant="contained"
          color="primary"
          component="label"
          disabled={disabled}
        >
          Choose File
          <input
            hidden
            accept={accept}
            id={htmlId}
            type="file"
            onChange={handleChange}
          />
        </Button>
      </FormControl>
      <TextField
        className={classes.fileText}
        disabled
        error={!!error}
        helperText={!!error ? error : ''}
        id={`${htmlId}-text`}
        label={label}
        value={file || 'No file selected'}
      />
      {file && (
        <IconButton
          aria-label="clear"
          className={classes.clear}
          disabled={disabled}
          onClick={() => setChange('')}
        >
          <ClearIcon />
        </IconButton>
      )}
    </div>
  );
};

export default FileInput;
