import { existsSync, lstatSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

/**
 * Gecko Node default customized loader: it loads code from compiled TS files 
 * in ECMAscript modules with or without extension
 * CAUTION: this loader was built under the design of experimental node loaders API
 * https://nodejs.org/docs/latest-v20.x/api/all.html#all_esm_loaders
 * https://stackoverflow.com/questions/71463698/why-we-need-nodenext-typescript-compiler-option-when-we-have-esnext
 * 
 * This loader includes:
 * - bypass of url filepath modules
 * - bypass of node modules
 * - support for autocompletion of .js, .mjs or .cjs file extensions
 * - suppport for folder modules with index.js (also .mjs or cjs)
 * - file existence validation for .js, .mjs and .cjs filetypes
 */

const validExtensions = [
  '.js',
  '.cjs',
  '.mjs',
];


/**
 * look for a valid module path in the valid list of extensions or folders 
 * @param {string} path 
 * @returns {string|undefined}
 */
const getModulePath = (path) => {
  // check if path is a file directly or by attaching extensions
  for(const ext of validExtensions){
    if(path.endsWith(ext) && existsSync(path)) return path // direct path
    if(existsSync(path+ext)) return path+ext; // attaching extension
  }
  // check if folder exists and look for module index file
  if(existsSync(path) && lstatSync(path).isDirectory()){
    for(const ext of validExtensions){
      if(existsSync(path+'/index'+ext)) return path+'/index'+ext;
    }
  }
  // no valid path found
  return undefined;
}

/** @type {string} */
let parentDir = null;

/**
 * main ESM resolver function 
 * @param {string} specifier | url string specifier
 * @param {Object} context 
 * @param {string|undefined} nextResolve | The subsequent resolve hook in the chain, or the Node.js default resolve hook after the last user-supplied resolve hook
 */
export async function resolve(specifier, context, nextResolve){
  try{
    // if Node.js entrypoint pass resolver to node and get entrypoint URL
    if(!context.parentURL && !parentDir){ // entrypoint validation

      // specifier is always a URL when Node is accessing the entrypoint
      // in that case specifier holds the entrypoint URL, which is used 
      // in the rest of the resolution, in order to validate file existence
      const entrypoint = fileURLToPath(specifier);
      parentDir = path.dirname(entrypoint);
      return nextResolve(specifier, context);
    }

    // if relative path is found in specifier triggers algorithm
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      const moduleDir = context.parentURL? 
        path.dirname(fileURLToPath(context.parentURL)) :
        parentDir;
      const modulePath = path.join(moduleDir, specifier);
      const validPath = getModulePath(modulePath);
      if(validPath){
        // module source resolved in validPath
        return {
          // format: 'module',
          shortCircuit: true,
          url: pathToFileURL(validPath).href,
        };
        // return nextResolve(specifier, context);  
      }
    }
    
    // pass to Node.js resolver for no relative paths
    return nextResolve(specifier, context);
  }catch(err){
    // pass to Node.js resolver in algorithm error
    return nextResolve(specifier, context);
  }
}

// export async function load(specifier, context, nextLoad) {
//   // Let Node.js handle all other URLs.
//   return nextLoad(specifier, context);
// }
