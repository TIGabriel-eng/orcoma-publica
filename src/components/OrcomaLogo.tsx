import React from 'react';

interface OrcomaLogoProps {
  variant?: 'light' | 'dark' | 'yellow-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const OrcomaLogo: React.FC<OrcomaLogoProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: { height: 36, width: 160 },
    md: { height: 48, width: 215 },
    lg: { height: 64, width: 285 },
    xl: { height: 80, width: 360 },
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/grupo-orcoma-logo.png"
        alt="Grupo Orcoma"
        width={sizeStyles.width}
        height={sizeStyles.height}
        className="w-auto max-h-full drop-shadow-sm object-contain"
        style={{ height: sizeStyles.height }}
      />
    </div>
  );
};
