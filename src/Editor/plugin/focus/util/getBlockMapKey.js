/*
 Copy from https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-focus-plugin
*/
export default (contentState, startKey, endKey) => {
  const blockMapKeys = contentState.getBlockMap().keySeq();
  return blockMapKeys
    .skipUntil(key => key === startKey)
    .takeUntil(key => key === endKey)
    .concat([endKey]);
};
