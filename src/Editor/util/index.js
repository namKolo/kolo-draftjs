// @flow
import { getVisibleSelectionRect } from 'draft-js';
// Finds the block parent of the current selection
// https://github.com/facebook/draft-js/issues/45
export function getSelectedBlockElement() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) {
    return null;
  }
  var node = selection.getRangeAt(0).startContainer;

  do {
    if (node.getAttribute && node.getAttribute('data-block') === 'true') {
      return node;
    }
    node = node.parentNode;
  } while (node != null);
  return null;
}

export function getSelectionCoords(editor: ?HTMLElement, toolbar: ?HTMLElement) {
  if (!editor || !toolbar) {
    return;
  }
  const editorBounds = editor.getBoundingClientRect();
  const rangeBounds = getVisibleSelectionRect(window);

  if (!rangeBounds || !toolbar) {
    return null;
  }

  const rangeWidth = rangeBounds.right - rangeBounds.left;
  const toolbarHeight = toolbar.offsetHeight;

  const offsetLeft = rangeBounds.left - editorBounds.left + rangeWidth / 2;
  const offsetTop = rangeBounds.top - editorBounds.top - (toolbarHeight + 14);
  const offsetBottom = editorBounds.bottom - rangeBounds.top + 14;

  return { offsetLeft, offsetTop, offsetBottom };
}
