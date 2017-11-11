// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { EditorBlock, EditorState, SelectionState } from 'draft-js';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import { getCurrentBlock, resetBlockWithType } from '../util';
import type { BlockProps } from './index';

const StyledBlockImage = styled.div`
  border: ${props => (props.shouldDisplayBorder ? '1px solid grey' : '1px solid white')};
  margin: 10px 0;
  background: #fbfbfb;
  position: relative;

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

type State = {
  isHover: boolean
};
class ImageBlock extends Component<BlockProps, State> {
  state = {
    isHover: false
  };

  componentWillMount() {
    const { blockKeyStore } = this.props.blockProps;
    console.log('ImageBlock: addBlockKey');
    blockKeyStore.add(this.props.block.getKey());
  }

  componentWillUnmount() {
    const { blockKeyStore } = this.props.blockProps;
    blockKeyStore.remove(this.props.block.getKey());
  }

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

  isFocus = (): boolean => {
    const { block, blockProps } = this.props;
    const { getEditorState } = blockProps;
    const editorState = getEditorState();
    const key = block.getKey();
    const currentblock = getCurrentBlock(editorState);
    return currentblock.getKey() === key;
  };

  handleBlockRemove = () => {
    if (!this.isFocus()) {
      return;
    }
    const { blockProps } = this.props;
    const { setEditorState, getEditorState } = blockProps;
    const editorState = getEditorState();

    setEditorState(resetBlockWithType(editorState, 'unstyled', { text: '' }));
  };

  render() {
    const { block } = this.props;
    const { isHover } = this.state;
    const data = block.getData();
    const src = data.get('src');
    const focus = this.isFocus();

    if (src !== null) {
      return (
        <StyledBlockImage
          {...{ shouldDisplayBorder: isHover || focus }}
          onMouseEnter={() => this.setState({ isHover: true })}
          onMouseLeave={() => this.setState({ isHover: false })}
        >
          {focus && (
            <IconButton
              style={{ position: 'absolute', top: -20, right: -30, zIndex: 1000 }}
              onClick={this.handleBlockRemove}
            >
              <DeleteIcon style={{ fontSize: 25 }} />
            </IconButton>
          )}
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
