import React from 'react'

export interface SkeletonProps {
  width?: number | string
  height?: number | string
  radius?: string
  style?: React.CSSProperties
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 14,
  radius = 'var(--radius-sm)',
  style,
}) => (
  <div
    aria-hidden="true"
    style={{
      width,
      height,
      borderRadius: radius,
      background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--surface-3) 37%, var(--surface-2) 63%)',
      backgroundSize: '400% 100%',
      animation: 'skeletonShimmer 1.4s ease infinite',
      ...style,
    }}
  >
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes skeletonShimmer {
        0% { background-position: 100% 50%; }
        100% { background-position: 0 50%; }
      }
    `}} />
  </div>
)

export interface SkeletonTextProps {
  lines?: number
  style?: React.CSSProperties
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={12} />
    ))}
  </div>
)
