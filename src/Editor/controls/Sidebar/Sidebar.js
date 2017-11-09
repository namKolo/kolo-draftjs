// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { darken } from 'material-ui/styles/colorManipulator';
import AddIcon from 'material-ui-icons/Add';
import ImageIcon from 'material-ui-icons/Image';
import VideoIcon from 'material-ui-icons/VideoCall';

import withPositionUpdater from './withPositionUpdater';
import type { SidebarProps, PositionUpdaterInjectedProps } from './type';
import style from '../../style';

const size = {
  small: '30px',
  default: '36px'
};

const StyledItem = styled.div`
  height: ${props => size[props.size || 'default']};
  width: ${props => size[props.size || 'default']};
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
        <StyledItem open>
          <AddIcon />
        </StyledItem>
        <StyledItem {...{ open }} size="small">
          <ImageIcon />
        </StyledItem>
        <StyledItem {...{ open }} size="small">
          <VideoIcon />
        </StyledItem>
      </StyledItemList>
    );
  };

  render() {
    const { calculatedTop } = this.props;
    return (
      <div style={{ top: calculatedTop, position: 'absolute', left: -56 }}>
        {this.renderMenuItems()}
      </div>
    );
  }
}

export default withPositionUpdater(Sidebar);
