import { forwardRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  negativeError,
  blankError,
  floatError,
  getBetweenError,
} from '../../helpers/validations';
import clsx from 'clsx';
import Header from '../../components/Header';
import FileInput from '../../components/FileInput';
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

interface PhotostripSettingsProps {
  settings: PhotoboothStore['photostrip'];
  className?: string;
}

type StripSize = PhotoboothStore['photostrip']['stripSize'];

const PhotostripSettings = forwardRef<HTMLDivElement, PhotostripSettingsProps>(
  ({ settings, className }, ref) => {
    const classes = useStyles();
    const sameStripSize = (compare: StripSize): StripSize => {
      return compare.height === settings.stripSize.height &&
        compare.width === settings.stripSize.width
        ? settings.stripSize
        : compare;
    };

    return (
      <div ref={ref} className={clsx(className)}>
        <Header top>Photostrip</Header>
        <SelectInput
          label="Photostrip Size (in)"
          setId="photostrip.stripSize"
          defaultValue={settings.stripSize}
          defaultItems={[
            { value: sameStripSize({ height: 6, width: 2 }), label: '2 x 6' },
            { value: sameStripSize({ height: 6, width: 4 }), label: '4 x 6' },
          ]}
        />
        <SelectInput
          label="Image Size (in)"
          setId="photostrip.photoSize"
          defaultValue={settings.photoSize}
          defaultItems={[
            { value: 'evenly', label: 'Split evenly' },
            { value: '3x2', label: '3 x 2' },
          ]}
        />
        <FileInput
          setId="photostrip.stripImage"
          label="Photostrip Image"
          accept="image/*"
          value={settings.stripImage}
        />
        <TextInput
          setId="photostrip.maxPhotos"
          label="Max Photos"
          type="number"
          defaultValue={settings.maxPhotos.toString()}
          validations={[blankError, floatError, getBetweenError(1, 4)]}
          parser={Number}
        />
        <div className={classes.group}>
          <TextInput
            setId="photostrip.borders.horizontal"
            label="Horizontal Borders"
            type="number"
            defaultValue={settings.borders.horizontal.toString()}
            validations={[negativeError, blankError, floatError]}
            parser={Number}
          />
          <TextInput
            setId="photostrip.borders.vertical"
            label="Vertical Borders"
            type="number"
            defaultValue={settings.borders.vertical.toString()}
            validations={[negativeError, blankError, floatError]}
            parser={Number}
          />
        </div>
        <SelectInput
          label="Logo Position"
          setId="photostrip.logoPosition"
          defaultValue={settings.logoPosition}
          defaultItems={[
            { value: 'none', label: 'None' },
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
          ]}
        />
      </div>
    );
  },
);

export default PhotostripSettings;
