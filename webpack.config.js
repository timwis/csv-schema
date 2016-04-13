/* global __dirname */
module.exports = {
  entry: __dirname + '/src/index.jsx',
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
        loader: 'babel-loader',
        query: { presets: ['react', 'es2015'] }
      }
    ]
  }
}
