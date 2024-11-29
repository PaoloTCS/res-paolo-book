import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PDFUploadComponent = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  const processFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    try {
      setUploadStatus('processing');
      setProgress(0);
      setError(null);

      const reader = new FileReader();
      
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = Math.round((event.loaded / event.total) * 100);
          setProgress(percentLoaded);
        }
      };

      reader.onload = async () => {
        try {
          // Create base64 string for further processing
          const base64String = reader.result.split(',')[1];
          
          // Create initial JSON structure
          const processedData = {
            metadata: {
              filename: file.name,
              fileSize: file.size,
              fileType: file.type,
              lastModified: new Date(file.lastModified).toISOString(),
              uploadDate: new Date().toISOString()
            },
            content: {
              base64: base64String,
              // Add more content processing here as needed
            }
          };

          setProcessedData(processedData);
          setUploadStatus('complete');
          setProgress(100);
        } catch (err) {
          setError('Error processing file: ' + err.message);
          setUploadStatus('error');
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setUploadStatus('error');
      };

      reader.readAsDataURL(file);

    } catch (err) {
      setError('Error processing PDF: ' + err.message);
      setUploadStatus('error');
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  }, []);

  const downloadJSON = useCallback(() => {
    if (!processedData) return;

    const jsonString = JSON.stringify(processedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${processedData.metadata.filename.replace('.pdf', '')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [processedData]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${uploadStatus === 'processing' ? 'border-yellow-500 bg-yellow-50' : ''}
          ${uploadStatus === 'complete' ? 'border-green-500 bg-green-50' : ''}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <Upload 
            className={`w-12 h-12 
              ${isDragging ? 'text-blue-500' : 'text-gray-400'}
              ${uploadStatus === 'complete' ? 'text-green-500' : ''}
              ${uploadStatus === 'error' ? 'text-red-500' : ''}`}
          />
          
          <div className="text-lg font-medium">
            {uploadStatus === 'idle' && 'Drag and drop your PDF here'}
            {uploadStatus === 'processing' && 'Processing PDF...'}
            {uploadStatus === 'complete' && 'Processing Complete'}
            {uploadStatus === 'error' && 'Error Processing PDF'}
          </div>

          {uploadStatus === 'processing' && (
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="text-sm text-gray-500">or</div>

          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Select PDF File
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileSelect}
            />
          </label>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'complete' && (
        <Alert className="mt-4 border-green-500">
          <FileText className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            PDF processed successfully. File size: {Math.round(processedData?.metadata?.fileSize / 1024)} KB
          </AlertDescription>
        </Alert>
      )}

      {processedData && (
        <div className="mt-4">
          <button
            onClick={downloadJSON}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFUploadComponent;