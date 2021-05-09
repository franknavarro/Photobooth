import {
  FC,
  useState,
  useRef,
  useEffect,
  FormEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextInput from '../../../components/TextInput';
import {
  blankError,
  passwordCharacterMin,
  passwordsMatch,
  passwordsMatchError,
  usernameError,
} from '../../../helpers/validations';

type Events = AsyncReturnType<Window['cloud']['getEvents']>;

interface CreateEventProps {
  certPath: string;
  display: boolean;
  onEnd: () => void;
  setCurrentEvent: Dispatch<SetStateAction<string>>;
  setEvents: Dispatch<SetStateAction<Events>>;
  setEventsButton: Dispatch<SetStateAction<boolean>>;
}

const CreateEvent: FC<CreateEventProps> = ({
  certPath,
  display,
  onEnd,
  setCurrentEvent,
  setEvents,
  setEventsButton,
}) => {
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
      setEventId('');
      setEventIdError('');
      setEventName('');
      setEventNameError('');
      setEventPassword('');
      setPasswordError('');
      setReenterPassword('');
      setRePasswordError('');
    } else {
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [display]);

  const createUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setEventsButton(true);
      setLoadingEvent(true);
      setFormError('');
      const newEvent = await window.cloud.createEvent(
        certPath,
        eventId,
        eventName,
        eventPassword,
      );
      setEvents((prev) => [...prev, newEvent]);
      setCurrentEvent(newEvent.uid);
      window.store.set('cloud.eventUID', newEvent.uid);
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

  if (!display) return <></>;

  const isBlank = !eventId || !eventName || !eventPassword || !reenterPassword;
  const isError =
    !!eventIdError || !!eventNameError || !!passwordError || !!rePasswordError;
  return (
    <form onSubmit={createUser} ref={formRef}>
      {!!formError && <Alert severity="error">{formError}</Alert>}
      <TextInput
        value={eventId}
        label="Event ID"
        disabled={loadingEvent}
        validations={[blankError, usernameError]}
        onChange={setEventId}
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
        disabled={loadingEvent || isError || isBlank}
        type="submit"
      >
        {loadingEvent ? <CircularProgress /> : 'Create Event'}
      </Button>
    </form>
  );
};

export default CreateEvent;
