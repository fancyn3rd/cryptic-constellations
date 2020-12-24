
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path")

module.exports = {
  devtool: "eval-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "./bundle.js"
},
  module: {
    rules: [
        {
          test: /\.css$/i,
          use: ['css-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ],
  },
  devServer: {
    publicPath:"/",
    contentBase: path.resolve(__dirname, "./")
  },
  node: {
    fs: "empty"
 },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html"
    })
  ]
}

