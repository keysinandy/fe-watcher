const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: {
    sdk: path.resolve(__dirname, 'sdk/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].min.js',
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        ecma: 5,
        mangle: true,
        keep_classnames: false,
        keep_fnames: false
      }
    })],
  },
};
