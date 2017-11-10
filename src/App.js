// @flow
import 'draft-js/dist/Draft.css';
import 'whatwg-fetch';
import isEmpty from 'lodash/isEmpty';
import React, { Component } from 'react';
import { EditorState, convertToRaw, convertFromRaw, CompositeDecorator } from 'draft-js';
import type { RawDraftContentState } from 'draft-js/lib/RawDraftContentState';

import Editor from './Editor';
import createSearchHighlightDecorater from './Editor/decorator/SearchHighlight';

import './App.css';

type Props = {};

type State = {
  editorState: EditorState,
  isSaving: boolean,
  searchVisible: boolean
};

class App extends Component<Props, State> {
  state: State = {
    editorState: EditorState.createEmpty(
      new CompositeDecorator([createSearchHighlightDecorater()])
    ),
    isSaving: false,
    searchVisible: false
  };

  input: ?HTMLInputElement;

  componentDidMount() {
    /*
      Fetch raw editor state from server whenever component mounts
      Then store it to state.
    */
    fetch('http://localhost:4000/state')
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (isEmpty(response)) {
          return;
        }
        const contentState = convertFromRaw(response);

        this.setState({
          editorState: EditorState.createWithContent(contentState)
        });
      });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.searchVisible && this.state.searchVisible && this.input) {
      this.input.focus();
    }
  }

  handleEditorStateChange = (editorState: EditorState) => this.setState({ editorState });

  serializeEditorState = (editorState: EditorState): RawDraftContentState => {
    /*
      parse it to javascript object. And send it to server as JSON.
      Server will receive and store it to db.
    */
    return convertToRaw(editorState.getCurrentContent());
  };

  handleSyncToServer = () => {
    const { editorState } = this.state;
    const data = this.serializeEditorState(editorState);
    this.setState({ isSaving: true });
    /*
      Save current raw editor state to server
    */
    fetch('http://localhost:4000/state', {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      this.setState({ isSaving: false });
    });
  };

  handleSearchChange = (event: Object) => {
    const text = event.target.value;
    this.setState({
      editorState: EditorState.set(this.state.editorState, {
        decorator: new CompositeDecorator([createSearchHighlightDecorater()])
      })
    });
  };

  render() {
    return (
      <div className="app">
        <div className="mui--text-center mui--text-headline margin-bottom-small">
          Editor built on top of DraftJS
        </div>
        <div className="mui-panel">
          <Editor
            editorState={this.state.editorState}
            onChange={this.handleEditorStateChange}
            placeholder="Tell something you like"
            onSearch={() => this.setState({ searchVisible: !this.state.searchVisible })}
          />
          <div>
            {this.state.searchVisible && (
              <input onChange={this.handleSearchChange} ref={input => (this.input = input)} />
            )}
          </div>
          <div onClick={this.handleSyncToServer} className="mui-btn">
            SAVE
          </div>
        </div>
      </div>
    );
  }
}

export default App;
