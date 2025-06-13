import { useState, useCallback } from 'react';

/**
 * UploadThing hook for SDK 7+
 * Uses the new uploadFiles API from @uploadthing/react
 */
export const useUploadThing = (endpoint, options = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    onClientUploadComplete,
    onUploadError,
    onUploadProgress,
    onUploadBegin
  } = options;

  const startUpload = useCallback(async (files, input = {}) => {
    if (!files || files.length === 0) {
      const error = new Error('No files provided for upload');
      onUploadError?.(error);
      throw error;
    }

    setIsUploading(true);
    setUploadProgress(0);
    onUploadBegin?.(files);

    try {
      // Use the new uploadFiles API from SDK 7+
      const { uploadFiles } = await import('@uploadthing/react');
      
      const results = await uploadFiles(endpoint, {
        files,
        input,
        onUploadProgress: ({ progress, file }) => {
          setUploadProgress(progress);
          onUploadProgress?.(progress, file);
        },
        onUploadBegin: (fileName) => {
          console.log(`Upload started for ${fileName}`);
        },
      });

      setUploadProgress(100);
      onClientUploadComplete?.(results);
      
      return results;

    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [endpoint, onClientUploadComplete, onUploadError, onUploadProgress, onUploadBegin]);

  return {
    startUpload,
    isUploading,
    uploadProgress,
  };
};