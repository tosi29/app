import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

function iconAttrs(size: number, className?: string) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
}

export function PlayIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...iconAttrs(size, className)}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

export function StopIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...iconAttrs(size, className)}>
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

export function LightbulbIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...iconAttrs(size, className)}>
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}

export function FileTextIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...iconAttrs(size, className)}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...iconAttrs(size, className)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function SearchIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...iconAttrs(size, className)}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function MusicOffIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...iconAttrs(size, className)}>
      <circle cx="8" cy="18" r="4" />
      <path d="M12 18V2l7 4" />
    </svg>
  );
}
