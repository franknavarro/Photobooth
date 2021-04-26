import { FC } from 'react';
import {
  negativeError,
  blankError,
  floatError,
  getBetweenError,
} from '../../helpers/validations';
import FileInput from '../../components/FileInput';
import SelectInput from '../../components/SelectInput';
import TextInput from '../../components/TextInput';
import Typography from '@material-ui/core/Typography';

interface PhotostripSettingsProps {
  settings: PhotoboothStore['photostrip'];
}

type StripSize = PhotoboothStore['photostrip']['stripSize'];

const PhotostripSettings: FC<PhotostripSettingsProps> = ({ settings }) => {
  const sameStripSize = (compare: StripSize): StripSize => {
    return compare.height === settings.stripSize.height &&
      compare.width === settings.stripSize.width
      ? settings.stripSize
      : compare;
  };

  return (
    <div>
      <Typography variant="h4">Photostrip</Typography>
      <TextInput
        setId="photostrip.borders.horizontal"
        label="Horizontal Borders"
        type="number"
        value={settings.borders.horizontal}
        validations={[negativeError, blankError, floatError]}
        parser={Number}
      />
      <TextInput
        setId="photostrip.borders.vertical"
        label="Vertical Borders"
        type="number"
        value={settings.borders.vertical}
        validations={[negativeError, blankError, floatError]}
        parser={Number}
      />
      <TextInput
        setId="photostrip.maxPhotos"
        label="Max Photos"
        type="number"
        value={settings.maxPhotos}
        validations={[blankError, floatError, getBetweenError(1, 4)]}
        parser={Number}
      />
      <SelectInput
        label="Photostrip Size (in)"
        setId="photostrip.stripSize"
        value={settings.stripSize}
        items={[
          { value: sameStripSize({ height: 6, width: 2 }), label: '2 x 6' },
          { value: sameStripSize({ height: 6, width: 4 }), label: '4 x 6' },
        ]}
      />
      <FileInput
        setId="photostrip.stripImage"
        label="Photostrip Image"
        value={settings.stripImage}
      />
    </div>
  );
};

export default PhotostripSettings;
