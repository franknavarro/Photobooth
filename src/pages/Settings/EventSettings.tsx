import { useEffect, useState, forwardRef } from 'react';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import FileInput from '../../components/FileInput';
import Header from '../../components/Header';
import SelectInput from '../../components/SelectInput';
import TextInput from '../../components/TextInput';
import { blankError } from '../../helpers/validations';
import EditEvents from './EditEvents/EditEvents';

interface EventSettingsProps {
  settings: PhotoboothStore['cloud'];
  className?: string;
}

type Events = AsyncReturnType<Window['cloud']['getEvents']>;

const EventSettings = forwardRef<HTMLDivElement, EventSettingsProps>(
  ({ settings, className }, ref) => {
    const [certPath, setCertFile] = useState<string>(settings.certPath);
    const [events, setEvents] = useState<Events>([]);
    const [currentEvent, setCurrentEvent] = useState<string>(settings.eventUID);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
    const [disableEvents, setDisableEvents] = useState<boolean>(false);
    const [eventsError, setEventsError] = useState<string>('');

    useEffect(() => {
      const getEvents = async () => {
        try {
          setLoadingEvents(true);
          setEventsError('');
          const newEvents = await window.cloud.getEvents(certPath);
          console.log(newEvents);
          setEvents(newEvents);
        } catch (error) {
          const message = error.message.split(':').splice(1).join(':');
          setEventsError(message);
        } finally {
          setLoadingEvents(false);
        }
      };
      if (certPath) getEvents();
    }, [certPath]);

    const showExtraFields = () => {
      if (loadingEvents) return <CircularProgress />;
      else if (eventsError) return <></>;
      else if (certPath) {
        return (
          <>
            <TextInput
              label="Firebase Bucket Name"
              defaultValue={settings.bucketName}
              setId="cloud.bucketName"
              validations={[
                blankError,
                {
                  rule: async (value) =>
                    !(await window.cloud.bucketExists(certPath, value)),
                  error: 'Bucket does not exist',
                },
              ]}
            />
            <SelectInput
              showNone
              label="Event"
              setId="cloud.eventUID"
              value={currentEvent}
              onChange={(e) => setCurrentEvent(e as string)}
              disabled={disableEvents}
              items={events.map((e) => ({
                label: e.displayName || e.uid,
                value: e.uid,
              }))}
            />
            <EditEvents
              certPath={certPath}
              events={events}
              setEvents={setEvents}
              currentEvent={currentEvent}
              setCurrentEvent={setCurrentEvent}
              disableEvents={disableEvents}
              setDisableEvents={setDisableEvents}
            />
          </>
        );
      }
    };

    return (
      <div ref={ref} className={clsx(className)}>
        <Header>Event</Header>
        <FileInput
          value={certPath}
          setId="cloud.certPath"
          label="Firebase Private Key File Path"
          accept="application/JSON"
          onChange={(file) => setCertFile(file)}
          error={eventsError}
        />
        {showExtraFields()}
      </div>
    );
  },
);

export default EventSettings;
