import React from 'react'

export const RegistrationFrame: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const mark = (pos: React.CSSProperties) => (
    <div style={{
      position: 'absolute',
      width: 16,
      height: 16,
      borderColor: 'var(--grid-line)',
      borderStyle: 'solid',
      pointerEvents: 'none',
      ...pos,
    }} />
  )
  return (
    <div style={{ position: 'relative', padding: '18px', ...style }}>
      {mark({ top: 0, left: 0, borderWidth: '1px 0 0 1px' })}
      {mark({ top: 0, right: 0, borderWidth: '1px 1px 0 0' })}
      {mark({ bottom: 0, left: 0, borderWidth: '0 0 1px 1px' })}
      {mark({ bottom: 0, right: 0, borderWidth: '0 1px 1px 0' })}
      {children}
    </div>
  )
}
