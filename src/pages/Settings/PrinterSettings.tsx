import { forwardRef } from 'react';
import clsx from 'clsx';
import Header from '../../components/Header';
import SelectInput from '../../components/SelectInput';

interface PrinterSettingsProps {
  settings: PhotoboothStore['printer'];
  className?: string;
}

const PrinterSettings = forwardRef<HTMLDivElement, PrinterSettingsProps>(
  ({ settings, className }, ref) => {
    return (
      <div ref={ref} className={clsx(className)}>
        <Header>Printer</Header>
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
