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
      spinner: true,
    },
    parsing: {
      text: 'Parsing document...',
      color: 'blue',
      spinner: true,
    },
    enhancing: {
      text: 'Enhancing resume with AI...',
      color: 'purple',
      spinner: true,
    },
    completed: {
      text: 'Resume enhanced successfully!',
      color: 'green',
      spinner: false,
    },
    error: {
      text: 'Processing failed. Please try again.',
      color: 'red',
      spinner: false,
    },
  };

  const config = statusConfig[status];

  const colorClasses: Record<string, string> = {
    blue: 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 text-blue-800 shadow-blue-500/20',
    purple: 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-300 text-purple-800 shadow-purple-500/20',
    green: 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 text-emerald-800 shadow-emerald-500/20',
    red: 'bg-gradient-to-r from-rose-50 to-red-50 border-rose-300 text-rose-800 shadow-rose-500/20',
  };

  return (
    <div
      className={`w-full rounded-2xl border-2 px-5 py-3.5 shadow-lg transition-all duration-300 ${colorClasses[config.color]}`}
    >
      <div className="flex items-center gap-2.5">
        {config.spinner && (
          <div className="relative h-5 w-5">
            <div className="border-3 absolute inset-0 rounded-full border-current opacity-20"></div>
            <div className="border-3 absolute inset-0 animate-spin rounded-full border-transparent border-t-current"></div>
          </div>
        )}
        <p className="text-sm font-medium">{config.text}</p>
      </div>
    </div>
  );
};
