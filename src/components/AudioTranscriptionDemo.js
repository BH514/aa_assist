import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Amplify, API } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

const AudioTranscriptionDemo = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // You can add any initialization logic here if needed
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a valid audio file.');
    }
  };

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

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Audio = reader.result.split(',')[1];

        // Call API Gateway endpoint
        const response = await API.post('transcribeApi', '/transcribe', {
          body: {
            audio: base64Audio,
            fileName: file.name
          }
        });

        setTranscription(response.transcription);
      };
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred during transcription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Audio Transcription Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input
              id="fileInput"
              type="file"
              accept="audio/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Drag and drop an audio file here, or click to select a file
            </p>
            {file && (
              <p className="mt-2 text-sm text-green-600">
                Selected file: {file.name}
              </p>
            )}
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            className="w-full mt-4" 
            onClick={handleTranscribe}
            disabled={!file || isLoading}
          >
            {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
          </Button>
          
          {isLoading && (
            <Progress value={66} className="mt-4" />
          )}
          
          {transcription && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2" />
                  Transcription Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{transcription}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioTranscriptionDemo;