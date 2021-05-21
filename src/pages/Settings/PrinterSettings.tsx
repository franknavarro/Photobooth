import { forwardRef } from 'react';
import {
  blankError,
  floatError,
  negativeError,
} from '../../helpers/validations';
import clsx from 'clsx';
import Header from '../../components/Header';
import { makeStyles } from '@material-ui/core/styles';
import SelectInput from '../../components/SelectInput';
import TextInput from '../../components/TextInput';

const useStyles = makeStyles((theme) => ({
  group: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *:not(:first-child)': {
      marginLeft: theme.spacing(2),
    },
  },
}));

interface PrinterSettingsProps {
  settings: PhotoboothStore['printer'];
  className?: string;
}

const PrinterSettings = forwardRef<HTMLDivElement, PrinterSettingsProps>(
  ({ settings, className }, ref) => {
    const classes = useStyles();
    return (
      <div ref={ref} className={clsx(className)}>
        <Header>Printer</Header>
        <SelectInput
          showNone
          label="Printer Name"
          setId="printer.printerName"
          defaultValue={settings.printerName}
          dataFetch={async (setItems) => {
            const printers = await window.printer.list();
            if (!printers.length) {
              setItems([
                { value: '', label: 'No printers found', disabled: true },
              ]);
              return;
            }
            setItems(printers.map((p) => ({ value: p, label: p })));
          }}
        />
        <div className={classes.group}>
          <TextInput
            setId="printer.adjustLeftCut"
            label="Left Adjustment"
            helperText="Left adjustment, in pixels, for when printers cut off portions of the picture."
            type="number"
            defaultValue={settings.adjustLeftCut.toString()}
            validations={[negativeError, blankError, floatError]}
            parser={Number}
          />
          <TextInput
            setId="printer.adjustRightCut"
            label="Right Adjustment"
            helperText="Right adjustment, in pixels, for when printers cut off portions of the picture."
            type="number"
            defaultValue={settings.adjustRightCut.toString()}
            validations={[negativeError, blankError, floatError]}
            parser={Number}
          />
        </div>
      </div>
    );
  },
);

export default PrinterSettings;
