# Contributing to [static-tree][github]

Thank you for stopping by. [static-tree][github] welcomes and appreciates your contribution.

## Table of Contents

- [Contributing to static-tree](#contributing-to-static-tree)
  - [Table of Contents](#table-of-contents)
  - [Reporting Issues](#reporting-issues)
    - [Bug Report](#bug-report)
    - [Feature Request](#feature-request)
  - [Pull Requests](#pull-requests)
  - [Consistent Code Style](#consistent-code-style)
  - [Development Setup](#development-setup)
    - [Recommended VSCode Extensions](#recommended-vscode-extensions)

## Reporting Issues

Before opening a new issue, [first search for existing issues][github.issues] to avoid duplications.

When you start working on an issue, make sure you are asked to be assigned to it.

### Bug Report

Please include as much details as possible:

- steps to reproduce,
- a github repo that has enough setup to reproduce the bug would be nice. It might be helpful to clone this create a branch to reproduce your problem there and reference in your issue,
- screenshots.

### Feature Request

If you have an idea and don't know where to start yet, consider [opening a discussion][github.discussions] first.

If you have a PR ready as your proposed implementation, you can [create an issue][github.issues] and a PR that references it.

## Pull Requests

Each pull request should [reference an open issue][github.issues.open] unless the change is very something simple such as a typo.

## Consistent Code Style

1. Commit message should follow the [Conventional Commits specification][conventionalcommits], if commit is intended for publication, make sure you include a new [changeset] in your commit.
2. Code should be formatted with [prettier] and linted with [eslint]. They are already integrated into the codebase. See [package.json] for relevant scripts. There might also exist extensions for your editor that further enhance the experience with these tools.
   - [VS Code Prettier][vscode.extension.prettier]
   - [VS Code Eslint][vscode.extension.eslint]
3. Code should be documented follow [tsdoc], this will allow [generating docs].

## Development

This project is a monorepo that uses [turborepo]. For project-wise commands, see [turbo.json] & [package.json] at root project for available pipelines and scripts.

### Prerequisites

| Dependency | Description | Version |
| --- | --- | --- |
| [node] | | refer to [package.json]
| [pnpm] | [npm] alternative | refer to [package.json] |

### Typical Workflow

Refer to `package.json` in each app/package for all available scripts.

- Install packages

    ```bash
    pnpm install
    ```

- Run tests and watch for changes

    ```bash
    pnpm test
    ```

- Lint & format:

    ```bash
    pnpm lint --fix
    pnpm format --write
    ```

- Build package

    ```bash
    pnpm build
    ```

- Generating api documentation (run only after build)

    ```bash
    pnpm api
    ```

- Add a [changeset], following the on-terminal wizard

    ```bash
    pnpm changeset
    ```

[package.json]: ./package.json
[turbo.json]: ./turbo.json
[changeset]: https://github.com/changesets/changesets
[github]: https://github.com/vnphanquang/static-tree
[github.issues]: https://github.com/vnphanquang/static-tree/issues?q=
[github.issues.open]: https://github.com/vnphanquang/static-tree/issues?q=is%3Aissue+is%3Aopen
[github.discussions]: https://github.com/vnphanquang/static-tree/discussions
[conventionalcommits]: https://www.conventionalcommits.org/en/v1.0.0/
[prettier]: https://prettier.io/
[eslint]: https://eslint.org/
[vscode.extension.prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[vscode.extension.eslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[pnpm]: https://pnpm.io/
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org/en/
[tsdoc]: https://tsdoc.org/
[turborepo]: https://turborepo.org/
