// @flow
import React, { Component } from 'react';
import ImageIcon from 'material-ui-icons/Image';

import DefaultButton from './Item';
import type { ButtonProps } from './type';

import { addNewBlock } from '../../../util';
import { Block } from '../../../blocks';

export default class ImageButton extends Component<ButtonProps> {
  input: ?HTMLInputElement;

  onChange = (e: Object) => {
    e.preventDefault();
    const { editorState, setEditorState } = this.props;
    const file = e.target.files[0];

    if (file.type.indexOf('image/') === 0) {
      const src = URL.createObjectURL(file);
      setEditorState(
        addNewBlock(editorState, Block.IMAGE, {
          src
        })
      );
    }
  };

  render() {
    const { open } = this.props;
    return (
      <div>
        <input
          accept="jpg,jpeg,JPG,JPEG"
          id="file"
          multiple
          type="file"
          style={{ display: 'none' }}
          onChange={this.onChange}
        />
        <label htmlFor="file">
          <DefaultButton
            raised
            component="span"
            {...{ open }}
            color="primary"
            style={{ width: 30, height: 30, minHeight: 30 }}
          >
            <ImageIcon style={{ width: 18, height: 18 }} />
          </DefaultButton>
        </label>{' '}
      </div>
    );
  }
}
