import {
  FC,
  useState,
  useRef,
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextInput from '../../components/TextInput';
import {
  blankError,
  passwordCharacterMin,
  passwordsMatch,
  passwordsMatchError,
  usernameError,
} from '../../helpers/validations';

const useStyles = makeStyles((theme) => ({
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

type Events = AsyncReturnType<Window['cloud']['getEvents']>;

interface CreateEventProps {
  certPath: string;
  setEvents: Dispatch<SetStateAction<Events>>;
  setCurrentEvent: Dispatch<SetStateAction<string>>;
  events: Events;
  currentEvent: string;
}

const CreateEvent: FC<CreateEventProps> = ({
  certPath,
  setEvents,
  setCurrentEvent,
  events,
  currentEvent,
}) => {
  const classes = useStyles();
  const [creatingUser, setCreatingUser] = useState<boolean>(false);

  const [eventId, setEventId] = useState<string>('');
  const [eventIdError, setEventIdError] = useState<string>('');

  const [eventName, setEventName] = useState<string>('');
  const [eventNameError, setEventNameError] = useState<string>('');

  const [eventPassword, setEventPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const [reenterPassword, setReenterPassword] = useState<string>('');
  const [rePasswordError, setRePasswordError] = useState<string>('');

  const [formError, setFormError] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const createUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!creatingUser) {
      setEventId('');
      setEventIdError('');
      setEventName('');
      setEventNameError('');
      setEventPassword('');
      setPasswordError('');
      setReenterPassword('');
      setRePasswordError('');
      setCreatingUser(true);
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return;
    }
    try {
      setFormError('');
      setLoadingUser(true);
      const newEvent = await window.cloud.createEvent(
        certPath,
        eventId,
        eventName,
        eventPassword,
      );
      setCreatingUser(false);
      console.log(newEvent);
      setEvents((prev) => [...prev, newEvent]);
      setCurrentEvent(newEvent.uid);
      window.store.set('cloud.eventUID', newEvent.uid);
    } catch (error) {
      const errorSplit = error.message.split('Error:');
      const message = errorSplit[errorSplit.length - 1]
        .trim()
        .replace('email address', 'Event ID');
      setFormError(message);
    } finally {
      setLoadingUser(false);
    }
  };

  const eventIndex = events.findIndex((e) => e.uid === currentEvent);

  const deleteUser = async () => {
    setLoadingUser(true);
    if (eventIndex !== -1) {
      const eventData = events[eventIndex];
      await window.cloud.deleteEvent(
        certPath,
        eventData.uid,
        eventData.eventId,
      );
      window.store.set('cloud.eventUID', '');
      setCurrentEvent('');
      const newEvents = [...events];
      newEvents.splice(eventIndex, 1);
      setEvents(newEvents);
    }
    setLoadingUser(false);
  };

  const hasErrors =
    !!eventIdError || !!eventNameError || !!passwordError || !!rePasswordError;
  const emptyForm =
    !eventId || !eventName || !eventPassword || !reenterPassword;
  const dirtyForm = creatingUser && (hasErrors || emptyForm);

  return (
    <form onSubmit={createUser} ref={formRef}>
      <Button
        color="primary"
        variant="contained"
        type="submit"
        disabled={dirtyForm || loadingUser}
      >
        {loadingUser ? (
          <CircularProgress />
        ) : creatingUser ? (
          'Save New Event'
        ) : (
          'Create New Event'
        )}
      </Button>
      {!creatingUser && eventIndex !== -1 && (
        <Button
          className={classes.buttonSpacing}
          color="secondary"
          variant="contained"
          disabled={loadingUser}
          onClick={deleteUser}
        >
          {loadingUser ? <CircularProgress /> : 'Delete Current Event'}
        </Button>
      )}
      {creatingUser && (
        <>
          {!!formError && <Alert severity="error">{formError}</Alert>}
          <TextInput
            value={eventId}
            label="Event ID"
            disabled={loadingUser}
            validations={[blankError, usernameError]}
            onChange={setEventId}
            onError={setEventIdError}
            error={eventIdError}
          />
          <TextInput
            value={eventName}
            label="Event Display Name"
            disabled={loadingUser}
            validations={[blankError]}
            onChange={setEventName}
            onError={setEventNameError}
            error={eventNameError}
          />
          <TextInput
            value={eventPassword}
            label="Event Password"
            type="password"
            disabled={loadingUser}
            validations={[
              blankError,
              passwordCharacterMin,
              passwordsMatch(reenterPassword),
            ]}
            onChange={setEventPassword}
            error={passwordError}
            onError={(err, newPassword) => {
              if (
                err === passwordsMatchError ||
                (err === '' &&
                  newPassword === reenterPassword &&
                  rePasswordError === passwordsMatchError)
              ) {
                setRePasswordError(err);
              }
              setPasswordError(err);
            }}
          />
          <TextInput
            value={reenterPassword}
            label="ReEnter Event Password"
            type="password"
            disabled={loadingUser}
            validations={[passwordsMatch(eventPassword)]}
            onChange={setReenterPassword}
            onError={(err, newPassword) => {
              if (
                err === passwordsMatchError ||
                (err === '' &&
                  newPassword === eventPassword &&
                  passwordError === passwordsMatchError)
              ) {
                setPasswordError(err);
              }
              setRePasswordError(err);
            }}
            error={rePasswordError}
          />
        </>
      )}
    </form>
  );
};

export default CreateEvent;
