import { test, expect, describe } from 'vitest';

import { TNode } from './node';

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

test('TNode | $.key', () => {
  const node = new TNode('a-key-for-node');
  expect(node.$.key()).toBe('a-key-for-node');
});

describe.concurrent('TNode | $.depth', () => {
  const root = new TNode('root');
  const child = new TNode('child', { parent: root });
  const grandChild = new TNode('grandChild', { parent: child });

  test('(no parent provided during constructor) should return 1', () => {
    expect(root.$.depth()).toBe(1);
  });

  test('(parent provided during constructor) should return parent.depth + 1', () => {
    expect(root.$.depth()).toBe(1);
    expect(child.$.depth()).toBe(root.$.depth() + 1);
    expect(grandChild.$.depth()).toBe(child.$.depth() + 1);
  });
});

describe.concurrent('TNode | $.path', () => {
  const root = new TNode('root');
  const child = new TNode('child', { parent: root });
  const grandChild = new TNode('grandChild', { parent: child });

  test('default', () => {
    expect(root.$.path()).toBe('root');
    expect(child.$.path()).toBe('root/child');
    expect(grandChild.$.path()).toBe('root/child/grandChild');
  });

  test('with custom separator', () => {
    expect(grandChild.$.path({ separator: '.' })).toBe('root.child.grandChild');
  });

  test('with custom positive depth', () => {
    expect(grandChild.$.path({ depth: 2 })).toBe('child/grandChild');
  });

  test('with custom positive depth greater than tree height', () => {
    expect(grandChild.$.path({ depth: grandChild.$.depth() + 1 })).toBe('root/child/grandChild');
  });

  test('with custom negative depth', () => {
    expect(grandChild.$.path({ depth: -2 })).toBe('root');
  });

  test('with custom negative depth greater than tree height', () => {
    expect(grandChild.$.path({ depth: -grandChild.$.depth() - 1 })).toBe('');
  });

  test('with custom 0 depth', () => {
    expect(grandChild.$.path({ depth: 0 })).toBe('');
  });
});

describe.concurrent('TNode | $.root', () => {
  const root = new TNode('root');
  const child = new TNode('child', { parent: root });
  const grandChild = new TNode('grandChild', { parent: child });

  test('nonroot should point to root', () => {
    expect(child.$.root()).toBe(root);
    expect(grandChild.$.root()).toBe(root);
  });

  test('root should point to itself', () => {
    expect(root.$.root()).toBe(root);
  });
});

describe.concurrent('TNode | $.isRoot', () => {
  const root = new TNode('root');
  const child = new TNode('child', { parent: root });
  const grandChild = new TNode('grandChild', { parent: child });

  test('root should return true', () => {
    expect(root.$.isRoot()).toBe(true);
  });

  test('nonroot should return false', () => {
    expect(child.$.isRoot()).toBe(false);
    expect(grandChild.$.isRoot()).toBe(false);
  });
});

describe('TNode | $.children', () => {
  const root = new TNode('root');
  const child = new TNode('child', { parent: root });
  const anotherChild = new TNode('anotherChild', { parent: root });
  const grandChild = new TNode('grandChild', { parent: child });

  test('parent should store all children', () => {
    expect(root.$.children().includes(child)).toBe(true);
    expect(root.$.children().includes(anotherChild)).toBe(true);
    expect(child.$.children().includes(grandChild)).toBe(true);
    expect(root.$.children().includes(grandChild)).toBe(false);
  });
});

describe.concurrent('TNode | $.parent', () => {
  const root = new TNode('root');
  const child = new TNode('child', { parent: root });

  test('should point to correct parent node', () => {
    expect(child.$.parent()).toBe(root);
  });

  test('root should point to null', () => {
    expect(root.$.parent()).toBe(null);
  });
});

describe('TNode | $.data & __.setData', () => {
  test('default data should be empty object', () => {
    const node = new TNode('node');
    expect(node.$.data()).toMatchObject({});
  });

  const node = new TNode('node', { data: TNODE_MOCK_DATA });

  test('data should be reference, not copy', () => {
    expect(node.$.data()).toBe(TNODE_MOCK_DATA);
  });

  test('setting new data should override', () => {
    node.__.setData({});
    expect(node.$.data()).toMatchObject({});
  });
});

describe.concurrent('TNode | $.serialize & TNode | ::from', () => {
  const root = new TNode('root', { data: TNODE_MOCK_DATA });
  const child = new TNode('child', { parent: root });
  new TNode('anotherChild', { parent: root });
  new TNode('grandChild', { parent: child });

  test('default serializer should keep data as is', () => {
    const serialized = root.$.serialize();
    expect(JSON.stringify(serialized)).toMatchInlineSnapshot(
      '"{\\"key\\":\\"root\\",\\"children\\":[{\\"key\\":\\"child\\",\\"children\\":[{\\"key\\":\\"grandChild\\",\\"children\\":[],\\"data\\":{}}],\\"data\\":{}},{\\"key\\":\\"anotherChild\\",\\"children\\":[],\\"data\\":{}}],\\"data\\":{\\"number\\":1,\\"string\\":\\"string\\",\\"boolean\\":true,\\"object\\":{\\"nested\\":\\"nested\\"},\\"array\\":[{\\"id\\":\\"test\\"}],\\"specials\\":{\\"date\\":\\"2022-08-18T00:00:00.000Z\\",\\"node\\":{\\"_children\\":[],\\"_key\\":\\"example\\",\\"_data\\":{},\\"_parent\\":null,\\"_depth\\":1,\\"_pathSegments\\":[\\"example\\"]},\\"map\\":{},\\"set\\":{}}}}"',
    );
  });

  test('off dataSerializer should ignore data', () => {
    const serialized = root.$.serialize({ dataSerializer: false });
    expect(JSON.stringify(serialized)).toMatchInlineSnapshot(
      '"{\\"key\\":\\"root\\",\\"children\\":[{\\"key\\":\\"child\\",\\"children\\":[{\\"key\\":\\"grandChild\\",\\"children\\":[],\\"data\\":{}}],\\"data\\":{}},{\\"key\\":\\"anotherChild\\",\\"children\\":[],\\"data\\":{}}],\\"data\\":{}}"',
    );
  });

  test('custom dataSerializer', () => {
    const serialized = root.$.serialize({
      dataSerializer: (node) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { specials, ...rest } = node.$.data();
        return rest;
      },
    });
    expect(JSON.stringify(serialized)).toMatchInlineSnapshot(
      '"{\\"key\\":\\"root\\",\\"children\\":[{\\"key\\":\\"child\\",\\"children\\":[{\\"key\\":\\"grandChild\\",\\"children\\":[],\\"data\\":{}}],\\"data\\":{}},{\\"key\\":\\"anotherChild\\",\\"children\\":[],\\"data\\":{}}],\\"data\\":{\\"number\\":1,\\"string\\":\\"string\\",\\"boolean\\":true,\\"object\\":{\\"nested\\":\\"nested\\"},\\"array\\":[{\\"id\\":\\"test\\"}]}}"',
    );
  });

  test('turn on verbose', () => {
    const serialized = root.$.serialize({ verbose: true });
    expect(JSON.stringify(serialized)).toMatchInlineSnapshot(
      '"{\\"key\\":\\"root\\",\\"children\\":[{\\"key\\":\\"child\\",\\"children\\":[{\\"key\\":\\"grandChild\\",\\"children\\":[],\\"data\\":{},\\"depth\\":3,\\"isRoot\\":false,\\"path\\":\\"root/child/grandChild\\",\\"pathSegments\\":[\\"root\\",\\"child\\",\\"grandChild\\"]}],\\"data\\":{},\\"depth\\":2,\\"isRoot\\":false,\\"path\\":\\"root/child\\",\\"pathSegments\\":[\\"root\\",\\"child\\"]},{\\"key\\":\\"anotherChild\\",\\"children\\":[],\\"data\\":{},\\"depth\\":2,\\"isRoot\\":false,\\"path\\":\\"root/anotherChild\\",\\"pathSegments\\":[\\"root\\",\\"anotherChild\\"]}],\\"data\\":{\\"number\\":1,\\"string\\":\\"string\\",\\"boolean\\":true,\\"object\\":{\\"nested\\":\\"nested\\"},\\"array\\":[{\\"id\\":\\"test\\"}],\\"specials\\":{\\"date\\":\\"2022-08-18T00:00:00.000Z\\",\\"node\\":{\\"_children\\":[],\\"_key\\":\\"example\\",\\"_data\\":{},\\"_parent\\":null,\\"_depth\\":1,\\"_pathSegments\\":[\\"example\\"]},\\"map\\":{},\\"set\\":{}}},\\"depth\\":1,\\"isRoot\\":true,\\"path\\":\\"root\\",\\"pathSegments\\":[\\"root\\"]}"',
    );
  });

  test('construct node from serialized', () => {
    const serialized = root.$.serialize();
    const reconstructed = TNode.from(serialized);
    expect(reconstructed.$.key()).toBe(root.$.key());
    expect(reconstructed.$.children().length).toBe(root.$.children().length);
    expect(reconstructed.$.data()).toMatchObject(root.$.data());
  });
});

describe.concurrent('TNode | __.setParent', () => {
  const root = new TNode('root');

  const intactChild = new TNode('intactChild', { parent: root });
  const grandChild = new TNode('grandChild', { parent: intactChild });

  const childToBeDetached = new TNode('childToBeDetached', { parent: root });
  const grandChildOfDetached = new TNode('grandChildOfDetached', { parent: childToBeDetached });

  const childToBeMoved = new TNode('childToBeMoved', { parent: root });
  const grandChildOfMoved = new TNode('grandChildOfMoved', { parent: childToBeMoved });

  const newRoot = new TNode('newRoot');
  childToBeMoved.__.setParent(newRoot);

  childToBeDetached.__.setParent(null);

  test('moved child $.parent should point to new parent node', () => {
    expect(childToBeMoved.$.parent()).toBe(newRoot);
  });

  test('old children $.parent should point to old parent', () => {
    expect(intactChild.$.parent()).toBe(root);
  });

  test('moved child $.root should point to new root', () => {
    expect(childToBeMoved.$.root()).toBe(newRoot);
    expect(grandChildOfMoved.$.root()).toBe(newRoot);
  });

  test('old children $.root should point to old root', () => {
    expect(intactChild.$.root()).toBe(root);
    expect(grandChild.$.root()).toBe(root);
  });

  test('old parent should not have moved child', () => {
    expect(root.$.children().includes(childToBeMoved)).toBe(false);
  });

  test('old parent should still have any children not moved', () => {
    expect(root.$.children().includes(intactChild)).toBe(true);
  });

  describe.concurrent('detach child by setting parennull', () => {
    test('detached node should as null parent', () => {
      expect(childToBeDetached.$.parent()).toBe(null);
    });
    test('detached node should be new root', () => {
      expect(childToBeDetached.$.root()).toBe(childToBeDetached);
      expect(childToBeDetached.$.isRoot()).toBe(true);
      expect(grandChildOfDetached.$.root()).toBe(childToBeDetached);
    });
  });
});

describe.concurrent('TNode | __.addChildren && __.removeChildren', () => {
  const root = new TNode('root');
  const child = new TNode('child', { parent: root });

  const childOne = new TNode('childOne');
  const childTwo = new TNode('childTwo');
  root.__.addChildren(childOne, childTwo);
  root.__.removeChildren(childTwo);

  test('parent should store added children', () => {
    expect(root.$.children().includes(childOne)).toBe(true);
    expect(root.$.children().includes(child)).toBe(true);
  });

  test('added children $.parent should point to new parent', () => {
    expect(childOne.$.parent()).toBe(root);
    expect(child.$.parent()).toBe(root);
  });

  test('parent should no longer store removed children', () => {
    expect(root.$.children().includes(childTwo)).toBe(false);
    expect(root.$.children().includes(child)).toBe(true);
  });

  test('removed children $.parent should point to null', () => {
    expect(childTwo.$.parent()).toBe(null);
    expect(child.$.parent()).toBe(root);
  });
});
