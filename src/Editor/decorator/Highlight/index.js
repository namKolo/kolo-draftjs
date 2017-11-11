// @flow
import * as React from 'react';
import type { DraftDecoratorStrategy, DraftDecorator } from 'draft-js/lib/DraftDecorator';
import CharacterMetadata from 'draft-js/lib/CharacterMetadata';

const SearchHighlight = (props: { children: React.Node }): React.Node => (
  <span style={{ color: 'red' }}>{props.children}</span>
);

const strategy: DraftDecoratorStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character: CharacterMetadata): boolean => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      entityKey !== undefined &&
      contentState.getEntity(entityKey).getType() === 'HIGHLIGHT'
    );
  }, callback);
};

const HighlightDecorator: DraftDecorator = {
  strategy,
  component: SearchHighlight
};

export default HighlightDecorator;
