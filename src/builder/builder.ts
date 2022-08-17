/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TNode } from '../node';
import type { TNodeData } from '../node';

import type { ExtendedTNode } from './builder.types';

export class ExtendedTNodeBuilder<
  ChildrenRecord extends Record<string, ExtendedTNode> = {},
  Data extends TNodeData = {},
> {
  private node: ExtendedTNode;

  constructor(key: string, parent?: TNode) {
    this.node = new TNode(key, { parent });
  }

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
      build?.(new ExtendedTNodeBuilder(key, this.node))?.build() ??
      new TNode(key, { parent: this.node });

    (this.node as any)[key] = node;

    this.node.$.__addChildren(node);

    return this as unknown as ExtendedTNodeBuilder<
      ChildrenRecord & Record<ChildKey, ExtendedTNode<GrandChildrenRecord, ChildData>>,
      Data
    >;
  }

  public addData<D extends Record<string, any>>(data: D): ExtendedTNodeBuilder<ChildrenRecord, D> {
    this.node.$.__setData(data);
    return this as ExtendedTNodeBuilder<ChildrenRecord, D>;
  }

  public build(): ExtendedTNode<ChildrenRecord, Data> {
    return this.node as ExtendedTNode<ChildrenRecord, Data>;
  }
}

export function buildStaticTree<
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData,
>(
  build: (builder: ExtendedTNodeBuilder) => ExtendedTNodeBuilder<ChildrenRecord, Data>,
  key = 'root',
): ExtendedTNode<ChildrenRecord, Data> {
  return build(new ExtendedTNodeBuilder(key)).build();
}
