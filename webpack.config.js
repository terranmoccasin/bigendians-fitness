var webpack = require('webpack');

module.exports = {
  entry: './src/app.jsx',

  // Sets the output path.
  output: {
    path: __dirname,
    filename: './dist/bundle.js'
  },
  // Generates source maps.
  devtool: 'source-map',

  // Tells webpack to resolve js and jsx files.
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};