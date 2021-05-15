import { forwardRef } from 'react';
import {
  blankError,
  floatError,
  getGreaterError,
} from '../../helpers/validations';
import clsx from 'clsx';
import ColorInput from '../../components/ColorInput';
import Header from '../../components/Header';
import SelectInput from '../../components/SelectInput';
import TextInput from '../../components/TextInput';

interface InterfaceSettingsProps {
  settings: PhotoboothStore['interface'];
  className?: string;
}

const InterfaceSettings = forwardRef<HTMLDivElement, InterfaceSettingsProps>(
  ({ settings, className }, ref) => {
    const parsePlus1 = (v: string) => parseInt(v) + 1;
    return (
      <div ref={ref} className={clsx(className)}>
        <Header>Interface</Header>
        <ColorInput
          setId="interface.primaryColor"
          label="Primary Color"
          value={settings.primaryColor}
        />
        <ColorInput
          setId="interface.secondaryColor"
          label="Secondary Color"
          value={settings.secondaryColor}
        />
        <SelectInput
          label="Show Photo Preview"
          setId="interface.photoPreview"
          defaultValue={settings.photoPreview}
          defaultItems={[
            { value: 'none', label: 'None' },
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ]}
        />
        <TextInput
          setId="interface.initialCount"
          label="Initial Count Seconds"
          type="number"
          defaultValue={(settings.initialCount - 1).toString()}
          validations={[blankError, floatError, getGreaterError(1)]}
          parser={parsePlus1}
        />
        <TextInput
          setId="interface.countTime"
          label="Standard Count Seconds"
          type="number"
          defaultValue={(settings.countTime - 1).toString()}
          validations={[blankError, floatError, getGreaterError(1)]}
          parser={parsePlus1}
        />
        <TextInput
          setId="interface.waitTime"
          label="Wait Seconds"
          type="number"
          defaultValue={settings.waitTime.toString()}
          validations={[blankError, floatError, getGreaterError(1)]}
          parser={Number}
        />
      </div>
    );
  },
);

export default InterfaceSettings;
