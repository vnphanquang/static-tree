<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [static-tree](./static-tree.md)

## static-tree package

Type-safe static tree builder

## Classes

|  Class | Description |
|  --- | --- |
|  [ExtendedTNodeBuilder](./static-tree.extendedtnodebuilder.md) | Builder for [ExtendedTNode](./static-tree.extendedtnode.md) |
|  [TNode](./static-tree.tnode.md) | Implementation for each node of the static tree |

## Functions

|  Function | Description |
|  --- | --- |
|  [tBuild(input)](./static-tree.tbuild.md) | Build helper that uses [ExtendedTNodeBuilder](./static-tree.extendedtnodebuilder.md) internally. |

## Interfaces

|  Interface | Description |
|  --- | --- |
|  [MinimalSerializedTNode](./static-tree.minimalserializedtnode.md) | Interface of a minimally serialized node |
|  [TBuildOutput](./static-tree.tbuildoutput.md) | Output of [tBuild()](./static-tree.tbuild.md) |
|  [TNodeGetPathParams](./static-tree.tnodegetpathparams.md) | Instruction on how to construct path to / from current node |
|  [TNodeInit](./static-tree.tnodeinit.md) | Additional instruction during [TNode](./static-tree.tnode.md) construction |
|  [TNodeInternalApi](./static-tree.tnodeinternalapi.md) | The proxy api intended for internal or advanced use Refer to [TNode](./static-tree.tnode.md) for documentation of each method. |
|  [TNodePublicApi](./static-tree.tnodepublicapi.md) | The proxy api intended for public use. Refer to [TNode](./static-tree.tnode.md) for documentation of each method. |
|  [TNodeSerializeOptions](./static-tree.tnodeserializeoptions.md) | Instruction on how to serialize the current node |
|  [VerboseSerializedTNode](./static-tree.verboseserializedtnode.md) | Interface of a verbosely serialized node |

## Type Aliases

|  Type Alias | Description |
|  --- | --- |
|  [ExtendedTNode](./static-tree.extendedtnode.md) | <p>[TNode](./static-tree.tnode.md) extended with children inline as properties, intended to provide idiomatic dot notation parent-to-child node access, so that you can do:</p>
```typescript
root.child.grandChild.$.path(); // -\> `root/child/grandChild`
```
<p>instead of:</p>
```typescript
root.$.children().find(c => c.key === 'child')?.$.children().find(c => c.key === 'grandChild')?.$.path();
```
 |
|  [ExtendedTNodeBuildCallback](./static-tree.extendedtnodebuildcallback.md) | Build callback for adding data &amp; nested children |
|  [ExtendedTNodeBuildInput](./static-tree.extendedtnodebuildinput.md) | <p>Instruction for building nested [ExtendedTNode](./static-tree.extendedtnode.md)<!-- -->.</p><p>Can be one of the following:</p><p>- a string as the key of the node to be built</p><p>- an [ExtendedTNodeBuilder](./static-tree.extendedtnodebuilder.md) object</p><p>- an object with <code>key</code> &amp; an optional [ExtendedTNodeBuildCallback](./static-tree.extendedtnodebuildcallback.md)</p> |
|  [SerializedTNode](./static-tree.serializedtnode.md) | Possible types of serialized node, depending on how [TNodeSerializeOptions](./static-tree.tnodeserializeoptions.md) is setup |
|  [TNodeData](./static-tree.tnodedata.md) | Inner data of node. See [tBuild()](./static-tree.tbuild.md) for idiomatic examples on adding data to node. See [TNode](./static-tree.tnode.md) for more information on how this data is stored. |
