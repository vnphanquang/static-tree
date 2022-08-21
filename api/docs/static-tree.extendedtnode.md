<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [static-tree](./static-tree.md) &gt; [ExtendedTNode](./static-tree.extendedtnode.md)

## ExtendedTNode type

[TNode](./static-tree.tnode.md) extended with children as properties

<b>Signature:</b>

```typescript
export declare type ExtendedTNode<ChildrenRecord extends Record<string, ExtendedTNode> = {}, Data extends TNodeData = {}> = TNode<Data> & ChildrenRecord;
```
<b>References:</b> [ExtendedTNode](./static-tree.extendedtnode.md)<!-- -->, [TNodeData](./static-tree.tnodedata.md)<!-- -->, [TNode](./static-tree.tnode.md)
