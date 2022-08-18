/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TNode } from './node';

export interface TNodeInit<D extends Record<string, any> = {}> {
  parent?: TNode;
  data?: D;
}

export interface TNodeGetPathParams {
  separator?: string;
  depth?: number;
}

type DeepRecord<T> = {
  [key: string]: T | DeepRecord<T>;
};

export type Serializable = DeepRecord<
  string | number | boolean | boolean | Array<Serializable> | ReadonlyArray<Serializable>
>;

export interface TNodeSerializeOptions<V extends boolean> {
  dataSerializer?: false | (<D extends Record<string, any> = {}>(node: TNode<D>) => Serializable);
  verbose?: V;
}

export interface MinimalSerializedTNode {
  key: string;
  children: MinimalSerializedTNode[];
  data: Serializable;
}

export interface VerboseSerializedTNode extends MinimalSerializedTNode {
  children: VerboseSerializedTNode[];
  pathSegments: string[];
  depth: number;
  isRoot: boolean;
  path: string;
}

export type SerializedTNode = VerboseSerializedTNode | MinimalSerializedTNode;

export type TNodeData = Record<string, any>;
