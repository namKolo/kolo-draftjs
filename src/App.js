// @flow
import 'draft-js/dist/Draft.css';

import React, { Component } from 'react';
import { Editor, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import type { RawDraftContentState } from 'draft-js/lib/RawDraftContentState';
import 'whatwg-fetch';

import './App.css';

type Props = {};

type State = {
  editorState: EditorState,
  isSaving: boolean,
};

class App extends Component<Props, State> {
  state: State = {
    editorState: EditorState.createEmpty(),
    isSaving: false,
  };

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
        const contentState = convertFromRaw(response);
        this.setState({
          editorState: EditorState.createWithContent(contentState),
        });
      });
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
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      this.setState({ isSaving: false });
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
          />
          <div onClick={this.handleSyncToServer} className="mui-btn">
            SAVE
          </div>
        </div>
      </div>
    );
  }
}

export default App;
