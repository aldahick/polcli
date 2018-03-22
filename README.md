@aldahick/polcli
================

A set of political data-mining tools wrapped in a handy CLI (pronounced pol-sly)

[![Version](https://img.shields.io/npm/v/@aldahick/polcli.svg)](https://npmjs.org/package/@aldahick/polcli)
[![CircleCI](https://circleci.com/gh/aldahick/polcli/tree/master.svg?style=shield)](https://circleci.com/gh/aldahick/polcli/tree/master)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
<!-- usage -->
# Usage

```sh-session
$ npm install -g @aldahick/polcli
$ polcli COMMAND
running command...
$ polcli (-v|--version|version)
@aldahick/polcli/0.0.1 win32-x64 node-v8.9.4
$ polcli --help [COMMAND]
USAGE
  $ polcli COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [polcli hello [FILE]](#hello-file)
* [polcli help [COMMAND]](#help-command)
## hello [FILE]

describe the command here

```
USAGE
  $ polcli hello [FILE]

OPTIONS
  -f, --force
  -n, --name=name  name to print

EXAMPLE
  $ polcli hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/aldahick/polcli/blob/v0.0.1/src/commands/hello.ts)_

## help [COMMAND]

display help for polcli

```
USAGE
  $ polcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.1.6/src/commands/help.ts)_
<!-- commandsstop -->
