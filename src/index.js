#!/usr/bin/env node
import { Command } from 'commander';
import { scanCommand } from './commands/scan.js';
import { setCommand } from './commands/set.js';
import { removeCommand } from './commands/remove.js';

const program = new Command();

program
  .name('yaac')
  .description('Yet Another AI CLI - Generate project layout and function documentation for AI')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan project and generate .cursorlayout and .cursorfunctions files')
  .option('-l, --layout', 'Only scan for project layout')
  .option('-f, --functions', 'Only scan for functions')
  .option('-a, --all', 'do all types of scans')
  .option('-h, --help', 'show help')
  .option('-w, --watch', 'watch for changes and re-scan')
  .option('-p, --path', 'Path to the project')
  .action(scanCommand);



program
  .command('set')
  .description('Set default scanning behavior')
  .option('-l, --layout', 'Set to only scan layout')
  .option('-f, --functions', 'Set to only scan functions')
  .option('-a, --all', 'Set to scan everything')
  .option('-w, --watch', 'Set to watch for changes and re-scan')
  .action(setCommand);


program
  .command('remove')
  .description('Remove scanning behavior')
  .option('-l, --layout', 'Remove layout scanning')
  .option('-f, --functions', 'Remove function scanning')
  .option('-w, --watch', 'Remove watch mode')
  .option('-a, --all', 'Remove all scanning')
  .action(removeCommand);

program.parse(process.argv);