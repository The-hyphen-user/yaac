import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { loadConfig } from '../util/config.js';

export async function removeCommand(options) {
  try {
    const config = await loadConfig();
    let modified = false;

    if (options.all) {
      config.scan.layout = false;
      config.scan.functions = false;
      config.scan.watch = false;
      modified = true;
    } else {
      if (options.layout) {
        config.scan.layout = false;
        modified = true;
      }
      if (options.functions) {
        config.scan.functions = false;
        modified = true;
      }
      if (options.watch) {
        config.scan.watch = false;
        modified = true;
      }
    }

    if (modified) {
      await writeFile(
        join(process.cwd(), '.yaacrc.json'),
        JSON.stringify(config, null, 2),
        'utf-8'
      );
      console.log('Updated configuration');
    }
  } catch (error) {
    console.error('Error updating configuration:', error);
    process.exit(1);
  }
} 