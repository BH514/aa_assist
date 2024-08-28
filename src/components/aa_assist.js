import React, { useState } from 'react';
//import { BlobServiceClient } from '@azure/storage-blob';
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

  const getSasUrl = () => {
    // In a real application, this would be an API call to your backend
    // The backend would generate a SAS URL and return it
    // For demonstration purposes, we're using a placeholder
    return 'https://saccaaassistdata01.blob.core.windows.net/raw/your-blob-name?sp=racwdl&st=2024-08-28T15:31:57Z&se=2024-09-30T23:31:57Z&spr=https&sv=2022-11-02&sr=c&sig=fdYU11PiLulWXSLYUrM7kUESgPo574bUp%2B%2FUBHvbg4Y%3D'; // Placeholder SAS URL
  };
  
  const uploadToAzure = async (file) => {
    const sasUrl = getSasUrl();
    
    try {
      const response = await fetch(sasUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type,
        },
        body: file,
      });
  
      if (response.ok) {
        console.log(`File "${file.name}" uploaded successfully`);
        return sasUrl;
      } else {
        console.error('Error uploading file:', response.statusText);
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
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

      // Simulating transcription process
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
          <div className={styles.progressBar} style={{width: `${uploadProgress}%`}}></div>
        </div>
      )}
      
      {transcription && (
        <div className={styles.transcriptionResult}>
          <h2>Transcription Result</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default AudioTranscriptionDemo;

// import React, { useState } from 'react';
// import styles from './aa_assist.module.css';

// const AudioTranscriptionDemo = () => {
//   const [file, setFile] = useState(null);
//   const [transcription, setTranscription] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileInput = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type.startsWith('audio/')) {
//       setFile(selectedFile);
//       setError('');
//     } else {
//       setError('Please select a valid audio file.');
//     }
//   };

//   const handleTranscribe = async () => {
//     if (!file) {
//       setError('Please select an audio file first.');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     // Simulating transcription process
//     setTimeout(() => {
//       setTranscription(`This is a simulated transcription of "${file.name}". In a real application, this would be the result of processing the audio file through a transcription service.`);
//       setIsLoading(false);
//     }, 3000);
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>aa_assist</h1>
//       <div className={styles.uploadArea}>
//         <input
//           type="file"
//           accept="audio/*"
//           onChange={handleFileInput}
//           className={styles.fileInput}
//           id="fileInput"
//         />
//         <label htmlFor="fileInput" className={styles.fileInputLabel}>
//           Choose an audio file
//         </label>
//         {file && <p className={styles.fileName}>Selected file: {file.name}</p>}
//       </div>
      
//       {error && <p className={styles.error}>{error}</p>}
      
//       <button 
//         onClick={handleTranscribe}
//         disabled={!file || isLoading}
//         className={styles.button}
//       >
//         {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
//       </button>
      
//       {isLoading && <div className={styles.loader}></div>}
      
//       {transcription && (
//         <div className={styles.transcriptionResult}>
//           <h2>Transcription Result</h2>
//           <p>{transcription}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AudioTranscriptionDemo;

// import React, { useState } from 'react';

// const AudioTranscriptionDemo = () => {
//   const [file, setFile] = useState(null);
//   const [transcription, setTranscription] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileInput = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type.startsWith('audio/')) {
//       setFile(selectedFile);
//       setError('');
//     } else {
//       setError('Please select a valid audio file.');
//     }
//   };

//   const handleTranscribe = async () => {
//     if (!file) {
//       setError('Please select an audio file first.');
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     // Simulating transcription process
//     setTimeout(() => {
//       setTranscription(`This is a simulated transcription of "${file.name}". In a real application, this would be the result of processing the audio file through a transcription service.`);
//       setIsLoading(false);
//     }, 3000);
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
//       <h1>aa_assist</h1>
//       <div>
//         <input
//           type="file"
//           accept="audio/*"
//           onChange={handleFileInput}
//         />
//         {file && <p>Selected file: {file.name}</p>}
//       </div>
      
//       {error && <p style={{ color: 'red' }}>{error}</p>}
      
//       <button 
//         onClick={handleTranscribe}
//         disabled={!file || isLoading}
//         style={{ marginTop: '10px' }}
//       >
//         {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
//       </button>
      
//       {isLoading && <p>Loading...</p>}
      
//       {transcription && (
//         <div style={{ marginTop: '20px' }}>
//           <h2>Transcription Result</h2>
//           <p>{transcription}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AudioTranscriptionDemo;