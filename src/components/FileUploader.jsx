import PropTypes from "prop-types";
import { useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { TbTrashFilled } from 'react-icons/tb';
import { Button } from './ui/button';
import { toast } from 'sonner';

const MIMETYPE = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/gif': ['.gif'],
  'image/bmp': ['.bmp'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/tiff': ['.tif', '.tiff'],
};
const MAX_FILE_SIZE_MB = 5 * 1024 * 1024; // 5MB

const FileUploader = ({
  files,
  onChange,
  FileComponent,
  NoFileComponent,
  isSingle,
  disabled, // Add the disabled prop here
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (disabled) return; // Prevent drop action when disabled

      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > MAX_FILE_SIZE_MB) {
          toast.error(`${file.name} is too large. Max size is 5MB`);
          return false;
        }
        return true;
      });
      const updatedFiles = isSingle
        ? validFiles.slice(0, 1)
        : [...files, ...validFiles].slice(0, 5); // Limit to 5 files
      onChange(updatedFiles);
    },
    [files, onChange, disabled, isSingle]
  );

  const handleRemoveFile = (e, fileToRemove) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    onChange(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: !isSingle,
    maxFiles: isSingle ? 1 : 4,
    accept: MIMETYPE,
    disabled, // Disable the dropzone if the disabled prop is true
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'drag-active' : ''} ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`} // Add visual feedback for disabled state
    >
      {Array.isArray(files) &&
        files?.length > 0 &&
        files?.map((file, index) => (
          <div key={index} className="flex items-center space-x-2 relative">
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => handleRemoveFile(e, file)}
              className="w-5 h-5 p-0 bg-[#FFA900] rounded-[100px] z-10 absolute -top-2 -right-2 text-white hover:text-[#FFA900]"
              disabled={disabled} // Disable the remove button if the uploader is disabled
            >
              <TbTrashFilled className="w-[14px] h-[14px] " />
            </Button>
          </div>
        ))}
      <input {...getInputProps()} disabled={disabled} />{' '}
      {/* Disable input when disabled */}
      {files && files.length > 0 ? (
        <FileComponent files={files} />
      ) : (
        <NoFileComponent />
      )}
    </div>
  );
};

FileUploader.propTypes = {
  files: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  FileComponent: PropTypes.elementType.isRequired,
  NoFileComponent: PropTypes.elementType.isRequired,
  isSingle: PropTypes.bool,
  disabled: PropTypes.bool, // Add disabled prop type
};

export default FileUploader;
