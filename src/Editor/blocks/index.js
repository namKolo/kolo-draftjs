// @flow

import { ContentBlock, EditorState } from 'draft-js';
import ImageBlock from './Image';

export type BlockEnum = 'IMAGE';

export type BlockProps = {
  block: ContentBlock,
  blockProps: {
    getEditorState: () => EditorState,
    setEditorState: (editorState: EditorState) => void
  }
};

export const Block = {
  IMAGE: 'IMAGE',
  TODO: 'TODO'
};

export const blockRenderFn = (
  setEditorState: (editorState: EditorState) => void,
  getEditorState: () => EditorState
) => (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.IMAGE:
      return {
        component: ImageBlock,
        props: {
          setEditorState,
          getEditorState
        }
      };

    default:
      return {};
  }
};
