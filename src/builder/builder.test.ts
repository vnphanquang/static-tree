import { test, expect } from 'vitest';

import { buildStaticTree } from './builder';

test('buildStaticTree | addData -> root', () => {
  const data = {
    number: 1,
    string: 'string',
    boolean: true,
    object: {},
    array: [],
  } as const;

  const sTree = buildStaticTree((builder) => {
    return builder.addData(data);
  }, 'root');

  const rootData = sTree.$.data();
  expect(rootData.number).toBe(data.number);
  expect(rootData.string).toBe(data.string);
  expect(rootData.boolean).toBe(data.boolean);
  expect(rootData.object).toBe(data.object);
  expect(rootData.array).toBe(data.array);
});
