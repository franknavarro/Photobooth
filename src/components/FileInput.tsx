import { FC, useState, ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

interface FileType extends File {
  path: string;
}

const useStyles = makeStyles((theme) => ({
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles && newFiles.length) {
      const newFile = (newFiles[0] as FileType).path;
      window.store.set(setId, newFile);
      setFile(newFile);
      if (onChange) onChange(newFile);
    }
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
    </div>
  );
};

export default FileInput;
