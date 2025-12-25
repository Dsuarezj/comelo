import { ReactNode } from 'react';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'danger';

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

const variantStyles: Record<TextVariant, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm',
  caption: 'text-xs',
};

const colorStyles: Record<TextColor, string> = {
  primary: 'text-neutral-900',
  secondary: 'text-neutral-700',
  muted: 'text-neutral-600',
  danger: 'text-danger-600',
};

export default function Text({
  children,
  variant = 'body',
  color = 'primary',
  className = '',
  as,
}: TextProps) {
  const Component = as || (variant.startsWith('h') ? variant : 'p');

  return (
    <Component
      className={`
        ${variantStyles[variant]}
        ${colorStyles[color]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </Component>
  );
}
