// @flow
import React, { Component } from 'react';
import type { ComponentType } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { findDOMNode } from 'react-dom';

import { getSelectedBlockElement } from '../../util';

import type { SidebarProps, PositionUpdaterInjectedProps } from './type';

export default function withPositionUpdater(
  WrappedComponent: ComponentType<PositionUpdaterInjectedProps & SidebarProps>
): ComponentType<SidebarProps> {
  type State = {
    top: number
  };

  class PositionUpdater extends Component<SidebarProps, State> {
    state = {
      top: 0
    };

    WrappedComponent = WrappedComponent;

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
          <WrappedComponent {...this.props} {...{ calculatedTop: top }} />
        </div>
      );
    }
  }

  return hoistStatics(PositionUpdater, WrappedComponent);
}
