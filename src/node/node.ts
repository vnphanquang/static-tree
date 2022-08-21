/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MinimalSerializedTNode,
  SerializedTNode,
  TNodeGetPathParams,
  TNodeData,
  TNodeInit,
  TNodeSerializeOptions,
  VerboseSerializedTNode,
  TNodePublicApi,
  TNodeInternalApi,
} from './node.types';

/**
 * @public
 *
 * Implementation for each node of the static tree
 *
 * @remarks
 *
 * ### Constructing TNode
 *
 * `TNode` is exported in the public api but you should probably avoid constructing
 * `TNode` directly. Instead, use the {@link tBuild} helper, as they provide
 * type safety and extension to `TNode` for better developer experience.
 *
 * ### Using TNode
 *
 * By design, `TNode` exposes two proxy method collections through two getters:
 *
 * - `$`: intended for public usage. You should interact with TNode through this.
 * - `__`: intended for internal usage only. Avoid this.
 *
 * ```typescript
 * const key = node.$.key();
 * const path = node.$.path({ depth: 2, separator: '.' });
 * // ...
 * ```
 *
 * @example
 *
 * ```typescript
 * import { TNode } from 'static-tree';
 *
 * // only do this only if you know exactly what you want
 * const parent = new TNode('parent');
 * const data = { prop: 'value' }
 * const child = new TNode('child', { parent, data });
 * ```
 */
export class TNode<Data extends TNodeData = {}> {
  private _parent: TNode | null;
  private _key: string;
  private _depth: number;
  private _pathSegments: string[];
  private _children: TNode[];
  private _data: Data;

  /**
   * @param key - key of this node
   * @param options - the {@link TNodeInit} instruction
   */
  constructor(key: string, options: TNodeInit<Data> = {}) {
    const { parent, data } = options;
    this._children = [];
    this._key = key;
    this._data = data ?? ({} as any);
    this.__setParent(parent);
  }

  /**
   * Construct a TNode and all its children from a serialized object (most
   * likely from the `TNode.$.serialize` method)
   *
   * @param serialized - a {@link SerializedTNode} object
   * @param parent - a {@link TNode} parent to attach to
   * @returns node {@link TNode}
   */
  public static from(serialized: SerializedTNode, parent?: TNode): TNode<any> {
    const { key, children, data } = serialized;
    const node = new TNode(key, { parent, data });
    for (const child of children) {
      const childNode = TNode.from(child, node);
      node.__addChildren(childNode);
    }
    return node;
  }

  /**
   * Change parent of current node and handle side effects, including:
   *
   * - remove current node from parent's children (if parent exists)
   *
   * - recompute path segments & depth
   *
   * @param parent - a {@link TNode} to attach to
   * @returns this {@link TNode}
   */
  private __setParent(parent?: TNode): TNode<Data> {
    const oldParent = this._parent;

    if (oldParent && oldParent.$children().includes(this)) {
      oldParent.__removeChildren(this);
    }

    this._parent = parent ?? null;

    if (this._parent && !this._parent.$children().includes(this)) {
      this._parent.$children().push(this);
    }

    this._depth = (this._parent?.$depth() ?? 0) + 1;

    this._pathSegments = [this.$key()];
    let traversedParent = this._parent;
    while (traversedParent) {
      this._pathSegments.unshift(traversedParent.$key());
      traversedParent = traversedParent.$parent();
    }

    for (const child of this.$children()) {
      child.__setParent(this);
    }

    return this;
  }

  /**
   * Add children to record & set their parent to current node
   *
   * @param nodes - {@link TNode}[] list of nodes to add
   * @returns this {@link TNode}
   */
  private __addChildren(...nodes: TNode[]): TNode<Data> {
    this.$children().push(...nodes);
    for (const node of nodes) {
      node.__setParent(this);
    }
    return this;
  }

  /**
   * Remove specified children from this node, and set their parent to null
   *
   * @param nodes - {@link TNode}[] list of nodes to remove
   * @returns this {@link TNode}
   */
  private __removeChildren(...nodes: TNode[]): TNode<Data> {
    this._children = this._children.filter((n) => nodes.every((r) => r != n));
    for (const node of nodes) {
      node.__setParent(null);
    }
    return this;
  }

