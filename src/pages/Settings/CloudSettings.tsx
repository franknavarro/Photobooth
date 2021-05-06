import { useEffect, useState, forwardRef } from 'react';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import FileInput from '../../components/FileInput';
import SelectInput from '../../components/SelectInput';
import TextInput from '../../components/TextInput';
import Typography from '@material-ui/core/Typography';
import { blankError } from '../../helpers/validations';
import CreateEvent from './CreateEvent';

interface CloudSettingsProps {
  settings: PhotoboothStore['cloud'];
  className?: string;
}

type Events = AsyncReturnType<Window['cloud']['getEvents']>;

const CloudSettings = forwardRef<HTMLDivElement, CloudSettingsProps>(
  ({ settings, className }, ref) => {
    const [certPath, setCertFile] = useState<string>(settings.certPath);
    const [events, setEvents] = useState<Events>([]);
    const [currentEvent, setCurrentEvent] = useState<string>(settings.eventUID);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
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
              items={events.map((e) => ({
                label: e.displayName || e.uid,
                value: e.uid,
              }))}
            />
            <CreateEvent
              certPath={certPath}
              setEvents={setEvents}
              setCurrentEvent={setCurrentEvent}
              events={events}
              currentEvent={currentEvent}
            />
          </>
        );
      }
    };

    return (
      <div ref={ref} className={clsx(className)}>
        <Typography variant="h4">Firebase Settings</Typography>
        <FileInput
          value={certPath}
          setId="cloud.certPath"
          label="Private Key File Path"
          accept="application/JSON"
          onChange={(file) => setCertFile(file)}
          error={eventsError}
        />
        {showExtraFields()}
      </div>
    );
  },
);

export default CloudSettings;
