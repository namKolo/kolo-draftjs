// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import AddIcon from 'material-ui-icons/Add';
import styled from 'styled-components';

import { getSelectedBlockElement } from '../util';
import style from '../style';

type State = {
  top: number
};

const StyledMenu = styled.div`
  position: absolute;
  height: 30px;
  width: 30px;
  left: -56px;
  background-color: ${style.primaryColor};
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export default class Sidebar extends Component<{}, State> {
  state = {
    top: 0
  };

  containerEl: ?HTMLDivElement;
  updatingPosition: ?Object;

  componentDidUpdate() {
    if (this.updatingPosition) {
      clearImmediate(this.updatingPosition);
    }
    this.updatingPosition = null;
    this.updatingPosition = setImmediate(() => {
      return this.updatePosition();
    });
  }

  updatePosition = () => {
    const container = findDOMNode(this.containerEl);
    const editor = container && container.parentElement;

    const element = getSelectedBlockElement();

    if (!element || !container || !editor || !editor.contains(element)) {
      return;
    }

    if (container instanceof HTMLElement) {
      const containerTop =
        container.getBoundingClientRect().top -
        (document.documentElement ? document.documentElement.clientTop : 0);
      let top = element.getBoundingClientRect().top - 4 - containerTop;
      top = Math.max(0, Math.floor(top));

      if (this.state.top !== top) {
        this.setState({
          top
        });
      }
    }
  };

  render() {
    const { top } = this.state;

    return (
      <div ref={el => (this.containerEl = el)}>
        <StyledMenu style={{ top }}>
          <AddIcon />
        </StyledMenu>
      </div>
    );
  }
}
