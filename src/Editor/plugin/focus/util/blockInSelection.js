/*
 Copy from https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-focus-plugin
*/
import getSelectedBlocksMapKeys from './getSelectedBlocksMapKeys';

export default (editorState, blockKey) => {
  const selectedBlocksKeys = getSelectedBlocksMapKeys(editorState);
  return selectedBlocksKeys.includes(blockKey);
};
