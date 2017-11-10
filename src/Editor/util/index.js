// @flow
import { getVisibleSelectionRect, EditorState, Modifier } from 'draft-js';
import DraftEntityInstance from 'draft-js/lib/DraftEntityInstance';
import type { DraftEntityType } from 'draft-js/lib/DraftEntityType';
import type { DraftEntityMutability } from 'draft-js/lib/DraftEntityMutability';

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

export function getCurrentEntityKey(editorState: EditorState): ?string {
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const contentState = editorState.getCurrentContent();
  const anchorBlock = contentState.getBlockForKey(anchorKey);
  const offset = selection.anchorOffset;
  const index = selection.isBackward ? offset - 1 : offset;
  return anchorBlock.getEntityAt(index);
}

export function getCurrentEntity(editorState: EditorState): ?DraftEntityInstance {
  const contentState = editorState.getCurrentContent();
  const entityKey = getCurrentEntityKey(editorState);
  if (entityKey) {
    return contentState.getEntity(entityKey);
  }
  return null;
}

export function hasEntity(editorState: EditorState, entityType: string): boolean {
  const entity = getCurrentEntity(editorState);
  if (entity && entity.getType() === entityType) {
    return true;
  }
  return false;
}

export function insertEntity(
  editorState: EditorState,
  entityType: DraftEntityType,
  data: Object = {},
  mutability: DraftEntityMutability = 'MUTABLE'
) {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(entityType, mutability, data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newContentState = Modifier.applyEntity(
    contentStateWithEntity,
    editorState.getSelection(),
    entityKey
  );
  const newEditorState = EditorState.set(editorState, { currentContent: newContentState });

  return newEditorState;
}
