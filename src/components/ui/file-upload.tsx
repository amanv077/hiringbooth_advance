'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUpload: (url: string, fileName: string) => void;
  accept?: 'image' | 'document' | 'all';
  maxSize?: number; // in MB
  currentFile?: string;
  onRemove?: () => void;
  label?: string;
  className?: string;
}

export default function FileUpload({
  onUpload,
  accept = 'all',
  maxSize = 10,
  currentFile,
  onRemove,
  label,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const getAcceptedFiles = (): Record<string, string[]> => {
    switch (accept) {
      case 'image':
        return {
          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        };
      case 'document':
        return {
          'application/pdf': ['.pdf'],
          'application/msword': ['.doc'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        };
      default:
        return {
          'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
          'application/pdf': ['.pdf'],
          'application/msword': ['.doc'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        };
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadProgress(0);    try {
      console.log('Starting file upload:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', accept === 'image' ? 'logos' : 'documents');

      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      console.log('Making upload request...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        onUpload(result.url, result.fileName);
        toast.success('File uploaded successfully!', {
          icon: '✅',
        });
      } else {
        const error = await response.json();
        console.error('Upload failed:', error);
        const errorMessage = error.error || error.details || 'Upload failed';
        toast.error(errorMessage, {
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      toast.error(errorMessage, {
        icon: '❌',
      });
    }finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUpload, accept]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptedFiles(),
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false
  });

  const getFileIcon = (fileName: string) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return <Image className="h-6 w-6" />;
    }
    return <File className="h-6 w-6" />;
  };

  if (currentFile) {
    return (
      <div className={`border border-gray-300 rounded-md p-4 ${className}`}>
        {label && <label className="block text-sm font-medium mb-2">{label}</label>}
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <div className="flex items-center space-x-3">
            {getFileIcon(currentFile)}
            <span className="text-sm text-gray-700 truncate max-w-xs">
              {currentFile.split('/').pop()}
            </span>
          </div>
          {onRemove && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <div>
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-1">
                  Drop files here or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  {accept === 'image' && 'Images only (PNG, JPG, GIF) '}
                  {accept === 'document' && 'Documents only (PDF, DOC, DOCX) '}
                  Max {maxSize}MB
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
