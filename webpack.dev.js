const path = require('path')
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    open: true,
    port: 3131,
    compress: true,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(sc|sa|c)ss$/,
        use: ['style-loader',
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
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]

})
