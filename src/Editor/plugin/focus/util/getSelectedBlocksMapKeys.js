/*
 Copy from https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-focus-plugin
*/
import getBlockMapKeys from './getBlockMapKeys';

export default editorState => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  return getBlockMapKeys(contentState, selectionState.getStartKey(), selectionState.getEndKey());
};
