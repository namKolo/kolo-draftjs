// @flow

/*
 Copy from https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-focus-plugin
*/
import { EditorState } from 'draft-js';

import createBlockKeyStore from './util/createBlockKeyStore';
import getBlockMapKeys from './util/getBlockMapKey';

export default (config: Object = {}) => {
  const blockKeyStore = createBlockKeyStore({});
  let lastSelection;
  let lastContentState;

  return {
    blockKeyStore,
    onChange: (editorState: EditorState): EditorState => {
      // in case the content changed there is no need to re-render blockRendererFn
      // since if a block was added it will be rendered anyway and if it was text
      // then the change was not a pure selection change
      const contentState = editorState.getCurrentContent();
      if (!contentState.equals(lastContentState)) {
        lastContentState = contentState;
        return editorState;
      }
      lastContentState = contentState;

      // if the selection didn't change there is no need to re-render
      const selection = editorState.getSelection();
      if (lastSelection && selection.equals(lastSelection)) {
        lastSelection = editorState.getSelection();
        return editorState;
      }

      // Note: Only if the previous or current selection contained a focusableBlock a re-render is needed.
      const focusableBlockKeys = blockKeyStore.getAll();
      console.log('onChange', focusableBlockKeys.toJS());
      if (lastSelection) {
        const lastBlockMapKeys = getBlockMapKeys(
          contentState,
          lastSelection.getStartKey(),
          lastSelection.getEndKey()
        );
        if (lastBlockMapKeys.some(key => focusableBlockKeys.includes(key))) {
          lastSelection = selection;
          // By forcing the selection the editor will trigger the blockRendererFn which is
          // necessary for the blockProps containing isFocus to be passed down again.
          return EditorState.forceSelection(editorState, editorState.getSelection());
        }
      }

      const currentBlockMapKeys = getBlockMapKeys(
        contentState,
        selection.getStartKey(),
        selection.getEndKey()
      );
      if (currentBlockMapKeys.some(key => focusableBlockKeys.includes(key))) {
        lastSelection = selection;
        // By forcing the selection the editor will trigger the blockRendererFn which is
        // necessary for the blockProps containing isFocus to be passed down again.
        return EditorState.forceSelection(editorState, editorState.getSelection());
      }

      return editorState;
    }
  };
};
