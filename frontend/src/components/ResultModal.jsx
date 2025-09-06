import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ResultModal = ({ isOpen, type, message, onClose }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-blue-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          text: 'text-red-700',
          progress: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          progress: 'bg-blue-500'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-sm overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Modal Body */}
        <div className="px-6 py-8 text-center">
          <div className="mb-4">
            <div className={`p-3 ${colors.bg} rounded-full w-fit mx-auto`}>
              {getIcon()}
            </div>
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${colors.text}`}>
            {type === 'success' ? 'Berhasil!' : 
             type === 'error' ? 'Gagal!' : 'Informasi'}
          </h3>
          <p className="text-gray-600 text-sm">
            {message}
          </p>
        </div>

        {/* Auto progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className={`h-full transition-all duration-3000 ease-linear ${colors.progress}`}
            style={{ 
              width: '0%',
              animation: 'progress 3s linear forwards'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default ResultModal;