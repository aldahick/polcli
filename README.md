polcli
================

A set of political data-mining tools wrapped in a handy CLI (pronounced pol-sly)

[![Version](https://img.shields.io/npm/v/polcli.svg)](https://npmjs.org/package/polcli)
[![CircleCI](https://circleci.com/gh/aldahick/polcli/tree/master.svg?style=shield)](https://circleci.com/gh/aldahick/polcli/tree/master)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
<!-- usage -->
# Usage

```sh-session
$ npm install -g polcli
$ polcli COMMAND
running command...
$ polcli (-v|--version|version)
polcli/0.0.3 win32-x64 node-v8.9.4
$ polcli --help [COMMAND]
USAGE
  $ polcli COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [polcli download:fec FILENAME](#downloadfec-filename)
* [polcli help [COMMAND]](#help-command)
## download:fec FILENAME

download FEC campaign data for a given year and outputs it as JSON

```
USAGE
  $ polcli download:fec FILENAME

ARGUMENTS
  FILENAME  filename to write JSON to

OPTIONS
  -y, --year=year  [default: 2018] year to download data for
```

_See code: [src/commands/download/fec.ts](https://github.com/aldahick/polcli/blob/v0.0.3/src/commands/download/fec.ts)_

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
