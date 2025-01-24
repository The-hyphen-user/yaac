# YAAC (Yet Another AI CLI)

A command-line tool that generates layout and function documentation to assist when coding with AI. YAAC creates standardized documentation files that can be used to provide context to AI tools. With its watch mode, YAAC can continuously monitor your project for changes, automatically updating documentation in real-time to keep your AI context up-to-date.

## Installation

npm install -g yaac  
or  
yarn global add yaac  
or  
pnpm add -g yaac

## Quick Start

- `yaac scan` - scans your project with default settings
- `yaac set` - adds settings to your config settings using flags
- `yaac remove` - removes settings from your config settings using flags

### Config Settings

- `-l` or `--layout` - layout settings
- `-f` or `--functions` - function settings
- `-w` or `--watch` - watch settings

by default yaac will scan for layout and functions with watch mode disabled.  
if you want to scan with watch mode either use  
 `yaac scan -w`  
 or  
 `yaac set -w` then `yaac scan`

## YAAC generates two main files:

### `.cursorlayout`

Contains a tree structure of your project:

```
├── .yaacrc.json
├── README.md
├── package.json
├── pnpm-lock.yaml
├── src
  ├── commands
    ├── remove.js
    ├── scan.js
    ├── set.js
  ├── core
    ├── function.js
    ├── layout.js
  ├── index.js
  ├── util
    ├── config.js
```

### `.cursorfunctions`

Contains information about all functions in your project:

```
name: scanCommand
file: src/commands/scan.js
type: function
params: options

name: setCommand
file: src/commands/set.js
type: function
params: options
```

### Notes from the author:

- Scanning for functions is primarily targeted towards javascript and typescript functions
- This is an ongoing project that will gain more functionality in the future
- It's difficult to test if ai is functioning better so your testing and feedback is much appreaciated
- please direct all feedback and feature requests to the [github repo](https://github.com/the-hyphen-user/yaac)
