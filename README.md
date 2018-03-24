polcli
================

A set of political data-mining tools wrapped in a handy CLI (pronounced pol-sly)

[![Version](https://img.shields.io/npm/v/polcli.svg)](https://npmjs.org/package/polcli)
[![CircleCI](https://circleci.com/gh/aldahick/polcli/tree/master.svg?style=shield&circle-token=a7335ddc887e40073a232f346ca80b90aa490063)](https://circleci.com/gh/aldahick/polcli/tree/master)

Goals of this project (perpetually unchecked, because we can always do better):
- [ ] Provide lower barrier to accessing raw data relating to elections (FEC in particular)
- [ ] Provide basic statistical aggregation of election data (specifically relating to party and financial data)

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
polcli/0.0.5 win32-x64 node-v8.9.4
$ polcli --help [COMMAND]
USAGE
  $ polcli COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
# Commands

* [polcli analyze:summary](#analyzesummary)
* [polcli download:fec FILENAME](#downloadfec-filename)
* [polcli help [COMMAND]](#help-command)
## analyze:summary

analyze US House and Senate elections

```
USAGE
  $ polcli analyze:summary

OPTIONS
  -H, --excludeHouse       exclude House data in analysis
  -P, --excludePresident   exclude Presidential data in analysis
  -S, --excludeSenate      exclude Senate data in analysis
  -f, --filename=filename  JSON file to read election data from
```

_See code: [src/commands/analyze/summary.ts](https://github.com/aldahick/polcli/blob/v0.0.5/src/commands/analyze/summary.ts)_

## download:fec FILENAME

download FEC campaign data for a given year and outputs it as JSON

```
USAGE
  $ polcli download:fec FILENAME

ARGUMENTS
  FILENAME  filename to write JSON to

OPTIONS
  -y, --year=year  [default: 2018] year(s) to download data for (comma-separated)
```

_See code: [src/commands/download/fec.ts](https://github.com/aldahick/polcli/blob/v0.0.5/src/commands/download/fec.ts)_

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
