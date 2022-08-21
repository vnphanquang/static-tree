import { test, expect, describe } from 'vitest';

import { TNode } from '../node';

import { ExtendedTNodeBuilder, tBuild } from './builder';

export const TNODE_MOCK_DATA = {
  number: 1,
  string: 'string',
  boolean: true,
  object: {
    nested: 'nested',
  },
  array: [
    {
      id: 'test',
    },
  ],
  specials: {
    date: new Date('2022-08-18'),
    node: new TNode('example'),
    map: new Map(),
    set: new Set(),
    function: () => 2,
  },
} as const;

const { node: sTree } = tBuild({
  key: 'key',
  build: (builder) =>
    builder.addData(TNODE_MOCK_DATA).addChild({
      key: 'child',
      build: (builder) =>
        builder
          .addChild('justKey')
          .addChild({ key: 'inputJustKey' })
          .addChild(new ExtendedTNodeBuilder('external'))
          .addChild({
            key: 'tBuild',
            build: (builder) =>
              builder
                .addChild(tBuild({ key: 'tBuildInputJustKey' }).builder)
                .addChild(tBuild('tBuildJustKey').builder)
                .addChild(tBuild(new ExtendedTNodeBuilder('tBuildWithBuilder')).builder)
                .addChild(
                  tBuild({
                    key: 'tBuildFull',
                    build: (builder) => builder.addChild('final'),
                  }).builder,
                ),
          }),
    }),
});

describe('tBuild', () => {
  test('data should be typed and returned correctly', () => {
    expect(sTree.$.data()).toMatchObject(TNODE_MOCK_DATA);
    expect(sTree.$.data().number).toBe(TNODE_MOCK_DATA.number);
  });

  test('children should be typed and match', () => {
    expect(sTree.$.key()).toBe('key');
    expect(sTree.child.$.path()).toBe('key/child');
    expect(sTree.child.justKey.$.path()).toBe('key/child/justKey');
    expect(sTree.child.inputJustKey.$.path()).toBe('key/child/inputJustKey');
    expect(sTree.child.external.$.path()).toBe('key/child/external');
    expect(sTree.child.tBuild.$.path()).toBe('key/child/tBuild');
    expect(sTree.child.tBuild.tBuildInputJustKey.$.path()).toBe(
      'key/child/tBuild/tBuildInputJustKey',
    );
    expect(sTree.child.tBuild.tBuildJustKey.$.path()).toBe('key/child/tBuild/tBuildJustKey');
    expect(sTree.child.tBuild.tBuildWithBuilder.$.path()).toBe(
      'key/child/tBuild/tBuildWithBuilder',
    );
    expect(sTree.child.tBuild.tBuildFull.$.path()).toBe('key/child/tBuild/tBuildFull');
    expect(sTree.child.tBuild.tBuildFull.final.$.path()).toBe('key/child/tBuild/tBuildFull/final');
  });

  test('serialization should match', () => {
    expect(sTree.$.serialize({ verbose: true })).toMatchSnapshot();
  });
});
