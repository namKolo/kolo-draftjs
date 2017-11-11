// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { RichUtils } from 'draft-js';

import { getSelectionCoords, hasEntity, insertEntity, removeEntity } from '../../util';
import sv from '../../style';

import type { ToolbarProps, ToolbarAction } from './type';
import defaultActions from './action';
import ToolbarButton from './Button';

const StyledToolbarWrapper = styled.div`
  background: yellow;
  height: 0;
  position: absolute;
  display: ${props => (props.visible ? 'block' : 'none')};
  z-index: 10;
`;

const StyledToolbar = styled.div`
  background-color: ${sv.primaryColor};
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
  left: -50%;
  position: relative;
  transition: background-color 0.2s ease-in-out;
`;

const StyledArrow = styled.span`
  display: inline-block;
  top: 100%;
  left: 50%;
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-width: 8px;
  border-style: solid;
  border-color: ${sv.primaryColor} transparent transparent;
  margin-left: -8px;
  transition: border-color 0.2s ease-in-out;
`;

type State = {
  position: {
    left: number,
    bottom: number
  },
  visible: boolean
};

export default class Toolbar extends Component<ToolbarProps, State> {
  state = {
    position: {
      left: 0,
      bottom: 0
    },
    visible: false
  };

  toolbarEl: ?HTMLElement;
  arrowEl: ?HTMLElement;

  shouldDisplayToolbar = () => {
    const { editorFocus, editorState } = this.props;
    return editorFocus && !editorState.getSelection().isCollapsed();
  };

  updatePosition = () => {
    const { editorEl } = this.props;
    const toolbarEl = this.toolbarEl;
    const selectionCoords = getSelectionCoords(editorEl, toolbarEl);

    if (!selectionCoords) {
      return null;
    }

    const { offsetBottom, offsetLeft } = selectionCoords;
    const { position: { bottom, left }, visible } = this.state;

    if (bottom !== offsetBottom || left !== offsetLeft || !visible) {
      this.setState({
        visible: true,
        position: {
          bottom: offsetBottom,
          left: offsetLeft
        }
      });
    }
  };

  hideToolbar = () => this.state.visible && this.setState({ visible: false });

  componentDidUpdate() {
    if (this.shouldDisplayToolbar()) {
      this.updatePosition();
    } else {
      if (this.state.visible) {
        this.setState({
          visible: false
        });
      }
    }
  }

  toggleInlineStyle = (inlineStyle: string) => {
    const newEditorState = RichUtils.toggleInlineStyle(this.props.editorState, inlineStyle);
    this.props.setEditorState(newEditorState);
  };

  toggleEntity = (entity: string) => {
    const { editorState } = this.props;
    // $FlowFixMe
    const active = hasEntity(editorState, entity);
    const newEditorState = !active
      ? // $FlowFixMe
        insertEntity(editorState, entity)
      : removeEntity(editorState, entity);

    this.props.setEditorState(newEditorState);
  };

  renderAction = (action: ToolbarAction, index: number) => {
    let active;
    let onToggle;

    const { editorState } = this.props;

    switch (action.type) {
      case 'inline': {
        const current = editorState.getCurrentInlineStyle();
        onToggle = () => this.toggleInlineStyle(action.style || '');
        active = current.has(action.style);
        break;
      }

      case 'entity': {
        const { entity = '' } = action;
        onToggle = () => this.toggleEntity(entity);
        active = hasEntity(this.props.editorState, entity);
        break;
      }

      default: {
        break;
      }
    }

    return <ToolbarButton key={action.label} {...{ active, onToggle, action }} />;
  };

  render() {
    const { visible } = this.state;

    return (
      <StyledToolbarWrapper style={this.state.position} visible={visible}>
        <div style={{ position: 'absolute', bottom: 0 }}>
          <StyledToolbar
            innerRef={el => {
              this.toolbarEl = el;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {defaultActions.map(this.renderAction)}
            </div>
            <StyledArrow
              innerRef={el => {
                this.arrowEl = el;
              }}
            />
          </StyledToolbar>
        </div>
      </StyledToolbarWrapper>
    );
  }
}
