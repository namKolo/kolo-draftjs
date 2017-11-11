// @flow
import React, { Component } from 'react';
import ImageIcon from 'material-ui-icons/Image';
import request from 'superagent';

import DefaultButton from './Item';
import type { ButtonProps } from './type';

import { addNewBlock } from '../../../util';
import { Block } from '../../../blocks';

export default class ImageButton extends Component<ButtonProps> {
  input: ?HTMLInputElement;
  postImage = (file: Object) => {
    request
      .post('http://localhost:4000/images')
      .attach('image', file)
      .end((err, res = {}) => {
        const { body } = res;
        if (!body) return;
        this.addImageBlock({ src: `http://localhost:4000/uploads/${body.id}` });
      });
  };

  addImageBlock = (params: { src: string }): void => {
    const { src } = params;
    const { editorState, setEditorState } = this.props;
    setEditorState(
      addNewBlock(editorState, Block.IMAGE, {
        src
      })
    );
  };

  onChange = (e: Object) => {
    e.preventDefault();
    const file = e.target.files[0];
    this.postImage(file);
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
