import React, { useState } from 'react';

const aa_assist = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid audio file.');
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('Please select an audio file first.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulating transcription process
    setTimeout(() => {
      setTranscription(`This is a simulated transcription of "${file.name}". In a real application, this would be the result of processing the audio file through a transcription service.`);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>aa_assist</h1>
      <div>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
        />
        {file && <p>Selected file: {file.name}</p>}
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button 
        onClick={handleTranscribe}
        disabled={!file || isLoading}
        style={{ marginTop: '10px' }}
      >
        {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
      </button>
      
      {isLoading && <p>Loading...</p>}
      
      {transcription && (
        <div style={{ marginTop: '20px' }}>
          <h2>Transcription Result</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default aa_assist;