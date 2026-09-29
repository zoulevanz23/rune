import React from 'react'
import { Button, Dialog } from '@/components/primitives'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  danger = true,
}) => (
  <Dialog
    isOpen={isOpen}
    onClose={onCancel}
    title={title}
    description={message}
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
          {confirmText}
        </Button>
      </>
    }
  />
)
