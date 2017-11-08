// @flow

import { EditorState } from 'draft-js';

export type SidebarProps = {
  editorState: EditorState,
  setEditorState: (editorState: EditorState) => void
};

export type PositionUpdaterInjectedProps = {
  calculatedTop: number
};
