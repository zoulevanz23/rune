import React, { useId, useState } from 'react'

/** Controlled when `checked` is provided, otherwise keeps its own state. */
const useToggleState = (props: {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}) => {
  const [internal, setInternal] = useState(Boolean(props.checked ?? props.defaultChecked))
  const checked = props.checked !== undefined ? props.checked : internal
  const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    if (props.checked === undefined) setInternal(e.target.checked)
    props.onChange?.(e)
  }
  return { checked, onChange }
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode
  description?: React.ReactNode
  indeterminate?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  indeterminate,
  style,
  disabled,
  checked,
  defaultChecked,
  onChange,
  ...props
}) => {
  const id = useId()
  const state = useToggleState({ checked, defaultChecked, onChange })
  const filled = state.checked || Boolean(indeterminate)

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: 10,
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        color: disabled ? 'var(--ink-mute)' : 'var(--ink)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        minHeight: 24,
        ...style,
      }}
    >
      <span
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 3,
          width: 18,
          height: 18,
          flexShrink: 0,
          borderRadius: 'var(--radius-sm)',
          border: `1.5px solid ${filled ? 'var(--primary)' : 'var(--border-strong)'}`,
          background: filled ? 'var(--primary)' : 'var(--surface)',
          color: 'var(--on-primary)',
          transition: 'background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease)',
        }}
      >
        <input
          id={id}
          type="checkbox"
          disabled={disabled}
          checked={state.checked}
          onChange={state.onChange}
          style={{
            position: 'absolute',
            inset: 0,
            margin: 0,
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          {...props}
        />
        {indeterminate && !state.checked ? (
          <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        ) : state.checked ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : null}
      </span>
      {(label || description) && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.4 }}>
          <span>{label}</span>
          {description && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{description}</span>}
        </span>
      )}
    </label>
  )
}

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode
}

export const Radio: React.FC<RadioProps> = ({
  label,
  style,
  disabled,
  checked,
  defaultChecked,
  onChange,
  ...props
}) => {
  const id = useId()
  const state = useToggleState({ checked, defaultChecked, onChange })

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        color: disabled ? 'var(--ink-mute)' : 'var(--ink)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: 24,
        ...style,
      }}
    >
      <span
        style={{
          position: 'relative',
          width: 18,
          height: 18,
          flexShrink: 0,
          borderRadius: '50%',
          border: `1.5px solid ${state.checked ? 'var(--primary)' : 'var(--border-strong)'}`,
          background: 'var(--surface)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color var(--dur-fast) var(--ease)',
        }}
      >
        <input
          id={id}
          type="radio"
          disabled={disabled}
          checked={state.checked}
          onChange={state.onChange}
          style={{ position: 'absolute', inset: 0, margin: 0, opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
          {...props}
        />
        {state.checked && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
      </span>
      {label && <span>{label}</span>}
    </label>
  )
}

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: React.ReactNode
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  style,
  disabled,
  checked,
  defaultChecked,
  onChange,
  ...props
}) => {
  const id = useId()
  const state = useToggleState({ checked, defaultChecked, onChange })

  return (
    <label
      htmlFor={id}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        color: disabled ? 'var(--ink-mute)' : 'var(--ink)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      <span
        style={{
          position: 'relative',
          width: 38,
          height: 22,
          flexShrink: 0,
          borderRadius: 'var(--radius-pill)',
          background: state.checked ? 'var(--primary)' : 'var(--border-strong)',
          transition: 'background var(--dur-fast) var(--ease)',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <input
          id={id}
          type="checkbox"
          role="switch"
          disabled={disabled}
          checked={state.checked}
          onChange={state.onChange}
          style={{ position: 'absolute', inset: 0, margin: 0, opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
          {...props}
        />
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: state.checked ? 18 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: 'var(--shadow-1)',
            transition: 'left var(--dur-fast) var(--ease)',
            pointerEvents: 'none',
          }}
        />
      </span>
      {label && <span>{label}</span>}
    </label>
  )
}