  /**
   * Set internal data for this node
   *
   * @param data - {@link TNodeData} to add
   * @returns this {@link TNode}
   */
  private __setData<NewData extends TNodeData>(data: NewData): TNode<NewData> {
    this._data = data as any;
    return this as TNode<NewData>;
  }

  /**
   * @returns key of this node
   */
  private $key(): string {
    return this._key;
  }

  /**
   * @returns depth of this node
   */
  private $depth(): number {
    return this._depth;
  }

  /**
   * @returns parent of this node, or null if node is a root
   */
  private $parent(): TNode | null {
    return this._parent;
  }

  /**
   * @returns children {@link TNode} of this node
   */
  private $children(): TNode[] {
    return this._children;
  }

  /**
   * Construct the paths for this node
   *
   * @param params - a {@link TNodeGetPathParams} instruction for how path is constructed
   * @returns path
   */
  private $path(params: TNodeGetPathParams = {}): string {
    const { depth = this._pathSegments.length, separator = '/', reversed = false, till } = params;
    const len = this._pathSegments.length;

    let count = Math.abs(depth);
    let node: TNode = this as TNode;
    let anchor = len;
    while (count > 0 && node) {
      count--;
      anchor--;
      if (node == till) {
        break;
      }
      node = node.$parent();
    }

    let start = anchor;
    let end = len;
    if (depth < 0) {
      start = 0;
      end = till ? len - anchor : depth;
    }

    let segments = this._pathSegments.slice(start, end);
    if (reversed) segments = segments.reverse();

    return segments.join(separator);
  }

  /**
   * @returns whether node is a root (no parent)
   */
  private $isRoot(): boolean {
    return !this.$parent();
  }

  /**
   * @returns root {@link TNode} of the tree
   */
  private $root(): TNode {
    let node: TNode = this as TNode;
    while (node.$parent()) {
      node = node.$parent();
    }
    return node;
  }

  /**
   * @param options - a {@link TNodeSerializeOptions} object
   * @returns a serializable {@link SerializedTNode} object
   */
  private $serialize<M extends boolean>(
    options: TNodeSerializeOptions<M, Data> = {},
  ): M extends true ? VerboseSerializedTNode : MinimalSerializedTNode {
    const { verbose, dataSerializer } = options;
    let data: any = this._data;
    if (typeof dataSerializer === 'boolean' && dataSerializer === false) {
      data = {};
    } else if (typeof dataSerializer === 'function') {
      data = dataSerializer(this);
    }
    return {
      key: this.$key(),
      children: this.$children().map((c) => c.$serialize(options)),
      data,
      ...(verbose && {
        depth: this.$depth(),
        isRoot: this.$isRoot(),
        path: this.$path(),
        pathSegments: this._pathSegments,
      }),
    } as M extends true ? VerboseSerializedTNode : MinimalSerializedTNode;
  }

  /**
   * @returns internal data {@link TNodeData} of this node
   */
  private $data(): Data {
    return this._data;
  }

  /**
   * @returns the {@link TNodePublicApi} of {@link TNode}
   */
  public get $(): TNodePublicApi<Data> {
    return {
      key: this.$key.bind(this),
      depth: this.$depth.bind(this),
      path: this.$path.bind(this),
      root: this.$root.bind(this),
      isRoot: this.$isRoot.bind(this),
      children: this.$children.bind(this),
      parent: this.$parent.bind(this),
      serialize: this.$serialize.bind(this),
      data: this.$data.bind(this),
    };
  }

  /**
   * @returns the {@link TNodeInternalApi} of {@link TNode}
   */
  public get __(): TNodeInternalApi<Data> {
    return {
      setParent: this.__setParent.bind(this) as typeof this.__setParent,
      addChildren: this.__addChildren.bind(this) as typeof this.__addChildren,
      removeChildren: this.__removeChildren.bind(this) as typeof this.__removeChildren,
      setData: this.__setData.bind(this) as typeof this.__setData,
    };
  }
}
