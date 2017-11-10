// @flow
import * as React from 'react';
import { Entity } from 'draft-js';
import type { DraftDecoratorStrategy } from 'draft-js/lib/DraftDecorator';

const SearchHighlight = (props: { children: React.Node }): React.Node => (
  <span style={{ color: 'red' }}>{props.children}</span>
);

export default function createDecorator() {
  const strategy: DraftDecoratorStrategy = (contentBlock, callback) => {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity();
      return entityKey && Entity.get(entityKey).getType() === 'HIGHLIGHT';
    }, callback);
  };

  return {
    strategy,
    component: SearchHighlight
  };
}
