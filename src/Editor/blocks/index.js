// @flow

import { ContentBlock, EditorState } from 'draft-js';
import ImageBlock from './Image';

export type BlockEnum = 'IMAGE' | 'unstyled';

export type BlockProps = {
  block: ContentBlock,
  blockProps: {
    getEditorState: () => EditorState,
    setEditorState: (editorState: EditorState) => void
  }
};

export const Block = {
  UNSTYLED: 'unstyled',
  IMAGE: 'IMAGE',
  TODO: 'TODO'
};

type Option = {
  blockKeyStore: Object
};

export const blockRenderFn = (
  editorState: EditorState,
  setEditorState: (editorState: EditorState) => void,
  getEditorState: () => EditorState,
  option: Option
) => (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case Block.IMAGE:
      return {
        component: ImageBlock,
        props: {
          editorState,
          setEditorState,
          getEditorState,
          blockKeyStore: option.blockKeyStore
        }
      };

    default:
      return {};
  }
};
