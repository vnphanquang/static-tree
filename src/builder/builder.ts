/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNode } from '../node';
import type { TNodeData, TNodeInit } from '../node';

import type { ExtendedTNode, ExtendedTNodeBuildInput, TBuildOutput } from './builder.types';

/**
 * @public
 *
 * Builder for {@link ExtendedTNode}
 *
 * @remarks
 *
 * This is used internally by {@link tBuild}. Alternatively, this can
 * be used if a more method-based, verbose solution is preferred.
 *
 * @example
 *
 * ```typescript
 * import { ExtendedTNodeBuilder } from 'static-tree';
 *
 * const node = new ExtendedTNodeBuilder('key')
 *   .addData({ number: 1, boolean: true, string: 'string' })
 *   .addChild({
 *      key: 'childOne',
 *      build: (builder) => builder
 *        .addData({ childData: 'something else' })
 *        .addChildren('grandChild),
 *   })
 *   .addChild('childTwo', builder => builder.addChild('grandChild'))
 *   .build();
 * ```
 *
 * @example
 *
 * For advanced usage, `ExtendedTNodeBuilder` can also be used
 * as the input in `addChild`, should it provide any benefit.
 *
 * ```typescript
 * import { tBuild, ExtendedTNodeBuilder } from 'static-tree';
 *
 * const externalBuilder = new ExtendedTNodeBuilder('external')
 *  .addData({ some: 'some' })
 *  .addChild('someChild');
 *
 * const { node } = tBuild({
 *   key: 'root',
 *   build: (builder) => builder.addChild(externalBuilder),
 * });
 *
 * node.external.someChild.$.path(); // -\> `root/external/someChild`
 * ```
 */
export class ExtendedTNodeBuilder<
  Key extends string,
  ChildrenRecord extends Record<string, ExtendedTNode> = {},
  Data extends TNodeData = {},
> {
  private _node: ExtendedTNode;
  private _key: Key;

  /**
   * @param key - key for the {@link ExtendedTNode} to be built
   * @param parent - parent {@link TNode} to attach to
   */
  constructor(key: Key, options: Omit<TNodeInit<Data>, 'data'> = {}) {
    this._node = new TNode(key, options);
    this._key = key;
  }

  /**
   * add a type-safe child to the {@link ExtendedTNode} to be built
   *
   * @example
   *
   * `addChild` with just a key (no nested children, no internal data)
   *
   * ```typescript
   * import { tBuild } from 'static-tree';
   *
   * const { node } = tBuild({
   *   key: 'root',
   *   build: (builder) => builder.addChild('child'),
   * });
   * ```
   *
   * @example
   *
   * `addChild` with a build callback for nested children & adding data
   *
   * ```typescript
   * import { tBuild } from 'static-tree';
   *
   * const { node } = tBuild({
   *   key: 'root',
   *   build: (builder) => builder
   *     .addChild({
   *        key: 'child',
   *        build: (builder) => builder
   *          .addData({ some: 'child data' })
   *          .addChild('grandChildren'),
   *     }),
   * });
   * ```
   *
   * @example
   *
   * `addChild` with external `ExtendedTNodeBuilder` (advanced use case)
   *
   * ```typescript
   * import { tBuild, ExtendedTNodeBuilder } from 'static-tree';
   *
   * const externalBuilder = new ExtendedTNodeBuilder('external');
   *
   * const { node } = tBuild({
   *   key: 'root',
   *   build: (builder) => builder.addChildren(externalBuilder),
   * });
   * ```
   *
   * @param input - an {@link ExtendedTNodeBuildInput} instruction
   * @returns this {@link ExtendedTNodeBuilder}
   */
  public addChild<
    ChildKey extends string,
    GrandChildrenRecord extends Record<string, ExtendedTNode>,
    ChildData extends TNodeData = {},
  >(
    input: ExtendedTNodeBuildInput<ChildKey, GrandChildrenRecord, ChildData>,
  ): ExtendedTNodeBuilder<
    Key,
    ChildrenRecord & Record<ChildKey, ExtendedTNode<GrandChildrenRecord, ChildData>>,
    Data
  > {
    let key: ChildKey;
    let node: TNode;

    if (typeof input === 'string') {
      key = input;
      node = new ExtendedTNodeBuilder(key, { parent: this._node }).build();
    } else if (input instanceof ExtendedTNodeBuilder) {
      key = input._key;
      node = input.build();
      node.__.setParent(this._node);
    } else {
      key = input.key;
      node =
        input
          .build?.(
            new ExtendedTNodeBuilder(key, {
              parent: this._node,
              pathResolver: input.pathResolver,
            }),
          )
          .build() ?? new TNode(key, { parent: this._node });
    }

    (this._node as any)[key] = node;

    return this as unknown as ExtendedTNodeBuilder<
      Key,
      ChildrenRecord & Record<ChildKey, ExtendedTNode<GrandChildrenRecord, ChildData>>,
      Data
    >;
  }

  /**
   * add type-safe data to the {@link ExtendedTNode} to be built
   *
   * @example
   *
   * Using `tBuild`
   *
   * ```typescript
   * import { tBuild } from 'static-tree';
   *
   * const { node } = tBuild({
   *   key: 'root',
   *   build: (builder) => builder.addData({ some: 'data' }),
   * });
   * ```
   *
   * @example
   *
   * Using `ExtendedTNodeBuilder`
   *
   * @param data - the {@link TNodeData}
   * @returns this {@link ExtendedTNodeBuilder}
   */
  public addData<D extends TNodeData>(data: D): ExtendedTNodeBuilder<Key, ChildrenRecord, D> {
    this._node.__.setData(data);
    return this as ExtendedTNodeBuilder<Key, ChildrenRecord, D>;
  }

  /**
   * Build the {@link ExtendedTNode}
   *
   * @returns node {@link ExtendedTNode}
   */
  public build(): ExtendedTNode<ChildrenRecord, Data> {
    return this._node as ExtendedTNode<ChildrenRecord, Data>;
  }
}

