// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { darken } from 'material-ui/styles/colorManipulator';
import AddIcon from 'material-ui-icons/Add';
import ImageIcon from 'material-ui-icons/Image';
import VideoIcon from 'material-ui-icons/VideoCall';
import Button from 'material-ui/Button';

import withPositionUpdater from './withPositionUpdater';
import type { SidebarProps, PositionUpdaterInjectedProps } from './type';
import style from '../../style';

const StyledItem = styled(Button)`
  background-color: ${style.primaryColor};
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin-bottom: 8px;
  transform: ${props => (props.open ? 'scale(1)' : 'scale(0)')};
  transition: all cubic-bezier(0.23, 1, 0.23, 1) 450ms;
  transition-delay: 0.02s;

  &:hover {
    background-color: ${darken(style.primaryColor, 0.1)};
  }
`;

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
    const { open } = this.state;
    return (
      <StyledItemList
        onMouseEnter={() => this.setState({ open: true })}
        onMouseLeave={() => this.setState({ open: false })}
      >
        <StyledItem open fab color="accent" style={{ width: 36, height: 36, minHeight: 36 }}>
          <AddIcon />
        </StyledItem>
        <StyledItem
          {...{ open }}
          color="primary"
          fab
          style={{ width: 30, height: 30, minHeight: 30 }}
        >
          <ImageIcon style={{ width: 18, height: 18 }} />
        </StyledItem>
        <StyledItem
          {...{ open }}
          color="primary"
          fab
          style={{ width: 30, height: 30, minHeight: 30 }}
        >
          <VideoIcon style={{ width: 18, height: 18 }} />
        </StyledItem>
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
