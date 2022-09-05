<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [static-tree](./static-tree.md) &gt; [TNodeSerializeOptions](./static-tree.tnodeserializeoptions.md)

## TNodeSerializeOptions interface

Instruction on how to serialize the current node

<b>Signature:</b>

```typescript
export interface TNodeSerializeOptions<V extends boolean, D extends TNodeData> 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [dataSerializer?](./static-tree.tnodeserializeoptions.dataserializer.md) |  | false \| ((node: [TNode](./static-tree.tnode.md)<!-- -->&lt;D&gt;) =&gt; any) | <p><i>(Optional)</i> Instruction on how to serialize internal data of [TNode](./static-tree.tnode.md)<!-- -->.</p><p>- By default, data is pass as is.</p><p>- If <code>false</code>, data becomes an empty object.</p><p>- For custom serializer, pass a function that receives a [TNode](./static-tree.tnode.md) as its parameter.</p> |
|  [verbose?](./static-tree.tnodeserializeoptions.verbose.md) |  | V | <i>(Optional)</i> whether to include computed data for the serialized object. Defaults to <code>false</code>. If <code>true</code>, serializer will construct [VerboseSerializedTNode](./static-tree.verboseserializedtnode.md)<!-- -->. Otherwise, it'll be [MinimalSerializedTNode](./static-tree.minimalserializedtnode.md)<!-- -->. |
