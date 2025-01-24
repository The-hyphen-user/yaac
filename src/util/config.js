import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';

const DEFAULT_CONFIG = {
  ignore: [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/build/**',
    '**/.cursor*',
    '**/coverage/**',
  ],
  scan: {
    layout: true,
    functions: true,
    watch: false,
  },
};

/**
 * Creates a default .yaacrc.json file
 * @param {string} configPath - Path to config file
 * @returns {Promise<void>}
 */
async function createDefaultConfig(configPath) {
  try {
    await writeFile(
      configPath,
      JSON.stringify(DEFAULT_CONFIG, null, 2),
      'utf-8'
    );
    console.log('Created default .yaacrc.json file');
  } catch (error) {
    console.error('Error creating default config file:', error);
    throw error;
  }
}


/**
 * Loads configuration from .yaacrc.json
 * @param {string} [configPath] - Optional path to config file
 * @returns {Promise<object>} Configuration object
 */
export async function loadConfig(configPath = '.yaacrc.json') {
  try {
    const fullPath = join(process.cwd(), configPath);
    const configFile = await readFile(fullPath, 'utf-8');
    const userConfig = JSON.parse(configFile);

    // Merge with default config
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
      // Deep merge the ignore array
      ignore: [...new Set([...DEFAULT_CONFIG.ignore, ...(userConfig.ignore || [])])],
      // Deep merge the scan object
      scan: { ...DEFAULT_CONFIG.scan, ...(userConfig.scan || {}) },
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No .yaacrc.json found, creating default configuration');
      await createDefaultConfig(join(process.cwd(), configPath));
      return DEFAULT_CONFIG;
    }
    console.error('Error loading configuration:', error);
    throw error;
  }
}

export async function writeConfig(config) {
  const configPath = join(process.cwd(), '.yaacrc.json');
  await writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
}
