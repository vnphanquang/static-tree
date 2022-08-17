/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MinimalSerializedTNode,
  Serializable,
  SerializedTNode,
  TNodeGetPathParams,
  TNodeData,
  TNodeInit,
  TNodeSerializeOptions,
  VerboseSerializedTNode,
} from './node.types';

export class TNode<Data extends TNodeData = {}> {
  private _parent: TNode | null;
  private _key: string;
  private _depth: number;
  private _pathSegments: string[];
  private _children: TNode[];
  private _data: Data;

  constructor(key: string, options: TNodeInit<Data> = {}) {
    const { parent, data } = options;
    this._children = [];
    this._key = key;
    this._data = data ?? ({} as any);
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

  private __setData<NewData extends TNodeData>(data: NewData): TNode<NewData> {
    this._data = data as any;
    return this as TNode<NewData>;
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
    let node: TNode = this as TNode;
    while (node.__parent()) {
      node = node.__parent();
    }
    return node;
  }

  private __serialize<M extends boolean>(
    options: TNodeSerializeOptions<M> = {},
  ): M extends true ? VerboseSerializedTNode : MinimalSerializedTNode {
    const { verbose, dataSerializer } = options;
    let data: Serializable = undefined;
    if (typeof dataSerializer === 'boolean' && dataSerializer) {
      data = this._data;
    } else if (typeof dataSerializer === 'function') {
      data = dataSerializer(this);
    }
    return {
      key: this.__key(),
      children: this.__children().map((c) => c.__serialize(options)),
      data,
      ...(verbose && {
        depth: this.__depth(),
        isRoot: this.__isRoot(),
        path: this.__path(),
        pathSegments: this._pathSegments,
      }),
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
      data: () => this._data,
      __setParent: this.__setParent.bind(this) as typeof this.__setParent,
      __addChildren: this.__addChildren.bind(this) as typeof this.__addChildren,
      __setData: this.__setData.bind(this) as typeof this.__setData,
    };
  }
}
