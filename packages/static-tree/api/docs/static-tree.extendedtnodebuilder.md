<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [static-tree](./static-tree.md) &gt; [ExtendedTNodeBuilder](./static-tree.extendedtnodebuilder.md)

## ExtendedTNodeBuilder class

Builder for [ExtendedTNode](./static-tree.extendedtnode.md)

<b>Signature:</b>

```typescript
export declare class ExtendedTNodeBuilder<Key extends string, ChildrenRecord extends Record<string, ExtendedTNode> = {}, Data extends TNodeData = {}> 
```

## Remarks

This is used internally by . Alternatively, this can be used if a more method-based, verbose solution is preferred.

## Example 1


```typescript
import { ExtendedTNodeBuilder } from 'static-tree';

const node = new ExtendedTNodeBuilder('key')
  .addData({ number: 1, boolean: true, string: 'string' })
  .addChild('childOne', {
     build: (builder) => builder
       .addData({ childData: 'something else' })
       .addChild('grandChild'),
  })
  .addChild('childTwo', { build: (builder) => builder.addChild('grandChild') })
  .build();
```

## Example 2

For advanced usage, `ExtendedTNodeBuilder` can also be used as the input in `addChild`<!-- -->, should it provide any benefit.

```typescript
import { tBuild, ExtendedTNodeBuilder } from 'static-tree';

const externalBuilder = new ExtendedTNodeBuilder('external')
 .addData({ some: 'some' })
 .addChild('someChild');

const { node } = tBuild('root', {
  build: (builder) => builder.addChild(externalBuilder),
});

node.external.someChild.$.path(); // -\> `root/external/someChild`
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(key, options)](./static-tree.extendedtnodebuilder._constructor_.md) |  | Constructs a new instance of the <code>ExtendedTNodeBuilder</code> class |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [addChild(builder)](./static-tree.extendedtnodebuilder.addchild.md) |  | add a type-safe child to the [ExtendedTNode](./static-tree.extendedtnode.md) to be built |
|  [addChild(key, config)](./static-tree.extendedtnodebuilder.addchild_1.md) |  |  |
|  [addData(data)](./static-tree.extendedtnodebuilder.adddata.md) |  | add type-safe data to the [ExtendedTNode](./static-tree.extendedtnode.md) to be built |
|  [build()](./static-tree.extendedtnodebuilder.build.md) |  | Build the [ExtendedTNode](./static-tree.extendedtnode.md) |

