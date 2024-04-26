"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'convex/react';
import { api } from '@/../convex/_generated/api';

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach(async (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const fileContent = event.target.result;
          // Process the file content as needed
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} style={{ border: '2px dashed #0070f3', padding: '20px', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <p>Drag and drop some files here, or click to select files</p>
      </div>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file.name} - {file.size} bytes - Type: {file.type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadPage;