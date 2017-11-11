/*
 Copy from https://github.com/draft-js-plugins/draft-js-plugins/tree/master/draft-js-focus-plugin
*/
import { List } from 'immutable';

const createBlockKeyStore = () => {
  let keys = List();

  const add = key => {
    keys = keys.push(key);
    console.log('oh yeah', key);
    return keys;
  };

  const remove = key => {
    keys = keys.filter(item => item !== key);
    return keys;
  };

  return {
    add,
    remove,
    includes: key => keys.includes(key),
    getAll: () => keys
  };
};

export default createBlockKeyStore;
