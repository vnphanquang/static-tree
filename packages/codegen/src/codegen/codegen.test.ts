import { tBuild } from 'static-tree';
import { expect, test } from 'vitest';

import { generate } from './codegen';

const { node } = tBuild({
  key: 'api',
  pathResolver: () => 'https://api.domain.example',
  build: (builder) =>
    builder
      .addData({
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
      })
      .addChild({
        key: 'auth',
        build: (builder) =>
          builder
            .addChild('logout')
            .addChild({
              key: 'oauth',
              build: (builder) =>
                builder
                  .addChild('google')
                  .addChild('discord')
                  .addChild('facebook')
                  .addChild('github'),
            })
            .addChild('login'),
      })
      .addChild('healthcheck'),
});

test('generate', () => {
  expect(generate(node.$.serialize())).toMatchSnapshot();
});
