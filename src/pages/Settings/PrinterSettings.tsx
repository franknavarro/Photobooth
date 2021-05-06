import { forwardRef } from 'react';
import clsx from 'clsx';
import SelectInput from '../../components/SelectInput';
import Typography from '@material-ui/core/Typography';

interface PrinterSettingsProps {
  settings: PhotoboothStore['printer'];
  className?: string;
}

const PrinterSettings = forwardRef<HTMLDivElement, PrinterSettingsProps>(
  ({ settings, className }, ref) => {
    return (
      <div ref={ref} className={clsx(className)}>
        <Typography variant="h4">Printer</Typography>
        <SelectInput
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
      </div>
    );
  },
);

export default PrinterSettings;
