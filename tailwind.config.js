require('ts-node/register/transpile-only');

// Load the TypeScript config file. Make sure you have `export default config` in tailwind.config.ts
const tsConfig = require('./tailwind.config.ts');
module.exports = tsConfig.default || tsConfig;