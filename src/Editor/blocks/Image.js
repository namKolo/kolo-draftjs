// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { EditorBlock, EditorState, SelectionState } from 'draft-js';

import { getCurrentBlock } from '../util';
import type { BlockProps } from './index';

const StyledBlockImage = styled.div`
  margin: 10px 0;
  background: #fbfbfb;

  img {
    cursor: default;
    max-width: 100%;
    border: 1px solid #eee;
    box-sizing: border-box;

    &.is-selected {
      box-shadow: 0 0 0 3px #02b875;
    }
  }
`;

const StyledCaption = styled.figcaption`
  display: block;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.6);
  letter-spacing: 0;
  font-weight: 300;
  font-style: normal;
  text-align: center;
  padding: 5px 0;

  .public-DraftStyleDefault-block {
    text-align: center;
  }
`;

class ImageBlock extends Component<BlockProps> {
  focusBlock = () => {
    const { block, blockProps } = this.props;
    const { getEditorState, setEditorState } = blockProps;
    const key = block.getKey();
    const editorState = getEditorState();
    const currentblock = getCurrentBlock(editorState);
    if (currentblock.getKey() === key) {
      return;
    }
    const newSelection = new SelectionState({
      anchorKey: key,
      focusKey: key,
      anchorOffset: 0,
      focusOffset: 0
    });
    setEditorState(EditorState.forceSelection(editorState, newSelection));
  };

  render() {
    const { block } = this.props;
    const data = block.getData();
    const src = data.get('src');
    if (src !== null) {
      return (
        <StyledBlockImage>
          <div style={{ position: 'relative' }} onClick={this.focusBlock}>
            <img role="presentation" src={src} alt="text" />
          </div>
          <StyledCaption>
            <EditorBlock {...this.props} />
          </StyledCaption>
        </StyledBlockImage>
      );
    }
    return <EditorBlock {...this.props} />;
  }
}

export default ImageBlock;
