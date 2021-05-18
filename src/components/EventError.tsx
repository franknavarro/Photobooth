import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

export const useStyles = makeStyles((theme) => ({
  alert: {
    marginTop: theme.spacing(2),
  },
}));

interface EventErrorProps {
  message: string;
}

const EventError: FC<EventErrorProps> = ({ message }) => {
  const classes = useStyles();

  if (!message) return <></>;

  const domainMessage =
    message === 'The Event ID is improperly formatted.'
      ? 'Check that the setting "Firebase Email Domain" is a valid domain.'
      : '';
  return (
    <Alert severity="error" className={classes.alert}>
      {message}
      {domainMessage && (
        <>
          <br />
          {domainMessage}
        </>
      )}
    </Alert>
  );
};

export default EventError;
