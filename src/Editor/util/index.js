// @flow
// Finds the block parent of the current selection
// https://github.com/facebook/draft-js/issues/45
export function getSelectedBlockElement() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    return null;
  }
  var node = selection.getRangeAt(0).startContainer;

  do {
    if (node.getAttribute && node.getAttribute('data-block') == 'true') {
      return node;
    }
    node = node.parentNode;
  } while (node != null);
  return null;
}
