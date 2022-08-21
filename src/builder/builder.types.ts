/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TNode, TNodeData } from '../node';

/**
 * @public
 *
 * {@link TNode} extended with children as properties
 */
export type ExtendedTNode<
  ChildrenRecord extends Record<string, ExtendedTNode> = {},
  Data extends TNodeData = {},
> = TNode<Data> & ChildrenRecord;
