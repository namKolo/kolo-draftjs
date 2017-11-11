// @flow
import { getVisibleSelectionRect, EditorState, Modifier, ContentBlock } from 'draft-js';
import DraftEntityInstance from 'draft-js/lib/DraftEntityInstance';
import type { DraftEntityType } from 'draft-js/lib/DraftEntityType';
import type { DraftEntityMutability } from 'draft-js/lib/DraftEntityMutability';

import type { BlockEnum } from '../blocks';
import { Block } from '../blocks';

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

// $FlowFixMe
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

// $FlowFixMe
export function removeEntity(editorState: EditorState, entityKey: string) {
  const contentState = editorState.getCurrentContent();
  const newContentState = Modifier.applyEntity(contentState, editorState.getSelection(), null);
  const newEditorState = EditorState.set(editorState, { currentContent: newContentState });

  return newEditorState;
}

/*
Returns default block-level metadata for various block type. Empty object otherwise.
*/
export const getDefaultBlockData = (blockType: BlockEnum, initialData: Object = {}): Object => {
  switch (blockType) {
    case Block.TODO:
      return { checked: false };
    default:
      return initialData;
  }
};

/*
Get currentBlock in the editorState.
*/
export const getCurrentBlock = (editorState: EditorState): ContentBlock => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());
  return block;
};

export const addNewBlock = (
  editorState: EditorState,
  newType: BlockEnum,
  initialData: Object = {}
) => {
  const selectionState = editorState.getSelection();
  if (!selectionState.isCollapsed()) {
    return editorState;
  }
  const contentState = editorState.getCurrentContent();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const currentBlock = getCurrentBlock(editorState);
  if (!currentBlock) {
    return editorState;
  }
  if (currentBlock.getLength() === 0) {
    if (currentBlock.getType() === newType) {
      return editorState;
    }
    const newBlock = currentBlock.merge({
      type: newType,
      data: getDefaultBlockData(newType, initialData)
    });
    const newContentState = contentState.merge({
      blockMap: blockMap.set(key, newBlock),
      selectionAfter: selectionState
    });
    return EditorState.push(editorState, newContentState, 'change-block-type');
  }
  return editorState;
};

/*
Changes the block type of the current block.
*/
export const resetBlockWithType = (
  editorState: EditorState,
  newType: BlockEnum = Block.UNSTYLED,
  overrides: Object = {}
) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const key = selectionState.getStartKey();
  const blockMap = contentState.getBlockMap();
  const block = blockMap.get(key);
  const newBlock = block.mergeDeep(overrides, {
    type: newType,
    data: getDefaultBlockData(newType)
  });
  const newContentState = contentState.merge({
    blockMap: blockMap.set(key, newBlock),
    selectionAfter: selectionState.merge({
      anchorOffset: 0,
      focusOffset: 0
    })
  });
  return EditorState.push(editorState, newContentState, 'change-block-type');
};
