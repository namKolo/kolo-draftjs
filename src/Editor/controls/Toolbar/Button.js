// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Button from 'material-ui/Button';

import type { ToolbarAction } from './type';

type Props = {
  onToggle: () => void,
  active: boolean,
  action: ToolbarAction
};

const StyledToolbarButton = styled.div`
  display: inline-block;
  color: ${props => (props.active ? '#3192e7' : '#ccc')};
  &:hover {
    color: ${props => (props.active ? '#3192e7' : '#fff')};
  }
`;

export default class ToolbarButton extends Component<Props> {
  render() {
    const { active, action, onToggle } = this.props;
    const Icon = action.icon;
    return (
      <StyledToolbarButton
        {...{ active }}
        onMouseDown={event => {
          event.preventDefault();
          onToggle();
        }}
      >
        <Button color={active ? 'accent' : 'contrast'} style={{ minWidth: 24 }}>
          <Icon />
        </Button>
      </StyledToolbarButton>
    );
  }
}
