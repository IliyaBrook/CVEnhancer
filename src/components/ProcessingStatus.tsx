import React from 'react';
import type { ProcessingStatus as StatusType } from '@/types';

interface ProcessingStatusProps {
  status: StatusType;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ status }) => {
  if (status === 'idle') return null;

  const statusConfig = {
    uploading: {
      text: 'Uploading file...',
      color: 'blue',
      spinner: true
    },
    parsing: {
      text: 'Parsing document...',
      color: 'blue',
      spinner: true
    },
    enhancing: {
      text: 'Enhancing resume with AI...',
      color: 'purple',
      spinner: true
    },
    completed: {
      text: 'Resume enhanced successfully!',
      color: 'green',
      spinner: false
    },
    error: {
      text: 'Processing failed. Please try again.',
      color: 'red',
      spinner: false
    }
  };

  const config = statusConfig[status];

  const colorClasses: Record<string, string> = {
    blue: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 text-blue-800 shadow-blue-500/20',
    purple: 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-300 text-purple-800 shadow-purple-500/20',
    green: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-800 shadow-emerald-500/20',
    red: 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 text-rose-800 shadow-rose-500/20'
  };

  return (
    <div className={`rounded-xl border-2 p-4 shadow-lg transition-all duration-300 ${colorClasses[config.color]}`}>
      <div className="flex items-center gap-3">
        {config.spinner && (
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 rounded-full border-4 border-current opacity-20"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-current"></div>
          </div>
        )}
        <p className="font-medium">{config.text}</p>
      </div>
    </div>
  );
};