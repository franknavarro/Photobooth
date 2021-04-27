import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    flex: 5,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  stretchImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
  },
  stretchImageDecorated: {
    padding: `0 ${theme.spacing(5)}px`,
  },
  resizeImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
    aspectRatio: '3 / 2',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    minWidth: '100%',
    minHeight: '100%',
    borderRadius: theme.spacing(3),
    objectFit: 'cover',
  },
  imageDecorated: {
    border: `${theme.spacing()}px solid white`,
  },
}));

interface ResponsiveImageProps {
  src: string;
  decorated?: boolean;
}

const ResponsiveImage: FC<ResponsiveImageProps> = ({
  src,
  decorated = false,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.imageContainer}>
      <div
        className={clsx(classes.stretchImage, {
          [classes.stretchImageDecorated]: decorated,
        })}
      >
        <div className={classes.resizeImage}>
          <img
            className={clsx(classes.image, {
              [classes.imageDecorated]: decorated,
            })}
            src={src}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsiveImage;
