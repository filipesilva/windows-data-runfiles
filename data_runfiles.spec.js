const fs = require('fs');
const path = require('path');

describe('data resolution via runfiles', () => {
  it('should be able to resolve paths relative to data files', () => {
    // Resolve the data file path.
    const relativeDataPath = './data.json';
    console.log('relative data path is:', relativeDataPath);
    const resolvedDataPath = require.resolve(relativeDataPath);
    console.log('resolved data path is:', resolvedDataPath);
    
    // Read data file.
    const dataContent = fs.readFileSync(resolvedDataPath, 'utf-8');
    console.log('data content is:', dataContent);
    
    // Construct the module path from the data.
    const dataJson = JSON.parse(dataContent);
    const relativeModulePath = dataJson.relativeModulePath;
    console.log('relative module path is:', relativeModulePath);
    const joinedModulePath = path.join(path.dirname(resolvedDataPath), relativeModulePath);
    console.log('joined module path is:', joinedModulePath);

    // Try to resolve the joined module path.
    // This fails on windows.
    const resolvedModulePath = require.resolve(joinedModulePath);
    console.log('resolved module path is:', resolvedModulePath);
  });
});
