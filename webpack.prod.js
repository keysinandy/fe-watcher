
const path = require('path')
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[name].[hash].css',
    })
  ],
  module: {
    rules: [
      {
        test: /\.(scss|sass|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              import: true,
              modules: {
                compileType: 'module',
                // enable css modules
                mode: 'local',
                // enable css modules for all files for which /\.module\.\w+$/i.test(filename) return true
                auto: true,
                exportGlobals: true,
                localIdentName: '[name]__[local]--[hash:base64:5]',
                localIdentContext: path.resolve(__dirname, 'context'),
              },
            }
          },
          'postcss-loader', 'sass-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        },
        canPrint: true
      })
    ]
  },
})
