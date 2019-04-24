const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const procEnv = process.env.IONIC_ENV;

module.exports = function () {
  useDefaultConfig[procEnv].resolve.alias = {
    "@app/env": path.resolve('./src/environments/environment' + (process.env.IONIC_ENV === 'prod' ? '' : '.' + process.env.IONIC_ENV) + '.ts')
  };
  return useDefaultConfig;
};
