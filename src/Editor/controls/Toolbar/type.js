// @flow
import { EditorState } from 'draft-js';

export type ToolbarProps = {
  editorEl: ?HTMLElement,
  editorState: EditorState,
  editorFocus: boolean,
  setEditorState: (editorState: EditorState) => void
};
