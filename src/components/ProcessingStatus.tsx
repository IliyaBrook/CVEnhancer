import React from 'react';
import type { ProcessingStatus as StatusType } from '../types';

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

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800'
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${colorClasses[config.color]}`}>
      <div className="flex items-center gap-3">
        {config.spinner && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
        )}
        <p className="font-medium">{config.text}</p>
      </div>
    </div>
  );
};