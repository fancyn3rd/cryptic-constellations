const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = (env) => {
  const isEnvDevelopment = !!env.development;

  return {
    devtool: isEnvDevelopment ? "eval-source-map" : false,

    mode: isEnvDevelopment ? "development" : "production",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "./"),
      },
      // Enables hot module replacement
      hot: true,
    },
    resolve: {
      fallback: {
        url: require.resolve("url"),
      },
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./index.html",
        filename: "index.html",
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
  };
};
