interface TNodeInit {
  parent?: TNode;
}

interface TNodeGetPathParams {
  separator?: string;
  depth?: number;
}

interface MinimalSerializedTNode {
  key: string;
  children: MinimalSerializedTNode[];
}

interface VerboseSerializedTNode extends MinimalSerializedTNode {
  children: VerboseSerializedTNode[];
  pathSegments: string[],
  depth: number;
  isRoot: boolean;
  path: string;
}

type SerializedTNode = VerboseSerializedTNode | MinimalSerializedTNode;

interface TNodeSerializeOptions<V extends boolean> {
  verbose?: V;
}

class TNode {
  private _parent: TNode | null;
  private _key: string;
  private _depth: number;
  private _pathSegments: string[];
  private _children: TNode[];

  constructor(key: string, options: TNodeInit = {}) {
    const { parent } = options;
    this._children = [];
    this._key = key;
    this.onParentChange(parent);
  }

  private onParentChange(node?: TNode) {
    this._parent = node ?? null;
    this._depth = (this._parent?.__depth() ?? 0) + 1;

    this._pathSegments = [this.__key()];
    let traversedParent = this._parent;
    while (traversedParent) {
      this._pathSegments.unshift(traversedParent.__key());
      traversedParent = traversedParent.__parent();
    }
  }

  private __setParent(node: TNode): TNode {
    this.onParentChange(node);
    return this;
  }

  private __addChildren(...nodes: TNode[]): TNode {
    this.__children().push(...nodes);
    return this;
  }

  private __key(): string {
    return this._key;
  }

  private __depth(): number {
    return this._depth;
  }

  private __parent(): TNode | null {
    return this._parent;
  }

  private __children(): TNode[] {
    return this._children;
  }

  private __path(params: TNodeGetPathParams = {}): string {
    const { depth = this._pathSegments.length, separator = '/' } = params;
    const len = this._pathSegments.length;
    return this._pathSegments.slice(len - depth, len).join(separator);
  }

  private __isRoot(): boolean {
    return !this.__parent();
  }

  private __root(): TNode {
    let node: TNode = this;
    while (true) {
      const parent = node.__parent();
      if (!parent) return node;
      node = parent;
    }
  }

  private __serialize<M extends boolean>(options: TNodeSerializeOptions<M> = {}): M extends true ? VerboseSerializedTNode : MinimalSerializedTNode {
    const { verbose } = options;
    return {
      key: this.__key(),
      children: this.__children().map(c => c.__serialize(options)),
      ...(verbose && {
        depth: this.__depth(),
        isRoot: this.__isRoot(),
        path: this.__path(),
        pathSegments: this._pathSegments,
      })
    } as M extends true ? VerboseSerializedTNode : MinimalSerializedTNode;
  }

  public static from(serialized: SerializedTNode, parent?: TNode) {
    const { key, children } = serialized;
    const node = new TNode(key, { parent });
    for (const child of children) {
      const childNode = TNode.from(child, node);
      node.__addChildren(childNode);
    }
    return node;
  }

  public get $() {
    return {
      key: this.__key.bind(this) as typeof this.__key,
      depth: this.__depth.bind(this) as typeof this.__depth,
      parent: this.__parent.bind(this) as typeof this.__parent,
      children: this.__children.bind(this) as typeof this.__children,
      path: this.__path.bind(this) as typeof this.__path,
      isRoot: this.__isRoot.bind(this) as typeof this.__isRoot,
      root: this.__root.bind(this) as typeof this.__root,
      serialize: this.__serialize.bind(this) as typeof this.__serialize,
      __setParent: this.__setParent.bind(this) as typeof this.__setParent,
      __addChildren: this.__addChildren.bind(this) as typeof this.__addChildren,
    };
  }
}

type ExtendedTNode<M extends Record<string, ExtendedTNode> = {}> = TNode & M;

class TNodeBuilder<ChildrenMap extends Record<string, ExtendedTNode> = {}> {
  private node: ExtendedTNode;

  constructor(key: string, parent?: TNode) {
    this.node = new TNode(key, { parent });
  }

  addNode<K extends string, M extends Record<string, ExtendedTNode>>(
    key: K,
    build?: ((builder: TNodeBuilder) => TNodeBuilder<M>)
  ): TNodeBuilder<ChildrenMap & Record<K, ExtendedTNode<M>>> {
    const node = build?.(new TNodeBuilder(key, this.node))?.build() ?? new TNode(key, { parent: this.node });
    (this.node as any)[key] = node;
    this.node.$.__addChildren(node);
    return this as unknown as TNodeBuilder<ChildrenMap & Record<K, ExtendedTNode<M>>>;
  }

  build(): ExtendedTNode<ChildrenMap> {
    return this.node as ExtendedTNode<ChildrenMap>;
  }
}

function buildStaticTree<M extends Record<string, ExtendedTNode> = {}>(
  build: (builder: TNodeBuilder) => TNodeBuilder<M>,
  rootKey = 'root',
): ExtendedTNode<M> {
  return build(new TNodeBuilder(rootKey)).build();
}

// const tt = buildStaticTree((builder) =>
//   builder
//     .addNode(
//       'child',
//       (builder) => builder.addNode(
//         'grandchild',
//         (builder) => builder
//           .addNode('grandgrandchild')
//           .addNode('grandgrandchildTwo')
//           .addNode('grandgrandchildThree'),
//     ).addNode(
//       'grandchildTwo',
//     )
//   ),
// );

// const k = tt.child.grandchild.grandgrandchildThree.$.path();

// const dedep = TNode.from(tt.$.serialize());

// // console.log('K', k);
// // console.log(tt.child.grandchild.$.children());
// // console.log(tt.child.grandchild.grandgrandchildThree.$.root());
// console.log(JSON.stringify(dedep.$.serialize(), null, 2))
