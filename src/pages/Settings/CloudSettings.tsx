import { useCallback, useMemo, useState, forwardRef } from 'react';
import { debounce } from 'throttle-debounce';
import clsx from 'clsx';
import FileInput from '../../components/FileInput';
import SelectInput, { ItemFetch } from '../../components/SelectInput';
import TextInput from '../../components/TextInput';
import Typography from '@material-ui/core/Typography';

interface CloudSettingsProps {
  settings: PhotoboothStore['cloud'];
  className?: string;
}

const CloudSettings = forwardRef<HTMLDivElement, CloudSettingsProps>(
  ({ settings, className }, ref) => {
    const [projectId, setProjectId] = useState<string>(settings.projectId);
    const [keyFilename, setKeyFile] = useState<string>(settings.keyFilename);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const ddebouncedProjectId = useMemo(
      () => debounce(500, false, (id: string) => setProjectId(id)),
      [],
    );

    const getBucket = useCallback<ItemFetch>(
      async (setItems) => {
        try {
          setLoading(true);
          setError('');
          const buckets = await window.cloud.getBuckets({
            projectId,
            keyFilename,
          });
          setItems(buckets.map((b) => ({ label: b, value: b })));
        } catch (error) {
          const message = error.message.split(':').splice(1).join();
          setError(message);
          throw new Error(message);
        } finally {
          setLoading(false);
        }
      },
      [projectId, keyFilename],
    );

    const showExtraFields = () => {
      if (projectId && keyFilename) {
        return (
          <>
            <SelectInput
              label="Bucket Name"
              setId="cloud.bucketName"
              value={settings.bucketName}
              dataFetch={getBucket}
            />
            {!error && !loading && (
              <TextInput
                value={settings.bucketPath}
                setId="cloud.bucketPath"
                label="Save File to Path in Bucket"
              />
            )}
          </>
        );
      }
    };

    return (
      <div ref={ref} className={clsx(className)}>
        <Typography variant="h4">Google Cloud Storage</Typography>
        <FileInput
          value={keyFilename}
          setId="cloud.keyFilename"
          label="Private Key File Path"
          accept="application/JSON"
          onChange={(file) => setKeyFile(file)}
        />
        <TextInput
          value={projectId}
          setId="cloud.projectId"
          label="Project ID"
          onChange={(id) => ddebouncedProjectId(id)}
        />
        {showExtraFields()}
      </div>
    );
  },
);

export default CloudSettings;
