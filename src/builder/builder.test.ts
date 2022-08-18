import { test, expect, describe } from 'vitest';

import { TNODE_MOCK_DATA } from '../node/node.test';

import { buildStaticTree } from './builder';

const sTree = buildStaticTree(
  (builder) =>
    builder
      .addData(TNODE_MOCK_DATA)
      .addChild('child', (builder) => builder.addData(TNODE_MOCK_DATA).addChild('grandChild'))
      .addChild('leafChild'),
  'key',
);

describe('buildStaticTree', () => {
  test('if no root key is provided, "root" is default', () => {
    expect(buildStaticTree((builder) => builder).$.key()).toBe('root');
  });

  test('data should be typed and returned correctly', () => {
    expect(sTree.$.data()).toMatchObject(TNODE_MOCK_DATA);
    expect(sTree.child.$.data()).toMatchObject(TNODE_MOCK_DATA);
  });

  test('children should be typed and match', () => {
    expect(sTree.$.key()).toBe('key');
    expect(sTree.child.$.key()).toBe('child');
    expect(sTree.child.grandChild.$.key()).toBe('grandChild');
  });
});
