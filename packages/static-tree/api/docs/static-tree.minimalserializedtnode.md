<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [static-tree](./static-tree.md) &gt; [MinimalSerializedTNode](./static-tree.minimalserializedtnode.md)

## MinimalSerializedTNode interface

Interface of a minimally serialized node

<b>Signature:</b>

```typescript
export interface MinimalSerializedTNode 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [children](./static-tree.minimalserializedtnode.children.md) |  | [MinimalSerializedTNode](./static-tree.minimalserializedtnode.md)<!-- -->\[\] | list of children |
|  [data](./static-tree.minimalserializedtnode.data.md) |  | any | inner data of node, might be different depending on how [TNodeSerializeOptions](./static-tree.tnodeserializeoptions.md) is setup |
|  [key](./static-tree.minimalserializedtnode.key.md) |  | string | key of the current node for use in path construction and [ExtendedTNode](./static-tree.extendedtnode.md) |

