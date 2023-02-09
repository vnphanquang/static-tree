/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TNode, TNodeData, TNodeInit } from '../node';

import { ExtendedTNodeBuilder } from './builder';

/**
 * @public
 *
 * {@link TNode} extended with children inline as properties, intended to provide
 * idiomatic dot notation parent-to-child node access, so that you can do:
 *
 * ```typescript
 * root.child.grandChild.$.path(); // -\> `root/child/grandChild`
 * ```
 *
 * instead of:
 *
 * ```typescript
 * root.$.children().find(c => c.key === 'child')?.$.children().find(c => c.key === 'grandChild')?.$.path();
 * ```
 *
 * @remarks
 *
 * {@link ExtendedTNode} is constructed behind the scene using {@link tBuild} (preferred)
 * and {@link ExtendedTNodeBuilder}.
 */
export type ExtendedTNode<
  Key extends string = never,
  AncestorKeys extends string = never,
  ChildrenRecord extends Record<string, ExtendedTNode> = {},
  Data extends TNodeData = {},
> = TNode<Data, Key, AncestorKeys> & ChildrenRecord;

/**
 * @public
 *
 * Instruction for building nested {@link ExtendedTNode}.
 *
 */
export interface ExtendedTNodeBuildConfig<
  Key extends string,
  AncestorKeys extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData = {},
> {
  pathResolver?: TNodeInit<Data>['pathResolver'];
  build?: ExtendedTNodeBuildCallback<Key, AncestorKeys, ChildrenRecord, Data>;
}

/**
 * @public
 *
 * Build callback for adding data & nested children
 */
export type ExtendedTNodeBuildCallback<
  Key extends string,
  AncestorKeys extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData = {},
> = (builder: ExtendedTNodeBuilder<Key, AncestorKeys>) => ExtendedTNodeBuilder<Key, AncestorKeys, ChildrenRecord, Data>;

/**
 * @public
 *
 * Output of {@link tBuild}
 */
export interface TBuildOutput<
  Key extends string,
  AncestorKeys extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData,
> {
  /**
   * built node with type safety for children and data
   */
  node: ExtendedTNode<Key, AncestorKeys, ChildrenRecord, Data>;
  /**
   * builder for advanced use cases. See {@link tBuild} for examples
   */
  builder: ExtendedTNodeBuilder<Key, AncestorKeys, ChildrenRecord, Data>;
}
