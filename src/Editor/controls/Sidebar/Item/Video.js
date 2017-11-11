// @flow
import React, { Component } from 'react';
import VideoIcon from 'material-ui-icons/VideoCall';
import DefaultButton from './Item';
import type { ButtonProps } from './type';

export default class ImageButton extends Component<ButtonProps> {
  render() {
    const { open } = this.props;
    return (
      <DefaultButton style={{ width: 30, height: 30, minHeight: 30 }} color="primary" {...{ open }}>
        <VideoIcon style={{ width: 18, height: 18 }} />
      </DefaultButton>
    );
  }
}
