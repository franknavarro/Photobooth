import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
  group: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *:not(:first-child)': {
      marginLeft: theme.spacing(2),
    },
  },
}));

interface PhotostripSettingsProps {
  settings: PhotoboothStore['photostrip'];
}

type StripSize = PhotoboothStore['photostrip']['stripSize'];

const PhotostripSettings: FC<PhotostripSettingsProps> = ({ settings }) => {
  const classes = useStyles();
  const sameStripSize = (compare: StripSize): StripSize => {
    return compare.height === settings.stripSize.height &&
      compare.width === settings.stripSize.width
      ? settings.stripSize
      : compare;
  };

  return (
    <div>
      <Typography variant="h4">Photostrip</Typography>
      <SelectInput
        label="Photostrip Size (in)"
        setId="photostrip.stripSize"
        value={settings.stripSize}
        items={[
          { value: sameStripSize({ height: 6, width: 2 }), label: '2 x 6' },
          { value: sameStripSize({ height: 6, width: 4 }), label: '4 x 6' },
        ]}
      />
      <SelectInput
        label="Image Size (in)"
        setId="photostrip.photoSize"
        value={settings.photoSize}
        items={[
          { value: 'evenly', label: 'Split evenly' },
          { value: '3x2', label: '3 x 2' },
        ]}
      />
      <FileInput
        setId="photostrip.stripImage"
        label="Photostrip Image"
        value={settings.stripImage}
      />
      <TextInput
        setId="photostrip.maxPhotos"
        label="Max Photos"
        type="number"
        value={settings.maxPhotos}
        validations={[blankError, floatError, getBetweenError(1, 4)]}
        parser={Number}
      />
      <div className={classes.group}>
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
      </div>
      <SelectInput
        label="Logo Position"
        setId="photostrip.logoPosition"
        value={settings.logoPosition}
        items={[
          { value: 'none', label: 'None' },
          { value: 'top', label: 'Top' },
          { value: 'bottom', label: 'Bottom' },
        ]}
      />
    </div>
  );
};

export default PhotostripSettings;
