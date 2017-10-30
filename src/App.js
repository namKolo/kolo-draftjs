import 'draft-js/dist/Draft.css';

import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }
  render() {
    return (
      <div className="app">
        <div className="mui--text-center mui--text-headline margin-bottom-small">
          Editor built on top of DraftJS
        </div>
        <div className="mui-panel">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Tell something you like"
          />
        </div>
      </div>
    );
  }
}

export default App;
