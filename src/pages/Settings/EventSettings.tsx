import { blankError } from '../../helpers/validations';
import { useEffect, useState, forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditEvents from './EditEvents/EditEvents';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FileInput from '../../components/FileInput';
import Header from '../../components/Header';
import SelectInput from '../../components/SelectInput';
import TextInput from '../../components/TextInput';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  advancedRoot: {
    '&:before': {
      backgroundColor: 'transparent',
      transition: 'none',
    },
    boxShadow: 'none',
  },
  advancedSummaryRoot: {
    '&.Mui-expanded': {
      minHeight: 0,
    },
    minHeight: 0,
    padding: 0,
    flexDirection: 'row-reverse',
  },
  advancedSummaryIcon: {
    '&.Mui-expanded': {
      transform: 'rotate(270deg)',
    },
    padding: 0,
  },
  advancedSummaryContent: {
    '&.Mui-expanded': {
      margin: 0,
    },
    margin: 0,
    paddingLeft: theme.spacing(2),
  },
  advancedContent: {
    margin: 0,
    padding: 0,
    display: 'block',
  },
}));

interface EventSettingsProps {
  settings: PhotoboothStore['cloud'];
  className?: string;
}

type Events = AsyncReturnType<Window['cloud']['getEvents']>;

const EventSettings = forwardRef<HTMLDivElement, EventSettingsProps>(
  ({ settings, className }, ref) => {
    const classes = useStyles();

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
        <Accordion classes={{ root: classes.advancedRoot }}>
          <AccordionSummary
            classes={{
              root: classes.advancedSummaryRoot,
              content: classes.advancedSummaryContent,
              expandIcon: classes.advancedSummaryIcon,
            }}
            expandIcon={<ChevronRightIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Advanced Event Settings</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.advancedContent}>
            <FileInput
              value={certPath}
              setId="cloud.certPath"
              label="Firebase Private Key File Path"
              accept="application/JSON"
              onChange={(file) => setCertFile(file)}
              error={eventsError}
            />
            {certPath && (
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
            )}
          </AccordionDetails>
        </Accordion>
        {showExtraFields()}
      </div>
    );
  },
);

export default EventSettings;
