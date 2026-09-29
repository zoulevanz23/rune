import { createContext, useContext } from 'react'

export interface BoardActions {
  canUndo: boolean
  canRedo: boolean
  undo: () => void
  redo: () => void
  save: () => void
  exportMarkdown: () => void
  exportCsv: () => void
  exportPdf: () => void
}

/** Populated by BoardPage while it is mounted; the shell reads it for the top bar. */
const BoardActionsContext = createContext<BoardActions | null>(null)

export const BoardActionsProvider = BoardActionsContext.Provider

export const useBoardActions = () => useContext(BoardActionsContext)
