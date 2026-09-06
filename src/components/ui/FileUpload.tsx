'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSizeMb?: number;
  onFileSelect: (file: File) => void;
  label?: string;
  error?: string;
}

export function FileUpload({
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMb = 5,
  onFileSelect,
  label = 'Upload Document',
  error,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setFileError(null);
    if (file.size > maxSizeMb * 1024 * 1024) {
      setFileError(`File size exceeds ${maxSizeMb}MB limit.`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          dragActive
            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/20'
            : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 bg-slate-50/50 dark:bg-slate-900/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm w-full max-w-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="p-1 text-slate-400 hover:text-rose-500 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <UploadCloud className="w-8 h-8 mx-auto text-slate-400" />
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Drag & drop file here, or <span className="text-sky-600 dark:text-sky-400">browse</span>
            </p>
            <p className="text-xs text-slate-500">Max size: {maxSizeMb}MB ({accept})</p>
          </div>
        )}
      </div>

      {(fileError || error) && (
        <p className="text-xs text-rose-500 font-medium">{fileError || error}</p>
      )}
    </div>
  );
}