/**
 * @public
 *
 * Build helper that uses {@link ExtendedTNodeBuilder} internally.
 *
 * @remarks
 *
 * Along with a built {@link ExtendedTNode}, `tBuild` outputs
 * an {@link ExtendedTNodeBuilder} for advanced use cases, see examples
 * for more details.
 *
 * @example
 *
 * Typical usage
 *
 * ```typescript
 * import { tBuild } = 'static-tree';
 *
 * const { node } = tBuild({
 *  key: 'root',
 *  build: (builder) => builder
 *    .addData({ some: 'root data' })
 *    .addChild('leaf')
 *    .addChild({
 *      key: 'child',
 *      build: (builder) => builder.addChild({
 *        key: 'grandChild',
 *        build: (builder) => builder.addData({ some: 'grand child data' }),
 *      }),
 *    }),
 * });
 *
 * node.$.data().some // -\> 'root data';
 * node.child.grandChild.$.data().some // -\> 'grand child data';
 * node.child.grandChild.$.path() // -\> 'root/child/grandChild';
 * ```
 *
 * @example
 *
 * Use `tBuild` builder output in nested `ExtendedTNodeBuildCallback`
 *
 * ```typescript
 * const { builder: externalBuilder } = tBuild({
 *   key: 'external',
 *   build: (builder) => builder.addChild('child').addData({ some: 'data' }),
 * });
 *
 * const { node } = tBuild({
 *   key: 'root',
 *   build: (builder) => builder.addChild(externalBuilder),
 * });
 * ```
 *
 * @param build - build instruction
 * @param key - key for the {@link ExtendedTNode} to be built
 * @returns
 */
export function tBuild<
  Key extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData,
>(
  input: ExtendedTNodeBuildInput<Key, ChildrenRecord, Data>,
): TBuildOutput<Key, ChildrenRecord, Data> {
  let builder: ExtendedTNodeBuilder<Key, ChildrenRecord, Data>;

  if (typeof input === 'string') {
    builder = new ExtendedTNodeBuilder(input);
  } else if (input instanceof ExtendedTNodeBuilder) {
    builder = input;
  } else {
    builder =
      input.build?.(
        new ExtendedTNodeBuilder(input.key, {
          pathResolver: input.pathResolver,
        }),
      ) ?? new ExtendedTNodeBuilder(input.key);
  }

  return {
    builder,
    node: builder.build(),
  };
}
