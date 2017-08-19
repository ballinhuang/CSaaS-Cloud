const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    Index: `${__dirname}/Client/Index/Index.js`,
    Login: `${__dirname}/Client/Login/Login.js`,
  },
  output: {
    path: __dirname + '/Client/build',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: [
            'es2015',
            'babel-preset-stage-0'
          ]
        }
        , exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        loader: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(jpg|eot|png|woff|woff2|ttf|svg)$/,
        loader: "url-loader"
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        sequences: true,
        booleans: true
      }
    }),
    new CopyWebpackPlugin([
      { from: `${__dirname}/Client/Login/login.css` },
    ])
  ]
}