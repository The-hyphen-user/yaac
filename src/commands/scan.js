import { join } from 'path';
import chokidar from 'chokidar';
import { loadConfig } from '../util/config.js';
import { generateLayout, writeLayout } from '../core/layout.js';
import { generateFunctionDocs, writeFunctionDocs } from '../core/function.js';

// Debounce helper to prevent too frequent updates in watch mode
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export async function scanCommand(options) {
  try {
    const config = await loadConfig();
    const rootDir = options.path || process.cwd();

    // Determine what to scan based on options and config
    const shouldScanLayout = options.layout || options.all || (!options.functions && config.scan.layout);
    const shouldScanFunctions = options.functions || options.all || (!options.layout && config.scan.functions);
    const shouldWatch = options.watch || config.scan.watch;

    // Function to perform the scan
    async function performScan() {
      if (shouldScanLayout) {
        const layout = await generateLayout(rootDir, { ignore: config.ignore });
        await writeLayout(layout);
      }

      if (shouldScanFunctions) {
        const functions = await generateFunctionDocs(rootDir, { ignore: config.ignore });
        await writeFunctionDocs(functions);
      }
    }

    // Perform initial scan
    await performScan();

    // Set up watch mode if enabled
    if (shouldWatch) {
      const debouncedScan = debounce(performScan, 500);

      const watcher = chokidar.watch(rootDir, {
        ignored: [
          ...config.ignore,
          '**/node_modules/**',
          '**/.git/**',
          '**/.cursor*',  // This will catch both .cursorlayout and .cursorfunctions
          '**/dist/**',
          '**/build/**'
        ],
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100
        },
        ignorePermissionErrors: true
      });

      const cursorFiles = ['.cursorlayout', '.cursorfunctions'];

      // Helper to check if a path is a cursor file
      const isCursorFile = (path) => cursorFiles.some(file => path.endsWith(file));

      // Add debug logging to help identify what's triggering the scans
      watcher
        .on('add', path => {
          if (!isCursorFile(path)) {
            console.log('File added:', path);
            debouncedScan();
          }
        })
        .on('change', path => {
          if (!isCursorFile(path)) {
            console.log('File changed:', path);
            debouncedScan();
          }
        })
        .on('unlink', path => {
          if (!isCursorFile(path)) {
            console.log('File removed:', path);
            debouncedScan();
          }
        })
        .on('addDir', path => {
          console.log('Directory added:', path);
          debouncedScan();
        })
        .on('unlinkDir', path => {
          console.log('Directory removed:', path);
          debouncedScan();
        });

      console.log('Watching for changes...');

      // Handle process termination
      process.on('SIGINT', () => {
        watcher.close();
        process.exit(0);
      });
    }
  } catch (error) {
    console.error('Error during scan:', error);
    process.exit(1);
  }
}
