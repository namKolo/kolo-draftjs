// @flow
import type { ComponentType } from 'react';
import { EditorState } from 'draft-js';

export type ToolbarProps = {
  editorEl: ?HTMLElement,
  editorState: EditorState,
  editorFocus: boolean,
  setEditorState: (editorState: EditorState) => void
};

export type ToolbarAction = {
  type: 'inline' | 'entity',
  icon: ComponentType<any>,
  label: string,
  style: string
};
