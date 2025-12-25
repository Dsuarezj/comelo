import { LucideIcon, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'highlighted';
  endContent?: ReactNode;
  showChevron?: boolean;
}

export default function MenuButton({
  icon: Icon,
  label,
  onClick,
  variant = 'default',
  endContent,
  showChevron = false
}: MenuButtonProps) {
  const baseClasses = 'w-full flex items-center gap-4 p-4 rounded-xl font-medium transition-colors';

  const variantClasses = {
    default: 'hover:bg-neutral-100 text-neutral-900',
    highlighted: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900',
    primary: 'bg-primary-500 text-white hover:bg-primary-600 justify-center gap-3 font-semibold'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      <Icon size={20} className={variant === 'primary' ? 'text-white' : 'text-neutral-700'} />
      <span className={variant === 'primary' ? 'text-white' : 'flex-1 text-left'}>
        {label}
      </span>
      {endContent && (
        <div className="flex items-center gap-2">
          {endContent}
        </div>
      )}
      {showChevron && <ChevronRight size={20} className="text-neutral-400" />}
    </button>
  );
}
