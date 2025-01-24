import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

/**
 * Extracts function information from a file
 * @param {string} filePath - Path to the file
 * @param {string} content - File content
 * @returns {Array<Object>} Array of function information
 */
async function extractFunctions(filePath, content) {
  const functions = [];

  try {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
    });

    traverse.default(ast, {
      FunctionDeclaration(path) {
        functions.push({
          type: 'function',
          name: path.node.id.name,
          params: path.node.params.map(p => p.name),
          file: filePath
        });
      },
      ArrowFunctionExpression(path) {
        if (path.parent.type === 'VariableDeclarator') {
          functions.push({
            type: 'arrow',
            name: path.parent.id.name,
            params: path.node.params.map(p => p.name),
            file: filePath
          });
        }
      },
      ClassMethod(path) {
        functions.push({
          type: 'method',
          name: path.node.key.name,
          params: path.node.params.map(p => p.name),
          file: filePath
        });
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not parse ${filePath}: ${error.message}`);
  }

  return functions;
}

/**
 * Generates documentation for all functions in the project
 * @param {string} rootDir - The root directory to scan
 * @param {object} options - Scan options including ignore patterns
 * @returns {Promise<Array>} Array of documented functions
 */
export async function generateFunctionDocs(rootDir, options = {}) {
  const files = await glob('**/*.{js,jsx,ts,tsx}', {
    ignore: options.ignore || [],
    cwd: rootDir,
    absolute: true,
  });

  const allFunctions = [];

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const functions = await extractFunctions(file, content);
      allFunctions.push(...functions);
    } catch (error) {
      console.warn(`Warning: Could not read ${file}: ${error.message}`);
    }
  }

  return allFunctions;
}

/**
 * Writes function documentation to .cursorfunctions file
 * @param {Array} functions - Array of function information
 * @returns {Promise<void>}
 */
export async function writeFunctionDocs(functions) {
  const formattedOutput = functions.map(fn => {
    return `name: ${fn.name}
file: ${fn.file}
type: ${fn.type}
params: ${fn.params.join(', ') || '[]'}
`
  }).join('\n');

  try {
    await writeFile('.cursorfunctions', formattedOutput);
    console.log('Successfully wrote .cursorfunctions');
  } catch (error) {
    console.error('Error writing .cursorfunctions:', error);
    throw error;
  }
}
