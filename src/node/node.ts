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
    const oldParent = this._parent;
    if (oldParent && oldParent.__children().includes(this)) {
      oldParent.__removeChildren(this);
    }
    this._parent = node ?? null;
    if (this._parent && !this._parent.__children().includes(this)) {
      this._parent.__children().push(this);
    }
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
    for (const node of nodes) {
      node.__setParent(this);
    }
    return this;
  }

  private __removeChildren(...nodes: TNode[]): TNode {
    this._children = this._children.filter((n) => nodes.every((r) => r != n));
    for (const node of nodes) {
      node.__setParent(null);
    }
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
    let start = len - Math.min(depth, len);
    let end = len;
    if (depth < 0) {
      start = 0;
      end = len + Math.max(depth, -len);
    }
    return this._pathSegments.slice(start, end).join(separator);
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
    let data: Serializable = this._data;
    if (typeof dataSerializer === 'boolean' && dataSerializer === false) {
      data = {};
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
    const { key, children, data } = serialized;
    const node = new TNode(key, { parent, data });
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
      path: this.__path.bind(this) as typeof this.__path,
      root: this.__root.bind(this) as typeof this.__root,
      isRoot: this.__isRoot.bind(this) as typeof this.__isRoot,
      children: this.__children.bind(this) as typeof this.__children,
      parent: this.__parent.bind(this) as typeof this.__parent,
      serialize: this.__serialize.bind(this) as typeof this.__serialize,
      data: () => this._data,
    };
  }

  public get __() {
    return {
      setParent: this.__setParent.bind(this) as typeof this.__setParent,
      addChildren: this.__addChildren.bind(this) as typeof this.__addChildren,
      removeChildren: this.__removeChildren.bind(this) as typeof this.__removeChildren,
      setData: this.__setData.bind(this) as typeof this.__setData,
    };
  }
}
