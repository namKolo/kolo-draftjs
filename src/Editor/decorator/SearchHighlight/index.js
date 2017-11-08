// @flow
import * as React from 'react';
import type { DraftDecoratorStrategy } from 'draft-js/lib/DraftDecorator';

const SearchHighlight = (props: { children: React.Node }): React.Node => (
  <span style={{ color: 'red' }}>{props.children}</span>
);

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText();
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    callback(start, end);
  }
};

export default function createDecorator(searchedKey: string) {
  const regex = new RegExp(searchedKey, 'g');
  const strategy: DraftDecoratorStrategy = (contentBlock, callback) => {
    if (searchedKey !== '') {
      findWithRegex(regex, contentBlock, callback);
    }
  };

  return {
    strategy,
    component: SearchHighlight
  };
}
