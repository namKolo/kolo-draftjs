// @flow
import { EditorState } from 'draft-js';

export type ButtonProps = {
  open: boolean,
  editorState: EditorState,
  setEditorState: (editorState: EditorState) => void
};
