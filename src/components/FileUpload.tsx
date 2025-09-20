import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, X } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  isUploading: boolean;
  uploadProgress: number;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isUploading, uploadProgress, onClose }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('audio/')
    );
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  }, [onUpload]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Adicionar Músicas</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isUploading ? (
          <div className="space-y-4">
            <div className="text-center">
              <Music className="w-12 h-12 text-primary-500 mx-auto mb-2 animate-pulse" />
              <p className="text-white">Enviando música...</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-400">
              {uploadProgress.toFixed(0)}% completo
            </p>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white mb-2">
              Arraste e solte arquivos de música aqui
            </p>
            <p className="text-gray-400 text-sm mb-4">
              ou clique para selecionar arquivos
            </p>
            <input
              type="file"
              accept="audio/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg cursor-pointer transition-colors"
            >
              Selecionar Arquivos
            </label>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FileUpload;
