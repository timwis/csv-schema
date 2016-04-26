/* global __dirname */
var webpack = require('webpack')

module.exports = {
  entry: ['babel-polyfill', __dirname + '/src/index.js'],
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/unicode\/category\/So/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ],
  externals: {
    'papaparse': 'Papa'
  }
}
