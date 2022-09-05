## API Report File for "static-tree"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export type ExtendedTNode<ChildrenRecord extends Record<string, ExtendedTNode> = {}, Data extends TNodeData = {}> = TNode<Data> & ChildrenRecord;

// @public
export type ExtendedTNodeBuildCallback<Key extends string, ChildrenRecord extends Record<string, ExtendedTNode>, Data extends TNodeData = {}> = (builder: ExtendedTNodeBuilder<Key>) => ExtendedTNodeBuilder<Key, ChildrenRecord, Data>;

// @public
export class ExtendedTNodeBuilder<Key extends string, ChildrenRecord extends Record<string, ExtendedTNode> = {}, Data extends TNodeData = {}> {
    constructor(key: Key, options?: Omit<TNodeInit<Data>, 'data'>);
    addChild<ChildKey extends string, GrandChildrenRecord extends Record<string, ExtendedTNode>, ChildData extends TNodeData = {}>(input: ExtendedTNodeBuildInput<ChildKey, GrandChildrenRecord, ChildData>): ExtendedTNodeBuilder<Key, ChildrenRecord & Record<ChildKey, ExtendedTNode<GrandChildrenRecord, ChildData>>, Data>;
    addData<D extends TNodeData>(data: D): ExtendedTNodeBuilder<Key, ChildrenRecord, D>;
    build(): ExtendedTNode<ChildrenRecord, Data>;
}

// @public
export type ExtendedTNodeBuildInput<Key extends string, ChildrenRecord extends Record<string, ExtendedTNode>, Data extends TNodeData = {}> = Key | ExtendedTNodeBuilder<Key, ChildrenRecord, Data> | {
    key: Key;
    pathResolver?: TNodeInit<Data>['pathResolver'];
    build?: ExtendedTNodeBuildCallback<Key, ChildrenRecord, Data>;
};

// @public
export interface MinimalSerializedTNode {
    children: MinimalSerializedTNode[];
    data: any;
    key: string;
}

// @public
export type SerializedTNode = VerboseSerializedTNode | MinimalSerializedTNode;

// @public
export function tBuild<Key extends string, ChildrenRecord extends Record<string, ExtendedTNode>, Data extends TNodeData>(input: ExtendedTNodeBuildInput<Key, ChildrenRecord, Data>): TBuildOutput<Key, ChildrenRecord, Data>;

// @public
export interface TBuildOutput<Key extends string, ChildrenRecord extends Record<string, ExtendedTNode>, Data extends TNodeData> {
    builder: ExtendedTNodeBuilder<Key, ChildrenRecord, Data>;
    node: ExtendedTNode<ChildrenRecord, Data>;
}

// @public
export class TNode<Data extends TNodeData = {}> {
    // (undocumented)
    get $(): TNodePublicApi<Data>;
    // (undocumented)
    protected $children(): TNode[];
    // (undocumented)
    protected $data(): Data;
    // (undocumented)
    protected $depth(): number;
    // (undocumented)
    protected $isRoot(): boolean;
    // (undocumented)
    protected $key(): string;
    // (undocumented)
    protected $parent(): TNode | null;
    protected $path(params?: TNodeGetPathParams): string;
    // (undocumented)
    protected $root(): TNode;
    // (undocumented)
    protected $serialize<M extends boolean>(options?: TNodeSerializeOptions<M, Data>): M extends true ? VerboseSerializedTNode : MinimalSerializedTNode;
    // (undocumented)
    get __(): TNodeInternalApi<Data>;
    protected __addChildren(...nodes: TNode[]): TNode<Data>;
    constructor(key: string, options?: TNodeInit<Data>);
    protected __removeChildren(...nodes: TNode[]): TNode<Data>;
    protected __setData<NewData extends TNodeData>(data: NewData): TNode<NewData>;
    protected __setParent(parent?: TNode): TNode<Data>;
    static from(serialized: SerializedTNode, parent?: TNode): TNode<any>;
}

// @public
export type TNodeData = Record<string, any>;

// @public
export interface TNodeGetPathParams {
    depth?: number;
    reversed?: boolean;
    separator?: string;
    till?: TNode;
}

// @public
export interface TNodeInit<D extends Record<string, any> = {}> {
    data?: D;
    parent?: TNode;
    pathResolver?: (node: TNode) => string;
}

// @public
export interface TNodeInternalApi<D extends TNodeData> {
    // (undocumented)
    addChildren: TNode<D>['__addChildren'];
    // (undocumented)
    removeChildren: TNode<D>['__removeChildren'];
    // (undocumented)
    setData: TNode<D>['__setData'];
    // (undocumented)
    setParent: TNode<D>['__setParent'];
}

// @public
export interface TNodePublicApi<D extends TNodeData> {
    // (undocumented)
    children: TNode<D>['$children'];
    // (undocumented)
    data: TNode<D>['$data'];
    // (undocumented)
    depth: TNode<D>['$depth'];
    // (undocumented)
    isRoot: TNode<D>['$isRoot'];
    // (undocumented)
    key: TNode<D>['$key'];
    // (undocumented)
    parent: TNode<D>['$parent'];
    // (undocumented)
    path: TNode<D>['$path'];
    // (undocumented)
    root: TNode<D>['$root'];
    // (undocumented)
    serialize: TNode<D>['$serialize'];
}

// @public
export interface TNodeSerializeOptions<V extends boolean, D extends TNodeData> {
    dataSerializer?: false | ((node: TNode<D>) => any);
    verbose?: V;
}

// @public
export interface VerboseSerializedTNode extends MinimalSerializedTNode {
    children: VerboseSerializedTNode[];
    depth: number;
    isRoot: boolean;
    path: string;
    pathSegments: string[];
}

```