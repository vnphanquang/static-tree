/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNode } from '../node';
import type { TNodeData, TNodeInit } from '../node';

import type { ExtendedTNode, ExtendedTNodeBuildConfig, TBuildOutput } from './builder.types';

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
 *   .addChild('childOne', {
 *      build: (builder) => builder
 *        .addData({ childData: 'something else' })
 *        .addChild('grandChild'),
 *   })
 *   .addChild('childTwo', { build: (builder) => builder.addChild('grandChild') })
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
 * const { node } = tBuild('root', {
 *   build: (builder) => builder.addChild(externalBuilder),
 * });
 *
 * node.external.someChild.$.path(); // -\> `root/external/someChild`
 * ```
 */
export class ExtendedTNodeBuilder<
  Key extends string,
  AncestorKeys extends string = never,
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
   * const { node } = tBuild('root', {
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
   * const { node } = tBuild('root', {
   *   build: (builder) => builder
   *     .addChild('child', {
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
   * const { node } = tBuild('root', {
   *   build: (builder) => builder.addChild(externalBuilder),
   * });
   * ```
   *
   * @param input - an {@link ExtendedTNodeBuildConfig} instruction
   * @returns this {@link ExtendedTNodeBuilder}
   */
  public addChild<
    ChildKey extends string,
    GrandChildrenRecord extends Record<string, ExtendedTNode>,
    ChildData extends TNodeData = {},
  >(
    builder: ExtendedTNodeBuilder<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>,
  ): ExtendedTNodeBuilder<
    Key,
    AncestorKeys,
    ChildrenRecord & Record<ChildKey, ExtendedTNode<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>>,
    Data
  >;
  public addChild<
    ChildKey extends string,
    GrandChildrenRecord extends Record<string, ExtendedTNode>,
    ChildData extends TNodeData = {},
  >(
    key: ChildKey,
    config?: ExtendedTNodeBuildConfig<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>,
  ): ExtendedTNodeBuilder<
    Key,
    AncestorKeys,
    ChildrenRecord & Record<ChildKey, ExtendedTNode<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>>,
    Data
  >;
  public addChild<
    ChildKey extends string,
    GrandChildrenRecord extends Record<string, ExtendedTNode>,
    ChildData extends TNodeData = {},
  >(
    input: ChildKey | ExtendedTNodeBuilder<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>,
    config?: ExtendedTNodeBuildConfig<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>,
  ): ExtendedTNodeBuilder<
    Key,
    AncestorKeys,
    ChildrenRecord & Record<ChildKey, ExtendedTNode<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>>,
    Data
  > {
    let rKey: ChildKey;
    let node: TNode;

    if (input instanceof ExtendedTNodeBuilder) {
      rKey = input._key;
      node = input.build();
      node.__.setParent(this._node);
    } else {
      rKey = input;
      const options = { parent: this._node, pathResolver: config?.pathResolver };
      if (config?.build) {
        node = config.build(new ExtendedTNodeBuilder(rKey, options)).build();
      } else {
        node = new TNode(rKey, options);
      }
    }

    (this._node as any)[rKey] = node;

    return this as unknown as ExtendedTNodeBuilder<
      Key,
      AncestorKeys,
      ChildrenRecord & Record<ChildKey, ExtendedTNode<ChildKey, AncestorKeys | Key, GrandChildrenRecord, ChildData>>,
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
   * const { node } = tBuild('root', {
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
  public addData<D extends TNodeData>(data: D): ExtendedTNodeBuilder<Key, AncestorKeys, ChildrenRecord, D> {
    this._node.__.setData(data);
    return this as unknown as ExtendedTNodeBuilder<Key, AncestorKeys, ChildrenRecord, D>;
  }

  /**
   * Build the {@link ExtendedTNode}
   *
   * @returns node {@link ExtendedTNode}
   */
  public build(): ExtendedTNode<Key, AncestorKeys, ChildrenRecord, Data> {
    return this._node as ExtendedTNode<Key, AncestorKeys, ChildrenRecord, Data>;
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
 * const { node } = tBuild('root', {
 *  build: (builder) => builder
 *    .addData({ some: 'root data' })
 *    .addChild('leaf')
 *    .addChild('child', {
 *      build: (builder) => builder.addChild('grandChild', {
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
 * const { builder: externalBuilder } = tBuild('external', {
 *   build: (builder) => builder.addChild('child').addData({ some: 'data' }),
 * });
 *
 * const { node } = tBuild('root', {
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
  AncestorKeys extends string = never,
>(
  builder: ExtendedTNodeBuilder<Key, AncestorKeys, ChildrenRecord, Data>,
): TBuildOutput<Key, AncestorKeys, ChildrenRecord, Data>;
export function tBuild<
  Key extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData,
  AncestorKeys extends string = never,
>(
  key: Key,
  config?: ExtendedTNodeBuildConfig<Key, AncestorKeys, ChildrenRecord, Data>,
): TBuildOutput<Key, AncestorKeys, ChildrenRecord, Data>;
export function tBuild<
  Key extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData,
  AncestorKeys extends string = never,
>(
  input: Key | ExtendedTNodeBuilder<Key, AncestorKeys, ChildrenRecord, Data>,
  config?: ExtendedTNodeBuildConfig<Key, AncestorKeys, ChildrenRecord, Data>,
): TBuildOutput<Key, AncestorKeys, ChildrenRecord, Data> {
  let builder: ExtendedTNodeBuilder<Key, AncestorKeys, ChildrenRecord, Data>;

  if (input instanceof ExtendedTNodeBuilder) {
    builder = input;
  } else {
    const options = {
      pathResolver: config?.pathResolver,
    };
    if (config?.build) {
      builder = config.build(new ExtendedTNodeBuilder(input, options));
    } else {
      builder = new ExtendedTNodeBuilder(input, options);
    }
  }

  return {
    builder,
    node: builder.build(),
  };
}
