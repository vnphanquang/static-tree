<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [static-tree](./static-tree.md) &gt; [TNode](./static-tree.tnode.md) &gt; [$serialize](./static-tree.tnode._serialize.md)

## TNode.$serialize() method

<b>Signature:</b>

```typescript
protected $serialize<M extends boolean>(options?: TNodeSerializeOptions<M, Data>): M extends true ? VerboseSerializedTNode : MinimalSerializedTNode;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  options | [TNodeSerializeOptions](./static-tree.tnodeserializeoptions.md)<!-- -->&lt;M, Data&gt; | <i>(Optional)</i> a [TNodeSerializeOptions](./static-tree.tnodeserializeoptions.md) object |

<b>Returns:</b>

M extends true ? [VerboseSerializedTNode](./static-tree.verboseserializedtnode.md) : [MinimalSerializedTNode](./static-tree.minimalserializedtnode.md)

a serializable [SerializedTNode](./static-tree.serializedtnode.md) object

