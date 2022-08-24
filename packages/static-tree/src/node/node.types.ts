/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TNode } from './node';

/**
 * @public
 *
 * Additional instruction during {@link TNode} construction
 */
export interface TNodeInit<D extends Record<string, any> = {}> {
  /**
   * Initial TNode parent for the constructed node. Defaults to `null`
   */
  parent?: TNode;
  /**
   * Inner data to keep in the constructed node
   */
  data?: D;
  /**
   * Custom resolver during for this node during path construction
   *
   * @example
   *
   * ```typescript
   * import { tBuild } from 'static-tree';
   * const { node: api } = tBuild({
   *   key: 'api',
   *   pathResolver: () => 'https://api.domain.example',
   *   builder: (builder) => builder.addChild('healthcheck'),
   * });
   *
   * api.healthcheck.$.path(); // -\> 'https://api.domain.example/healthcheck'
   * ```
   *
   * @param node - {@link TNode}
   * @returns string
   */
  pathResolver?: (node: TNode) => string;
}

/**
 * @public
 *
 * Instruction on how to construct path to / from current node
 */
export interface TNodeGetPathParams {
  /**
   * Instruction on how to join path segments. Defaults to `/`
   *
   * @example
   *
   * ```typescript
   * / for a branch suc as: root -\> child -\> grandChild -\> node
   * node.$.path();                   // -\> 'root/child/grandChild/node'
   * node.$.path({ separator: '.' }); // -\> 'root.child.grandChild.node'
   * ```
   */
  separator?: string;
  /**
   * - If `depth` is not provided, path is absolute (from root to node)
   *
   * - If `depth` is a positive number, path is [node - depth, node]
   *
   * - If `depth` is a negative number, path is [root, node - |depth|]
   *
   * @example
   *
   * ```typescript
   * // for a branch such as: root -\> child -\> grandChild -\> node
   * node.$.path();               // -\> 'root/child/grandChild/node'
   * node.$.path({ depth: 2 });   // -\> 'grandChild/node'
   * node.$.path({ depth: -2 });  // -\> 'root/child'
   * ```
   */
  depth?: number;
  /**
   * Whether to reverse the constructed path. Defaults to `false`
   *
   * @example
   *
   * ```typescript
   * // for a branch such as: root -\> child -\> grandChild -\> node
   * node.$.path({ reversed: true }); // -\> 'node/grandChild/child/root'
   * ```
   */
  reversed?: boolean;
  /**
   * If provided, as path is built, it will stop and return at this {@link TNode}
   *
   * ```typescript
   * // for a branch such as: root -\> child -\> grandChild -\> node
   * node.$.path({ till: child }); // -\> 'child/grandChild/node'
   * node.$.path({ till: child, depth: 2 }); // -\> 'grandChild/node' (depth is exhausted before child is met)
   * node.$.path({ till: grandChild, depth: 3 }); // -\> 'grandChild/node' (grandChild is met before depth is exhausted)
   * ```
   */
  till?: TNode;
}

/**
 * @public
 *
 * Instruction on how to serialize the current node
 */
export interface TNodeSerializeOptions<V extends boolean, D extends TNodeData> {
  /**
   * Instruction on how to serialize internal data of {@link TNode}.
   *
   * - By default, data is pass as is.
   *
   * - If `false`, data becomes an empty object.
   *
   * - For custom serializer, pass a function that receives a {@link TNode} as its parameter.
   */
  dataSerializer?: false | ((node: TNode<D>) => any);
  /**
   * whether to include computed data for the serialized object. Defaults to `false`.
   * If `true`, serializer will construct {@link VerboseSerializedTNode}.
   * Otherwise, it'll be {@link MinimalSerializedTNode}.
   */
  verbose?: V;
}

/**
 * @public
 *
 * Interface of a minimally serialized node
 */
export interface MinimalSerializedTNode {
  /**
   * key of the current node for use in path construction and {@link ExtendedTNode}
   *
   * @Remarks
   *
   * It is recommended to use camelCase key with no space, as it will make more
   * sense during path construction and {@link ExtendedTNode} handling.
   *
   * For example, consider:
   *
   * ```typescript
   * const root = new TNode('root');
   * const node = new TNode('some key', { parent: root });
   * const child = new TNode('child', { parent: node });
   *
   * child.$.path(); // -\> `root/some key/child`
   * ```
   */
  key: string;
  /**
   * list of children
   */
  children: MinimalSerializedTNode[];
  /**
   * inner data of node, might be different depending on
   * how {@link TNodeSerializeOptions} is setup
   */
  data: any;
}

/**
 * @public
 *
 * Interface of a verbosely serialized node
 */
export interface VerboseSerializedTNode extends MinimalSerializedTNode {
  /**
   * list of children
   */
  children: VerboseSerializedTNode[];
  /**
   * path segments from root -\> current node
   */
  pathSegments: string[];
  /**
   * path segments joined with the default separator `/`
   */
  path: string;
  /**
   * computed depth of node
   */
  depth: number;
  /**
   * whether node is a root, i.e no parent
   */
  isRoot: boolean;
}

/**
 * @public
 *
 * Possible types of serialized node, depending on how {@link TNodeSerializeOptions} is setup
 */
export type SerializedTNode = VerboseSerializedTNode | MinimalSerializedTNode;

/**
 * @public
 *
 * Inner data of node. See {@link tBuild} for idiomatic examples on adding data to node.
 * See {@link TNode} for more information on how this data is stored.
 */
export type TNodeData = Record<string, any>;

/**
 * @public
 *
 * The proxy api intended for public use.
 * Refer to {@link TNode} for documentation of each method.
 */
export interface TNodePublicApi<D extends TNodeData> {
  key: TNode<D>['$key'];
  depth: TNode<D>['$depth'];
  path: TNode<D>['$path'];
  root: TNode<D>['$root'];
  isRoot: TNode<D>['$isRoot'];
  children: TNode<D>['$children'];
  parent: TNode<D>['$parent'];
  serialize: TNode<D>['$serialize'];
  data: TNode<D>['$data'];
}

/**
 * @public
 *
 * The proxy api intended for internal or advanced use
 * Refer to {@link TNode} for documentation of each method.
 */
export interface TNodeInternalApi<D extends TNodeData> {
  setParent: TNode<D>['__setParent'];
  addChildren: TNode<D>['__addChildren'];
  removeChildren: TNode<D>['__removeChildren'];
  setData: TNode<D>['__setData'];
}
