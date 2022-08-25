import type { SerializedTNode } from 'static-tree';
import {
  createPrinter,
  createSourceFile,
  factory,
  ListFormat,
  NewLineKind,
  NodeFlags,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
} from 'typescript';

const PACKAGE = 'static-tree';
const BUILDER_HELPER = 'tBuild';

/**
 * @public
 * Generate the import statement for `static-tree.tBuild`
 * @returns `ts.ImportDeclaration`
 */
export function generateImportStatement() {
  return factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(false, undefined, factory.createIdentifier(BUILDER_HELPER)),
      ]),
    ),
    factory.createStringLiteral(PACKAGE),
    undefined,
  );
}

/**
 * @public
 * Generate the build input as in `static-tree.ExtendedTNodeBuildInput`
 * @param serializedNode - `static-tree.SerializedTNode`
 * @returns `ts.StringLiteral` if a leaf node, otherwise `ts.ObjectLiteralExpression`
 */
export function generateBuildInput(serializedNode: SerializedTNode) {
  const { children, key } = serializedNode;

  if (children.length === 0) {
    return factory.createStringLiteral(key);
  } else {
    const keyPropAssignment = factory.createPropertyAssignment(
      factory.createIdentifier('key'),
      factory.createStringLiteral(key),
    );
    const [firstChild, ...otherChildren] = children;
    let builderCallExpression = factory.createCallExpression(
      factory.createPropertyAccessExpression(
        factory.createIdentifier('builder'),
        factory.createIdentifier('addChild'),
      ),
      undefined,
      [generateBuildInput(firstChild)],
    );
    for (const child of otherChildren) {
      builderCallExpression = factory.createCallExpression(
        factory.createPropertyAccessExpression(
          builderCallExpression,
          factory.createIdentifier('addChild'),
        ),
        undefined,
        [generateBuildInput(child)],
      );
    }

    const buildPropAssignment = factory.createPropertyAssignment(
      factory.createIdentifier('build'),
      factory.createArrowFunction(
        undefined,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('builder'),
            undefined,
            undefined,
            undefined,
          ),
        ],
        undefined,
        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
        builderCallExpression,
      ),
    );

    return factory.createObjectLiteralExpression([keyPropAssignment, buildPropAssignment], true);
  }
}

/**
 * @public
 * Generate the `static-tree.tBuild` call expression
 *
 * @param serializedNode - `static-tree.SerializedTNode`
 * @returns ts.CallExpression
 */
export function generateTBuild(serializedNode: SerializedTNode) {
  const buildInput = generateBuildInput(serializedNode);
  return factory.createCallExpression(factory.createIdentifier(BUILDER_HELPER), undefined, [
    buildInput,
  ]);
}

/**
 * @public
 * Generate typescript source for `static-tree` from a serialized node
 *
 * @remarks
 *
 * Currently `data` and `pathResolver` codegen are not supported yet.
 *
 * @example
 *
 * ```typescript
 * // (1)
 * import { tBuild } from 'static-tree';
 * const { node } = tBuild({
 *   key: 'api',
 *   build: (builder) => builder
 *     .addChild('healthcheck')
 *     .addChild({
 *       key: 'auth',
 *       build: (builder) => builder
 *         .addChild('logout')
 *         .addChild('login')
 *         .addChild({
 *           key: 'oauth',
 *           build: (builder) => builder.addChild('google').addChild('github');
 *         }),
 *     }),
 * });
 *
 * // (2)
 * import { generate } from 'static-tree-codegen';
 * const serialized = node.$.serialized();
 * const ts = generate(serialized);
 * // -/> should print out the same typescript code as in (1)
 *
 * ```
 *
 * @param serializedNode - `static-tree.SerializedTNode`
 * @returns typescript source code as a string
 */
export function generate(serializedNode: SerializedTNode) {
  const sourceFile = createSourceFile('', '', ScriptTarget.Latest, false, ScriptKind.TS);
  const printer = createPrinter({
    newLine: NewLineKind.LineFeed,
  });

  const nodeAssignment = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createObjectBindingPattern([
            factory.createBindingElement(
              undefined,
              undefined,
              factory.createIdentifier('node'),
              undefined,
            ),
          ]),
          undefined,
          undefined,
          generateTBuild(serializedNode),
        ),
      ],
      NodeFlags.Const,
    ),
  );

  console.log(nodeAssignment.getFullText());

  const printed = printer.printList(
    ListFormat.MultiLine,
    factory.createNodeArray([generateImportStatement(), nodeAssignment]),
    sourceFile,
  );

  return printed;
}
