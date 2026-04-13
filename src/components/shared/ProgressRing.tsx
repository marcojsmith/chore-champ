import type { ReactNode } from 'react';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

export function ProgressRing({ value, size = 56, strokeWidth = 4, children }: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth} className="stroke-muted" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth}
          className="stroke-primary transition-all duration-500"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
