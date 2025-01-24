import { loadConfig, writeConfig } from '../util/config.js';


export async function setCommand(options) {
  try {
    const config = await loadConfig();

    // Update scan settings based on provided options
    if (options.layout || options.functions || options.watch || options.all) {
      config.scan = config.scan || {};

      if (options.all) {
        config.scan.layout = true;
        config.scan.functions = true;
        config.scan.watch = true;
      } else {
        if (options.layout) config.scan.layout = true;
        if (options.functions) config.scan.functions = true;
        if (options.watch) config.scan.watch = true;
      }
    }

    // Handle ignore patterns if provided
    if (options.ignore) {
      config.ignore = options.ignore;
    }

    await writeConfig(config);
    console.log('Configuration updated successfully');
  } catch (error) {
    console.error('Error setting config:', error);
  }
}
