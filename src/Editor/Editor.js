// @flow
import * as React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  CompositeDecorator,
  KeyBindingUtil
} from 'draft-js';
import type { DraftHandleValue } from 'draft-js/lib/DraftHandleValue';

import Sidebar from './controls/Sidebar';

type Props = {
  editorState: EditorState,
  placeholder?: string,
  onChange: (editorState: EditorState) => void,
  onSearch?: () => void
};

const { hasCommandModifier } = KeyBindingUtil;

function myKeyBindingFn(e: SyntheticKeyboardEvent<>): ?string {
  if (e.keyCode === 70 && hasCommandModifier(e)) {
    return 'search';
  }
  return getDefaultKeyBinding(e);
}

class MyEditor extends React.Component<Props> {
  editor: ?Editor;

  handleEditorStateChange = (editorState: EditorState) => this.props.onChange(editorState);
  /*
    Use RichUtils to tunr on shortkey format like CMD+B, CMD+I
  */
  handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
    if (command === 'search' && this.props.onSearch) {
      this.props.onSearch();
      return 'handled';
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.handleEditorStateChange(newState);
      /*
        handled means we already handle this case - no more work need
      */
      return 'handled';
    }
    /*
      built-in handlers will be triggered if we return not-handleds
    */
    return 'not-handled';
  };

  focus = () => {
    if (this.editor) {
      this.editor.focus();
    }
  };

  getEditorState = () => this.props.editorState;

  render() {
    const { editorState, placeholder } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        <Sidebar
          editorState={editorState}
          getEditorState={this.getEditorState}
          setEditorState={this.handleEditorStateChange}
          focus={this.focus}
        />

        <Editor
          {...{ editorState, placeholder }}
          onChange={this.handleEditorStateChange}
          keyBindingFn={myKeyBindingFn}
          handleKeyCommand={this.handleKeyCommand}
          ref={editor => (this.editor = editor)}
        />
      </div>
    );
  }
}

export default MyEditor;
