
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path")

module.exports = (env) => ({
  devtool: env.development ? "eval-source-map" : "none",
  mode: env.development ? "development" : "prouduction",
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
    static: path.resolve(__dirname, "./")
  },
  resolve: {
    fallback: { 
      "url": require.resolve("url/"),
      process: "process/browser"
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html"
    })
  ]
})

