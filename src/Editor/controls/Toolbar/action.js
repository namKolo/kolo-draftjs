// @flow
import BoldIcon from 'material-ui-icons/FormatBold';
import ItalicIcon from 'material-ui-icons/FormatItalic';
import HighlightIcon from 'material-ui-icons/Highlight';

import type { ToolbarAction } from './type';

const defaultActions: Array<ToolbarAction> = [
  { type: 'inline', label: 'B', style: 'BOLD', icon: BoldIcon },
  { type: 'inline', label: 'I', style: 'ITALIC', icon: ItalicIcon },
  { type: 'entity', label: '', icon: HighlightIcon, entity: 'HIGHLIGHT' }
];

export default defaultActions;
