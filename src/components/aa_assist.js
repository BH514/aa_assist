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
    //const accountKey = "R2eKrDybGVUvGro8lFJKPpp36HhFpTCi+yTET3wFwYGfN8DQ6h4mQ6d2kWceR94ymQWPeQINSkh4+ASt6HcIpw=="; // Make sure this is set in your .env file
    const containerName = "raw";

    // if (!accountKey) {
    //   throw new Error('Azure Storage account key is not set');
    // }

    //const connectionString = 'DefaultEndpointsProtocol=https;AccountName=saccaaassistdata01;AccountKey=R2eKrDybGVUvGro8lFJKPpp36HhFpTCi+yTET3wFwYGfN8DQ6h4mQ6d2kWceR94ymQWPeQINSkh4+ASt6HcIpw==;EndpointSuffix=core.windows.net';
    //const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    //const containerClient = blobServiceClient.getContainerClient(containerName);
    //const blobClient = containerClient.getBlockBlobClient(file.name);

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
  );
};

export default AudioTranscriptionDemo;

// import React, { useState } from 'react';
// //import { BlobServiceClient } from '@azure/storage-blob';
// import styles from './aa_assist.module.css';

// const AudioTranscriptionDemo = () => {
//   const [file, setFile] = useState(null);
//   const [transcription, setTranscription] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const handleFileInput = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type.startsWith('audio/')) {
//       setFile(selectedFile);
//       setError('');
//     } else {
//       setError('Please select a valid audio file.');
//     }
//   };

//   const getSasUrl = () => {
//     return 'https://saccaaassistdata01.blob.core.windows.net/raw?sp=racwdli&st=2024-08-28T16:20:31Z&se=2024-10-01T00:20:31Z&sv=2022-11-02&sr=c&sig=F4k8OBOV8B2V%2F%2B0zlROg6gB9wdaArJueA%2FLQlmLRvbo%3D';
//   };

//   const uploadToAzure = async (file) => {
//     const sasUrl = getSasUrl();
  
//     try {
//       const response = await fetch(sasUrl, {
//         method: 'PUT',
//         headers: {
//           'x-ms-blob-type': 'BlockBlob',
//           'Content-Type': file.type,
//         },
//         body: file,
//       });
  
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Error response:', response.status, errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       console.log(`File "${file.name}" uploaded successfully`);
//       return sasUrl.split('?')[0]; // Return the URL without the SAS token
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       throw error;
//     }
//   };
  
//   const handleTranscribe = async () => {
//     if (!file) {
//       setError('Please select an audio file first.');
//       return;
//     }

//     setIsLoading(true);
//     setError('');
//     setUploadProgress(0);

//     try {
//       const blobUrl = await uploadToAzure(file);
//       console.log('File uploaded to:', blobUrl);

//       // Simulating transcription process
//       setTimeout(() => {
//         setTranscription(`This is a simulated transcription of "${file.name}". In a real application, this would be the result of processing the audio file through a transcription service. The file was uploaded to ${blobUrl}`);
//         setIsLoading(false);
//       }, 3000);
//     } catch (error) {
//       setError('Error uploading file: ' + error.message);
//       setIsLoading(false);
//     }
//   };



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