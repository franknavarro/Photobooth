import { FC } from 'react';
import {
  blankError,
  floatError,
  getGreaterError,
} from '../../helpers/validations';
import TextInput from '../../components/TextInput';
import Typography from '@material-ui/core/Typography';

interface InterfaceSettingsProps {
  settings: PhotoboothStore['interface'];
}

const InterfaceSettings: FC<InterfaceSettingsProps> = ({ settings }) => {
  console.log(settings);
  const parsePlus1 = (v: string) => parseInt(v) + 1;
  return (
    <div>
      <Typography variant="h4">Interface</Typography>
      <TextInput
        setId="interface.initialCount"
        label="Initial Count Seconds"
        type="number"
        value={settings.initialCount - 1}
        validations={[blankError, floatError, getGreaterError(1)]}
        parser={parsePlus1}
      />
      <TextInput
        setId="interface.countTime"
        label="Standard Count Seconds"
        type="number"
        value={settings.countTime - 1}
        validations={[blankError, floatError, getGreaterError(1)]}
        parser={parsePlus1}
      />
      <TextInput
        setId="interface.waitTime"
        label="Wait Seconds"
        type="number"
        value={settings.waitTime}
        validations={[blankError, floatError, getGreaterError(1)]}
        parser={Number}
      />
    </div>
  );
};

export default InterfaceSettings;
