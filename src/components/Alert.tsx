import React, { useEffect, useState } from 'react';

export type AlertVariant = 'error' | 'info' | 'success' | 'warning';

export type AlertPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type AlertSize = 'sm' | 'md' | 'lg';

export interface AlertProps {
  open: boolean;
  title?: string;
  message: string;
  variant?: AlertVariant | (string & {});
  onClose?: () => void;
  closable?: boolean;
  autoClose?: number;
  icon?: React.ReactNode;
  showIcon?: boolean;
  position?: AlertPosition;
  size?: AlertSize;
  className?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  zIndex?: number;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; iconBg: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    iconBg: 'bg-green-100',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconBg: 'bg-red-100',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    iconBg: 'bg-yellow-100',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconBg: 'bg-blue-100',
  },
};

const variantIcons: Record<AlertVariant, React.ReactNode> = {
  success: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const sizeStyles: Record<AlertSize, { padding: string; titleSize: string; messageSize: string; iconSize: string }> = {
  sm: {
    padding: 'p-3',
    titleSize: 'text-sm',
    messageSize: 'text-xs',
    iconSize: 'h-4 w-4',
  },
  md: {
    padding: 'p-4',
    titleSize: 'text-base',
    messageSize: 'text-sm',
    iconSize: 'h-5 w-5',
  },
  lg: {
    padding: 'p-5',
    titleSize: 'text-lg',
    messageSize: 'text-base',
    iconSize: 'h-6 w-6',
  },
};

const positionStyles: Record<AlertPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

export const Alert: React.FC<AlertProps> = ({
  open,
  title,
  message,
  variant = 'info',
  onClose,
  closable = true,
  autoClose,
  icon,
  showIcon = true,
  position,
  size = 'md',
  className = '',
  actions,
  onClick,
  zIndex = 50,
}) => {
  const [isVisible, setIsVisible] = useState(open);

  const isStandardVariant = (v: string): v is AlertVariant => {
    return ['success', 'error', 'warning', 'info'].includes(v);
  };

  const standardVariant = isStandardVariant(variant) ? variant : 'info';
  const styles = variantStyles[standardVariant];

  useEffect(() => {
    if (open && autoClose && autoClose > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [open, autoClose]);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  const customColorStyle = !isStandardVariant(variant)
    ? {
        backgroundColor: variant.startsWith('#') || variant.startsWith('rgb') ? variant : undefined,
      }
    : {};

  const customColorClass =
    !isStandardVariant(variant) && !variant.startsWith('#') && !variant.startsWith('rgb') ? variant : '';

  const sizeConfig = sizeStyles[size];

  return (
    <div
      className={` ${position ? 'fixed animate-[slideIn_0.3s_ease-out]' : 'relative'} ${position ? positionStyles[position] : ''} ${isStandardVariant(variant) ? `${styles.bg} ${styles.border}` : 'border-gray-200 bg-white'} ${customColorClass} rounded-lg border shadow-lg transition-all duration-300 ${sizeConfig.padding} ${onClick ? 'cursor-pointer hover:shadow-xl' : ''} ${className} `}
      style={{
        zIndex: position ? zIndex : undefined,
        ...customColorStyle,
      }}
      onClick={onClick}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className={`${isStandardVariant(variant) ? styles.iconBg : 'bg-gray-100'} flex-shrink-0 rounded-lg p-2`}>
            {icon ? icon : variantIcons[standardVariant]}
          </div>
        )}

        <div className="min-w-0 flex-1">
          {title && (
            <h3
              className={`${isStandardVariant(variant) ? styles.text : 'text-gray-900'} ${sizeConfig.titleSize} mb-1 font-semibold`}
            >
              {title}
            </h3>
          )}
          <p
            className={`${isStandardVariant(variant) ? styles.text : 'text-gray-700'} ${sizeConfig.messageSize} break-words`}
          >
            {message}
          </p>

          {actions && <div className="mt-3 flex gap-2">{actions}</div>}
        </div>

        {closable && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleClose();
            }}
            className={`${isStandardVariant(variant) ? styles.text : 'text-gray-500'} flex-shrink-0 rounded-lg p-1 transition-colors hover:bg-black/5`}
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export const AlertPortal: React.FC<AlertProps> = props => {
  return <Alert {...props} />;
};
