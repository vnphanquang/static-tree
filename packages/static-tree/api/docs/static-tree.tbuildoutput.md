<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [static-tree](./static-tree.md) &gt; [TBuildOutput](./static-tree.tbuildoutput.md)

## TBuildOutput interface

Output of 

<b>Signature:</b>

```typescript
export interface TBuildOutput<Key extends string, ChildrenRecord extends Record<string, ExtendedTNode>, Data extends TNodeData> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [builder](./static-tree.tbuildoutput.builder.md) |  | [ExtendedTNodeBuilder](./static-tree.extendedtnodebuilder.md)<!-- -->&lt;Key, ChildrenRecord, Data&gt; | builder for advanced use cases. See  for examples |
|  [node](./static-tree.tbuildoutput.node.md) |  | [ExtendedTNode](./static-tree.extendedtnode.md)<!-- -->&lt;ChildrenRecord, Data&gt; | built node with type safety for children and data |

