import { useState, useEffect, useCallback } from 'react';

const useLivePreview = (framerate = 20) => {
  const [run, setRun] = useState(false);
  const [previewImg, setPreviewImg] = useState('');

  const removeImage = useCallback((img) => {
    if (img) window.camera.deleteImg(img);
  }, []);

  const resetImage = useCallback(
    (currentImage) => {
      setPreviewImg((oldImage) => {
        removeImage(oldImage);
        return currentImage;
      });
    },
    [removeImage],
  );

  useEffect(() => {
    let timeout;
    const updatePreview = async () => {
      if (run) {
        const timePrev = window.standard.hrtime();
        const newPreview = await window.camera.getPreview();
        const timeDiff = window.standard.hrtime(timePrev);
        const waitTime =
          1000 / 20 - (timeDiff[0] * 1000 + timeDiff[1] / 1000000);
        timeout = setTimeout(() => resetImage(newPreview), waitTime);
      }
    };
    updatePreview();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        removeImage(previewImg);
      }
    };
  }, [run, previewImg, resetImage, removeImage]);

  return [previewImg, run, setRun];
};

export default useLivePreview;
