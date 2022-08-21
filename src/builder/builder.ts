/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNode } from '../node';
import type { TNodeData } from '../node';

import type { ExtendedTNode } from './builder.types';

/**
 * @public
 *
 * Builder for {@link ExtendedTNode}
 *
 * @remarks
 *
 * This is used internally by {@link buildStaticTree}. Alternatively, this can
 * be used if a more method-based, verbose solution is preferred.
 *
 * @example
 *
 * ```typescript
 * import { ExtendedTNodeBuilder } from 'static-tree';
 *
 * const node = new ExtendedTNodeBuilder('key')
 *   .addData({ number: 1, boolean: true, string: 'string' })
 *   .addChild('childOne', builder => builder.addData({ childData: 'something else' }))
 *   .addChild('childTwo', builder => builder.addChild('grandChild'))
 *   .build();
 * ```
 *
 * @example
 *
 * For advanced usage, `ExtendedTNodeBuilder` can also be used in place of
 * the `build` callback in `addChild`, should it provide any benefit.
 *
 * Be careful, however, as key-mismatch might be a problem.
 * Below, a `externalKey` const is to avoid having different key in
 * ExtendedTNodeBuilder & buildStaticTree.
 *
 * ```typescript
 * const externalKey = 'external';
 *
 * const externalBuilder = new ExtendedTNodeBuilder(externalKey)
 *  .addData({ some: 'some' })
 *  .addChild('someChild');
 *
 * const tree = buildStaticTree(
 *   (builder) => builder.addChild(externalKey, () => externalBuilder),
 *   'root',
 * );
 *
 * tree.external.someChild.$.path(); // -\> `root/external/someChild`
 * ```
 */
export class ExtendedTNodeBuilder<
  ChildrenRecord extends Record<string, ExtendedTNode> = {},
  Data extends TNodeData = {},
> {
  private node: ExtendedTNode;

  /**
   * @param key - key for the {@link ExtendedTNode} to be built
   * @param parent - parent {@link TNode} to attach to
   */
  constructor(key: string, parent?: TNode) {
    this.node = new TNode(key, { parent });
  }

  /**
   * add a type-safe child to the {@link ExtendedTNode} to be built
   *
   * @param key - key for child node
   * @param build - instruction for how child node is built
   * @returns this {@link ExtendedTNodeBuilder}
   */
  public addChild<
    ChildKey extends string,
    GrandChildrenRecord extends Record<string, ExtendedTNode>,
    ChildData extends TNodeData = {},
  >(
    key: ChildKey,
    build?: (builder: ExtendedTNodeBuilder) => ExtendedTNodeBuilder<GrandChildrenRecord, ChildData>,
  ): ExtendedTNodeBuilder<
    ChildrenRecord & Record<ChildKey, ExtendedTNode<GrandChildrenRecord, ChildData>>,
    Data
  > {
    const node =
      build?.(new ExtendedTNodeBuilder(key, this.node)).build() ??
      new TNode(key, { parent: this.node });

    (this.node as any)[key] = node;

    return this as unknown as ExtendedTNodeBuilder<
      ChildrenRecord & Record<ChildKey, ExtendedTNode<GrandChildrenRecord, ChildData>>,
      Data
    >;
  }

  /**
   * add type-safe data to the {@link ExtendedTNode} to be built
   *
   * @param data - the {@link TNodeData}
   * @returns this {@link ExtendedTNodeBuilder}
   */
  public addData<D extends TNodeData>(data: D): ExtendedTNodeBuilder<ChildrenRecord, D> {
    this.node.__.setData(data);
    return this as ExtendedTNodeBuilder<ChildrenRecord, D>;
  }

  /**
   * Build the {@link ExtendedTNode}
   * @returns node {@link ExtendedTNode}
   */
  public build(): ExtendedTNode<ChildrenRecord, Data> {
    return this.node as ExtendedTNode<ChildrenRecord, Data>;
  }
}

/**
 * @public
 *
 * Build helper that uses {@link ExtendedTNodeBuilder} internally.
 *
 * @example
 *
 * ```typescript
 * // TODO: add example here
 * ```
 *
 * @param build - build instruction
 * @param key - key for the {@link ExtendedTNode} to be built
 * @returns
 */
export function buildStaticTree<
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData,
>(
  build: (builder: ExtendedTNodeBuilder) => ExtendedTNodeBuilder<ChildrenRecord, Data>,
  key = 'root',
): ExtendedTNode<ChildrenRecord, Data> {
  return build(new ExtendedTNodeBuilder(key)).build();
}
// TODO:
// - rename `buildStaticTree` to just `tBuild`?
// - change key to first parameter, or parameter as single object with all optional?
// - allow to return the builder itself and not just the built node?
// - retry to implement .from(serialized)?
// - implement TNode path method options: reverse: boolean & till: TNode
// - allow build option to be either the full option or just builder object (in which cas extract key from the builder)
