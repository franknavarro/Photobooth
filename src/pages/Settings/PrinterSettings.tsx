import { FC } from 'react';
import SelectInput from '../../components/SelectInput';
import Typography from '@material-ui/core/Typography';

interface PrinterSettingsProps {
  settings: PhotoboothStore['printer'];
}

const PrinterSettings: FC<PrinterSettingsProps> = ({ settings }) => {
  return (
    <div>
      <Typography variant="h4">Printer</Typography>
      <SelectInput
        label="Printer Name"
        setId="printer.printerName"
        value={settings.printerName}
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
};

export default PrinterSettings;
