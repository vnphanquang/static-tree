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

const { node: sTree } = tBuild('key', {
  pathResolver: () => 'customPathSegment',
  build: (builder) =>
    builder
      .addData(TNODE_MOCK_DATA)
      .addChild('child', {
        build: (builder) =>
          builder
            .addChild('justKey')
            .addChild(new ExtendedTNodeBuilder('external'))
            .addChild('tBuild', {
              build: (builder) =>
                builder
                  .addChild(tBuild('tBuildJustKey').builder)
                  .addChild(tBuild(new ExtendedTNodeBuilder('tBuildWithBuilder')).builder)
                  .addChild(
                    tBuild('tBuildFull', {
                      build: (builder) => builder.addChild('final'),
                    }).builder,
                  ),
            }),
      })
});

describe('tBuild', () => {
  test('data should be typed and returned correctly', () => {
    expect(sTree.$.data()).toMatchObject(TNODE_MOCK_DATA);
    expect(sTree.$.data().number).toBe(TNODE_MOCK_DATA.number);
  });

  test('children should be typed and match', () => {
    expect(sTree.$.key()).toBe('key');
    expect(sTree.child.$.path()).toBe('customPathSegment/child');
    expect(sTree.child.justKey.$.path()).toBe('customPathSegment/child/justKey');
    expect(sTree.child.external.$.path()).toBe('customPathSegment/child/external');
    expect(sTree.child.tBuild.$.path()).toBe('customPathSegment/child/tBuild');
    expect(sTree.child.tBuild.tBuildJustKey.$.path()).toBe(
      'customPathSegment/child/tBuild/tBuildJustKey',
    );
    expect(sTree.child.tBuild.tBuildWithBuilder.$.path()).toBe(
      'customPathSegment/child/tBuild/tBuildWithBuilder',
    );
    expect(sTree.child.tBuild.tBuildFull.$.path()).toBe(
      'customPathSegment/child/tBuild/tBuildFull',
    );
    expect(sTree.child.tBuild.tBuildFull.final.$.path()).toBe(
      'customPathSegment/child/tBuild/tBuildFull/final',
    );
  });

  test('serialization should match', () => {
    expect(sTree.$.serialize({ verbose: true })).toMatchSnapshot();
  });
});

describe('real life example test', () => {
  const { node: api } = tBuild('api', {
    pathResolver: () => 'https://api.domain.example',
    build: (builder) =>
      builder
        .addChild('auth', {
          build: (builder) =>
            builder
              .addChild('logout')
              .addChild('oauth', {
                build: (builder) => builder.addChild('google').addChild('discord'),
                //...
              })
              .addChild('nestedCamelCaseKey', {
                pathResolver: () => 'nested-camel-case-key',
              }),
        })
        .addChild('camelCaseKey', {
          pathResolver: () => 'camel-case-key',
        })
        .addChild(':organization', {
          pathResolver: (_, arg) => arg,
          build: (builder) =>
            builder.addChild(':user', {
              pathResolver: (_, arg) => arg,
            }),
        }),
  });

  test('full path should match', () => {
    expect(api.auth.oauth.google.$.path(), 'https://api.domain.example/auth/oauth/google');
  });
  test('path with positive depth should match', () => {
    expect(api.auth.oauth.google.$.path({ depth: 2 }), 'oauth/google');
  });
  test('path with negative depth should match', () => {
    expect(api.auth.oauth.google.$.path({ depth: -2 }), 'https://api.domain.example/auth');
  });
  test('custom pathResolver should resolve correctly', () => {
    expect(api.camelCaseKey.$.path()).toBe('https://api.domain.example/camel-case-key');
    expect(api.auth.nestedCamelCaseKey.$.path()).toBe(
      'https://api.domain.example/auth/nested-camel-case-key',
    );
  });
  test('dynamic arguments should work', () => {
    expect(api[':organization'][':user'].$.path({
      args: {
        ':organization': 'test-org',
        ':user': 'test-user',
      },
    })).toEqual('https://api.domain.example/test-org/test-user');
  });
});
