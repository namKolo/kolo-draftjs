// @flow
import React from 'react';
import styled from 'styled-components';
import Button from 'material-ui/Button';
import { darken } from 'material-ui/styles/colorManipulator';

import style from '../../../style';

const StyledItem = styled(Button)`
  background-color: ${style.primaryColor};
  cursor: pointer;
  color: white;
  border-radius: 5px;
  margin-bottom: 8px;
  transform: ${props => (props.open ? 'scale(1)' : 'scale(0)')};
  transition: all cubic-bezier(0.23, 1, 0.23, 1) 450ms;
  transition-delay: 0.02s;

  &:hover {
    background-color: ${darken(style.primaryColor, 0.1)};
  }
`;

const SidebarButton = (props: {}) => <StyledItem {...props} fab />;

export default SidebarButton;
