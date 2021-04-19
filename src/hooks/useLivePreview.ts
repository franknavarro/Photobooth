import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';

type ResetImage = (file: string) => void;
type SetRun = Dispatch<SetStateAction<boolean>>;

const useLivePreview = (): [string, boolean, SetRun] => {
  const [run, setRun] = useState<boolean>(false);
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
