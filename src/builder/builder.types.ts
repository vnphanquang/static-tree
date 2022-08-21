/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TNode, TNodeData } from '../node';

import { ExtendedTNodeBuilder } from './builder';

/**
 * @public
 *
 * {@link TNode} extended with children as properties
 */
export type ExtendedTNode<
  ChildrenRecord extends Record<string, ExtendedTNode> = {},
  Data extends TNodeData = {},
> = TNode<Data> & ChildrenRecord;

/**
 * @public
 *
 * Instruction for building nested {@link ExtendedTNode}.
 *
 * Can be one of the following:
 *
 * - a string as the key of the node to be built
 *
 * - an {@link ExtendedTNodeBuilder} object
 *
 * - an object with `key` & an optional {@link ExtendedTNodeBuildCallback}
 *
 */
export type ExtendedTNodeBuildInput<
  Key extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData = {},
> =
  | Key
  | ExtendedTNodeBuilder<Key, ChildrenRecord, Data>
  | {
      /**
       * key for {@link ExtendedTNode} to be built
       */
      key: Key;
      build?: ExtendedTNodeBuildCallback<Key, ChildrenRecord, Data>;
    };

/**
 * @public
 *
 * Build callback for adding data & nested children
 */
export type ExtendedTNodeBuildCallback<
  Key extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData = {},
> = (builder: ExtendedTNodeBuilder<Key>) => ExtendedTNodeBuilder<Key, ChildrenRecord, Data>;

/**
 * @public
 *
 * Output of {@link tBuild}
 */
export interface TBuildOutput<
  Key extends string,
  ChildrenRecord extends Record<string, ExtendedTNode>,
  Data extends TNodeData,
> {
  /**
   * built node with type safety for children and data
   */
  node: ExtendedTNode<ChildrenRecord, Data>;
  /**
   * builder for advanced use cases. See {@link tBuild} for examples
   */
  builder: ExtendedTNodeBuilder<Key, ChildrenRecord, Data>;
}
