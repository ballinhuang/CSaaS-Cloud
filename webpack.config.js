const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    Index: `${__dirname}/Client/Index/Index.js`
  },
  output: {
    path: __dirname + '/Client/build',
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css!' },
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.json$/, loader: "json-loader" },
      { test: /\.html$/, loader: 'vue-template-loader' },
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.(png|jpg|gif|ico)$/, loader: "url-loader" },
      { test: /\.(ttf|otf|woff|woff2|eot|svg)\??.*$/, loader: "url-loader?limit=50000&mimetype=application/octet-stream&name=fonts/font-[sha512:hash:base64:15].[ext]" }
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
      { from: `${__dirname}/Client/Index/index.css` },
    ])
  ]
}