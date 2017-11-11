// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import AddIcon from 'material-ui-icons/Add';

import withPositionUpdater from './withPositionUpdater';
import type { SidebarProps, PositionUpdaterInjectedProps } from './type';
import { DefaultItem, ImageItem, VideoItem } from './Item';

const StyledItemList = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

type Props = SidebarProps & PositionUpdaterInjectedProps;
type State = {
  open: boolean
};

class Sidebar extends Component<Props, State> {
  state = {
    open: false
  };

  renderMenuItems = () => {
    const { editorState, setEditorState } = this.props;
    const { open } = this.state;
    return (
      <StyledItemList
        onMouseEnter={() => this.setState({ open: true })}
        onMouseLeave={() => this.setState({ open: false })}
      >
        <DefaultItem open fab color="accent" style={{ width: 36, height: 36, minHeight: 36 }}>
          <AddIcon />
        </DefaultItem>
        <ImageItem {...{ open, editorState, setEditorState }} />
        <VideoItem {...{ open, editorState, setEditorState }} />
      </StyledItemList>
    );
  };

  render() {
    const { calculatedTop } = this.props;
    return (
      <div style={{ top: calculatedTop, position: 'absolute', left: -50 }}>
        {this.renderMenuItems()}
      </div>
    );
  }
}

export default withPositionUpdater(Sidebar);
