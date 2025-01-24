import { glob } from 'glob';
import { relative, sep } from 'path';
import { writeFile } from 'fs/promises';

/**
 * Generates a tree structure of the project
 * @param {string} rootDir - The root directory to scan
 * @param {object} options - Scan options including ignore patterns
 * @returns {Promise<string>} The layout as a string
 */
export async function generateLayout(rootDir = process.cwd(), options = {}) {
  const files = await glob('**/*', {
    ignore: options.ignore || [],
    dot: true,
    cwd: rootDir,
    nodir: false,
  });

  // Sort files to ensure consistent output
  files.sort();

  // Convert flat file list to tree structure
  let treeOutput = '';
  let prevParts = [];

  for (const file of files) {
    const parts = file.split(sep);
    let indent = '';

    // Compare with previous path to determine indent level
    for (let i = 0; i < parts.length; i++) {
      if (i >= prevParts.length || parts[i] !== prevParts[i]) {
        indent = '  '.repeat(i);
        treeOutput += `${indent}${i === parts.length - 1 ? '├── ' : '│   '}${parts[i]}\n`;
      }
    }

    prevParts = parts;
  }

  return treeOutput;
}

/**
 * Writes the layout to .cursorlayout file
 * @param {string} layout - The layout string to write
 * @returns {Promise<void>}
 */
export async function writeLayout(layout) {
  try {
    await writeFile('.cursorlayout', layout);
    console.log('Successfully wrote .cursorlayout');
  } catch (error) {
    console.error('Error writing .cursorlayout:', error);
    throw error;
  }
}
