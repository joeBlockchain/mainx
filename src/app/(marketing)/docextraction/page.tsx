"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [extractedData, setExtractedData] = useState<
    { companyName: string; date: string }[]
  >([]);

  const processFileWithOpenAI = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const textContent = event.target.result as string;
        try {
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [
                {
                  role: "system",
                  content:
                    'You are a document analyzer. Please extract information from the text and return it in JSON format. Example of expected JSON output: {"companyName": "Example Corp", "date": "2023-01-01", "governingLaw": "California"}.',
                },
                {
                  role: "user",
                  content: textContent,
                },
              ],
              temperature: 0.5,
              response_format: { type: "json_object" }, // Ensuring the response is in JSON format
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Response:", response);

          // Assuming the response is in JSON format and directly usable
          const { companyName, date, governingLaw } = JSON.parse(
            response.data.choices[0].message.content
          );
          setExtractedData((prevData) => [
            ...prevData,
            { companyName, date, governingLaw },
          ]);
        } catch (error) {
          console.error("Error processing file with OpenAI:", error);
        }
      } else {
        console.error("FileReader event target is null or result is undefined");
      }
    };
    reader.readAsText(file); // Adjust this method based on the file type you are handling
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    acceptedFiles.forEach((file) => {
      processFileWithOpenAI(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #0070f3",
          padding: "20px",
          cursor: "pointer",
        }}
      >
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
      <div>
        <h3>Extracted Data:</h3>
        {extractedData.map((data, index) => (
          <div key={index}>
            <p>Company Name: {data.companyName}</p>
            <p>Date: {data.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadPage;
