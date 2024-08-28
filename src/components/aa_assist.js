import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import styles from './aa_assist.module.css';

const AudioTranscriptionDemo = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid audio file.');
    }
  };

  const uploadToAzure = async (file) => {
    const containerName = "raw";
    const blobServiceClient = new BlobServiceClient(
      'https://saccaaassistdata01.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-10-01T00:52:25Z&st=2024-08-28T16:52:25Z&spr=https,http&sig=%2FKkOmsaNLNxsx9eWfXvRzJZShfZywwNp%2FMVo46lDxF8%3D'  
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(file.name);

    try {
      const response = await blobClient.uploadData(file, {
        onProgress: (progress) => {
          setUploadProgress((progress.loadedBytes / file.size) * 100);
        },
        blobHTTPHeaders: { blobContentType: file.type }
      });

      if (response.errorCode) {
        throw new Error(`Upload failed with error code: ${response.errorCode}`);
      }

      console.log(`File "${file.name}" uploaded successfully`);
      return blobClient.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select an audio file first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const blobUrl = await uploadToAzure(file);
      console.log('File uploaded to:', blobUrl);

      setTimeout(() => {
        setTranscription(`This is a simulated transcription of "${file.name}". In a real application, this would be the result of processing the audio file through a transcription service. The file was uploaded to ${blobUrl}`);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      setError('Error uploading file: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>aa_assist</h1>
        <div className={styles.uploadArea}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className={styles.fileInput}
            id="fileInput"
          />
          <label htmlFor="fileInput" className={styles.fileInputLabel}>
            Choose an audio file
          </label>
          {file && <p className={styles.fileName}>Selected file: {file.name}</p>}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button
          onClick={handleTranscribe}
          disabled={!file || isLoading}
          className={styles.button}
        >
          {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>
        {isLoading && (
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        {transcription && (
          <div className={styles.transcriptionResult}>
            <h2>Transcription Result</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioTranscriptionDemo;