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

const variantStyles: Record<
  AlertVariant,
  { bg: string; border: string; text: string; iconBg: string; iconBorder: string; iconColor: string }
> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-gray-900',
    iconBg: 'bg-green-500',
    iconBorder: 'border-green-600',
    iconColor: 'text-white',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-gray-900',
    iconBg: 'bg-red-500',
    iconBorder: 'border-red-600',
    iconColor: 'text-white',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    text: 'text-gray-900',
    iconBg: 'bg-yellow-400',
    iconBorder: 'border-gray-800',
    iconColor: 'text-red-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-gray-900',
    iconBg: 'bg-blue-500',
    iconBorder: 'border-blue-600',
    iconColor: 'text-white',
  },
};

const getVariantIcon = (variant: AlertVariant, className: string = 'h-5 w-5'): React.ReactNode => {
  switch (variant) {
    case 'success':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'error':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'warning':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    case 'info':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return null;
  }
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
      className={` ${position ? 'fixed animate-[slideIn_0.3s_ease-out]' : 'relative'} ${position ? positionStyles[position] : ''} ${isStandardVariant(variant) ? `${styles.bg} ${styles.border}` : 'border-gray-200 bg-white'} ${customColorClass} rounded-xl border-2 shadow-md transition-all duration-300 hover:shadow-lg ${sizeConfig.padding} ${onClick ? 'cursor-pointer' : ''} ${className} `}
      style={{
        zIndex: position ? zIndex : undefined,
        ...customColorStyle,
      }}
      onClick={onClick}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <div
            className={`${isStandardVariant(variant) ? `${styles.iconBg} ${styles.iconBorder} border-2` : 'border-2 border-gray-300 bg-gray-100'} flex-shrink-0 rounded-lg p-2 shadow-sm`}
          >
            <div className={isStandardVariant(variant) ? styles.iconColor : 'text-gray-700'}>
              {icon ? icon : getVariantIcon(standardVariant)}
            </div>
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
            className="flex-shrink-0 rounded-lg p-1 text-gray-600 transition-all hover:bg-gray-900/10 hover:text-gray-900"
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
