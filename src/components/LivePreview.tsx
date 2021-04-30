import { FC, useState, useEffect, useCallback } from 'react';
import ResponsiveImage from '../components/ResponsiveImage';

type ResetImage = (file: string) => void;

interface LivePreviewProps {
  ratio: ImageRatio;
  defaultSrc?: string;
  run?: boolean;
  hide?: boolean;
}

const LivePreview: FC<LivePreviewProps> = ({
  ratio,
  defaultSrc,
  hide = false,
  run = true,
}) => {
  const [previewImg, setPreviewImg] = useState<string>('');

  const removeImage = useCallback((img) => {
    if (img) window.camera.deleteImg(img);
  }, []);

  const resetImage = useCallback<ResetImage>(
    (currentImage) => {
      setPreviewImg((oldImage) => {
        removeImage(oldImage);
        return currentImage;
      });
    },
    [removeImage],
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const updatePreview = async () => {
      const timePrev = window.standard.hrtime();
      const newPreview = await window.camera.getPreview();
      const timeDiff = window.standard.hrtime(timePrev);
      const waitTime = 1000 / 20 - (timeDiff[0] * 1000 + timeDiff[1] / 1000000);
      timeout = setTimeout(() => resetImage(newPreview), waitTime);
    };
    if (run) updatePreview();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        removeImage(previewImg);
      }
    };
  }, [run, previewImg, resetImage, removeImage]);

  if (hide) {
    return <></>;
  }
  return (
    <ResponsiveImage
      decorated
      ratio={ratio}
      src={`image://${!run && defaultSrc ? defaultSrc : previewImg}`}
    />
  );
};

export default LivePreview;
