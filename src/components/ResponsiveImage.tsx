import { FC, useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { debounce } from 'throttle-debounce';

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  imageContainerDecorated: {
    padding: `0 ${theme.spacing(5)}px`,
  },
  imageSizer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: theme.spacing(3),
    objectFit: 'cover',
  },
  imageDecorated: {
    border: `${theme.spacing()}px solid white`,
  },
}));

interface ResponsiveImageProps {
  src: string;
  ratio: ImageRatio;
  decorated?: boolean;
}

const ResponsiveImage: FC<ResponsiveImageProps> = ({
  src,
  ratio,
  decorated = false,
}) => {
  const classes = useStyles();
  const [imageSize, resizeImage] = useState<ImageRatio>({
    height: 0,
    width: 0,
  });
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      const defaultSize = { clientHeight: 0, clientWidth: 0 };
      const { clientHeight, clientWidth } = container.current || defaultSize;
      const { width, height } = ratio;
      const widthCalc: ImageRatio = {
        width: (clientHeight * width) / height,
        height: clientHeight,
      };
      const heightCalc: ImageRatio = {
        width: clientWidth,
        height: (clientWidth * height) / width,
      };
      resizeImage(widthCalc.width <= clientWidth ? widthCalc : heightCalc);
    };
    resize();
    const debounceResize = debounce(300, false, resize);
    window.addEventListener('resize', debounceResize);

    return () => window.removeEventListener('resize', debounceResize);
  }, [ratio]);

  return (
    <div
      className={clsx(classes.imageContainer, {
        [classes.imageContainerDecorated]: decorated,
      })}
    >
      <div className={classes.imageSizer} ref={container}>
        <img
          style={imageSize}
          className={clsx(classes.image, {
            [classes.imageDecorated]: decorated,
          })}
          src={src}
          alt=""
        />
      </div>
    </div>
  );
};

export default ResponsiveImage;
