import { FC, useState, Dispatch, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';

const useStyles = makeStyles((theme) => ({
  buttonSpacing: {
    marginLeft: theme.spacing(2),
  },
}));

type Events = AsyncReturnType<Window['cloud']['getEvents']>;

interface EditEventsProps {
  certPath: string;
  events: Events;
  setEvents: Dispatch<SetStateAction<Events>>;
  currentEvent: string;
  setCurrentEvent: Dispatch<SetStateAction<string>>;
  disableEvents: boolean;
  setDisableEvents: Dispatch<SetStateAction<boolean>>;
}

const EditEvents: FC<EditEventsProps> = ({
  certPath,
  events,
  setEvents,
  currentEvent,
  setCurrentEvent,
  disableEvents,
  setDisableEvents,
}) => {
  const classes = useStyles();
  const [creatingEvent, setCreatingEvent] = useState<boolean>(false);
  const [deletingEvent, setDeletingEvent] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<boolean>(false);
  const [eventsButton, setEventsButton] = useState<boolean>(false);

  const deleteEvent = async () => {
    setDeletingEvent(true);
    setDisableEvents(true);
    const eventIndex = events.findIndex((e) => e.uid === currentEvent);
    try {
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
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingEvent(false);
      setDisableEvents(false);
    }
  };

  return (
    <>
      <Button
        color={creatingEvent ? 'secondary' : 'primary'}
        variant="contained"
        onClick={() => {
          setDisableEvents((prev) => !prev);
          setCreatingEvent((prev) => !prev);
        }}
        disabled={deletingEvent || editingEvent || eventsButton}
      >
        {creatingEvent ? 'Cancel Creating Event' : 'Create New Event'}
      </Button>
      <Button
        className={classes.buttonSpacing}
        color={editingEvent ? 'secondary' : 'default'}
        variant="contained"
        onClick={() => {
          setDisableEvents((prev) => !prev);
          setEditingEvent((prev) => !prev);
        }}
        disabled={
          creatingEvent || deletingEvent || eventsButton || !currentEvent
        }
      >
        {editingEvent ? 'Cancel Editing Event' : 'Edit Event'}
      </Button>
      <Button
        className={classes.buttonSpacing}
        color="secondary"
        variant="contained"
        disabled={
          creatingEvent ||
          deletingEvent ||
          editingEvent ||
          disableEvents ||
          !currentEvent
        }
        onClick={deleteEvent}
      >
        {deletingEvent ? <CircularProgress /> : 'Delete Current Event'}
      </Button>
      <CreateEvent
        certPath={certPath}
        display={creatingEvent}
        onEnd={() => {
          setCreatingEvent(false);
          setDisableEvents(false);
        }}
        setCurrentEvent={setCurrentEvent}
        setEvents={setEvents}
        setEventsButton={setEventsButton}
      />
      <EditEvent
        certPath={certPath}
        display={editingEvent}
        onEnd={() => {
          setEditingEvent(false);
          setDisableEvents(false);
        }}
        currentEvent={currentEvent}
        events={events}
        setEvents={setEvents}
        setEventsButton={setEventsButton}
      />
    </>
  );
};

export default EditEvents;
