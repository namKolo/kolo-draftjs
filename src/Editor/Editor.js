// @flow
import * as React from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';
import type { DraftHandleValue } from 'draft-js/lib/DraftHandleValue';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';

import Sidebar from './controls/Sidebar';
import Toolbar from './controls/Toolbar';

import { blockRenderFn } from './blocks';
import createPluginFocus from './plugin/focus';

const focusPlugin = createPluginFocus({});

type Props = {
  editorState: EditorState,
  placeholder?: string,
  onChange: (editorState: EditorState) => void,
  onSearch?: () => void
};

type State = {
  hasFocus: boolean
};

const { hasCommandModifier } = KeyBindingUtil;

function myKeyBindingFn(e: SyntheticKeyboardEvent<>): ?string {
  if (e.keyCode === 70 && hasCommandModifier(e)) {
    return 'search';
  }
  return getDefaultKeyBinding(e);
}

class MyEditor extends React.Component<Props, State> {
  state = {
    hasFocus: false
  };

  editor: ?Editor;
  editorWrapper: ?HTMLElement;

  handleEditorStateChange = (editorState: EditorState) => {
    const { onChange } = this.props;
    onChange(focusPlugin.onChange(editorState));
  };
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

  handleFocus = () => {
    this.setState({
      hasFocus: true
    });
  };

  handleBlur = () => {
    this.setState({
      hasFocus: false
    });
  };

  handleReturn = (e: SyntheticKeyboardEvent<>) => {
    const { editorState } = this.props;
    if (isSoftNewlineEvent(e)) {
      this.handleEditorStateChange(RichUtils.insertSoftNewline(editorState));
      return 'handled';
    }

    return 'not-handled';
  };

  getEditorState = () => this.props.editorState;

  getBlockRenderFn = () => {
    return blockRenderFn(
      this.props.editorState,
      this.handleEditorStateChange,
      this.getEditorState,
      {
        blockKeyStore: focusPlugin.blockKeyStore
      }
    );
  };

  render() {
    const { editorState, placeholder } = this.props;
    const { hasFocus } = this.state;

    return (
      <div
        style={{ position: 'relative' }}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        ref={el => (this.editorWrapper = el)}
      >
        <Sidebar editorState={editorState} setEditorState={this.handleEditorStateChange} />
        <Toolbar
          {...{ editorState, editorFocus: hasFocus }}
          setEditorState={this.handleEditorStateChange}
          editorEl={this.editorWrapper}
        />
        <Editor
          {...{ editorState, placeholder }}
          onChange={this.handleEditorStateChange}
          keyBindingFn={myKeyBindingFn}
          handleKeyCommand={this.handleKeyCommand}
          blockRendererFn={this.getBlockRenderFn()}
          handleReturn={this.handleReturn}
          ref={editor => (this.editor = editor)}
        />
      </div>
    );
  }
}

export default MyEditor;
