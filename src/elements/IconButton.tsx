import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'filled' | 'ghost';
  size?: number;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

const variantStyles = {
  default: 'bg-white hover:bg-gray-50 active:bg-gray-100',
  filled: 'bg-pink-100 hover:bg-pink-200 active:bg-pink-300',
  ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200',
};

export default function IconButton({
  icon: Icon,
  onClick,
  variant = 'default',
  size = 20,
  active = false,
  disabled = false,
  className = '',
  ariaLabel,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${variantStyles[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${active ? 'scale-110' : ''}
        rounded-full p-2 shadow-sm transition-all
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      <Icon
        size={size}
        className={active ? 'fill-current' : ''}
        strokeWidth={active ? 2.5 : 2}
      />
    </button>
  );
}
