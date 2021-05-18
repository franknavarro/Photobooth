import {
  FC,
  useState,
  useRef,
  useEffect,
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import EventError from '../../../components/EventError';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextInput from '../../../components/TextInput';
import {
  blankError,
  passwordCharacterMin,
  passwordsMatch,
  passwordsMatchError,
  usernameError,
} from '../../../helpers/validations';

export const useStyles = makeStyles((theme) => ({
  input: {
    margin: `${theme.spacing(2)}px 0px -${theme.spacing(2)}px -10px`,
    display: 'flex',
    width: '100%',
  },
}));

type Events = AsyncReturnType<Window['cloud']['getEvents']>;
type Settings = Parameters<Window['cloud']['createEvent']>[0];

interface EditEventProps {
  settings: Settings;
  display: boolean;
  onEnd: () => void;
  currentEvent: string;
  events: Events;
  setEvents: Dispatch<SetStateAction<Events>>;
  setEventsButton: Dispatch<SetStateAction<boolean>>;
}

const EditEvent: FC<EditEventProps> = ({
  settings,
  display,
  onEnd,
  currentEvent,
  events,
  setEvents,
  setEventsButton,
}) => {
  const classes = useStyles();

  const [autoId, setAutoId] = useState<boolean>(false);

  const [eventIndex, setEventIndex] = useState<number>(-1);
  const [eventId, setEventId] = useState<string>('');
  const [eventIdError, setEventIdError] = useState<string>('');

  const [eventName, setEventName] = useState<string>('');
  const [eventNameError, setEventNameError] = useState<string>('');

  const [eventPassword, setEventPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const [reenterPassword, setReenterPassword] = useState<string>('');
  const [rePasswordError, setRePasswordError] = useState<string>('');

  const [formError, setFormError] = useState<string>('');
  const [loadingEvent, setLoadingEvent] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!display) {
      setAutoId(false);
      const index = events.findIndex((e) => e.uid === currentEvent);
      setEventIndex(index);
      if (index !== -1) {
        setEventId(events[index].eventId);
        setEventIdError('');
        setEventName(events[index].displayName);
        setEventNameError('');
        setEventPassword('');
        setPasswordError('');
        setReenterPassword('');
        setRePasswordError('');
      }
    } else {
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [display, currentEvent, events]);

  useEffect(() => {
    if (autoId) {
      setEventId(
        eventName
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[^a-z0-9_\s]/g, '')
          .replace(/\s+/g, '_'),
      );
    }
  }, [autoId, eventName]);

  if (!display) return <></>;

  const editUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setEventsButton(true);
      setLoadingEvent(true);
      setFormError('');
      const editedEvent = await window.cloud.updateEvent(
        settings,
        currentEvent,
        { id: eventId, name: eventName, password: eventPassword },
      );
      const newEvents = [...events];
      newEvents.splice(eventIndex, 1, { ...editedEvent });
      console.log(newEvents);
      setEvents(newEvents);
      setLoadingEvent(false);
      onEnd();
    } catch (error) {
      const errorSplit = error.message.split('Error:');
      const message = errorSplit[errorSplit.length - 1]
        .trim()
        .replace('email address', 'Event ID');
      setFormError(message);
      setLoadingEvent(false);
    } finally {
      setEventsButton(false);
    }
  };

  const isError =
    !!eventIdError || !!eventNameError || !!passwordError || !!rePasswordError;
  const isNotDiff =
    events[eventIndex].displayName === eventName &&
    events[eventIndex].eventId === eventId &&
    (eventPassword === '' || reenterPassword === '');

  return (
    <form onSubmit={editUser} ref={formRef}>
      <EventError message={formError} />
      <FormControlLabel
        control={
          <Checkbox
            checked={autoId}
            onChange={() => setAutoId((prev) => !prev)}
            name="autoID"
            color="primary"
            disabled={loadingEvent}
          />
        }
        className={classes.input}
        label="Auto generate Event ID from Event Name"
      />
      <TextInput
        value={eventId}
        label="Event ID"
        disabled={loadingEvent || autoId}
        validations={[blankError, usernameError]}
        onChange={(value) => setEventId(value.toLowerCase())}
        onError={setEventIdError}
        error={eventIdError}
      />
      <TextInput
        value={eventName}
        label="Event Display Name"
        disabled={loadingEvent}
        validations={[blankError]}
        onChange={setEventName}
        onError={setEventNameError}
        error={eventNameError}
      />
      <TextInput
        value={eventPassword}
        label="Event Password"
        type="password"
        disabled={loadingEvent}
        validations={[passwordCharacterMin, passwordsMatch(reenterPassword)]}
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
        disabled={loadingEvent}
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
      <Button
        color="primary"
        variant="contained"
        disabled={loadingEvent || isError || isNotDiff}
        type="submit"
      >
        {loadingEvent ? <CircularProgress /> : 'Update Event'}
      </Button>
    </form>
  );
};

export default EditEvent;
