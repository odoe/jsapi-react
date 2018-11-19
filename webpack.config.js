const ArcGISPlugin = require("@arcgis/webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const path = require("path");
const webpack = require("webpack");

module.exports = function(_, arg) {
  const config = {
    entry: {
      index: ["./src/css/main.scss", "./src/index.js"]
    },
    output: {
      filename: "[name].[chunkhash].js",
      publicPath: ""
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            output: {
              comments: false
            }
          },
          cache: true,
          parallel: true,
          sourceMap: false
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            discardComments: {
              removeAll: true
            },
            // Run cssnano in safe mode to avoid
            // potentially unsafe transformations.
            safe: true
          }
        })
      ]
    },
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.js?$/,
          loader: "babel-loader"
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: false }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/,
          loader: "url-loader",
          options: {
            // Inline files smaller than 10 kB (10240 bytes)
            limit: 10 * 1024
          }
        },
        {
          test: /\.(wsv|ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "build/[name].[ext]"
              }
            }
          ]
        },
        {
          test: /\.css$|\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "resolve-url-loader",
              options: { includeRoot: true }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                includePaths: [
                  path.resolve("./node_modules")
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(arg.mode || "production")
      }),

      new CleanWebpackPlugin(["dist"]),

      new ArcGISPlugin({
        useDefaultAssetLoaders: false
      }),

      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
        favicon: "./public/assets/favicon.ico",
        chunksSortMode: "none",
        inlineSource: ".(css)$",
        mode: arg.mode
      }),

      new MiniCssExtractPlugin({
        filename: "[name].[chunkhash].css",
        chunkFilename: "[id].css"
      }),

      new HtmlWebpackInlineSourcePlugin()
    ],
    resolve: {
      modules: [
        path.resolve(__dirname, "/src"),
        path.resolve(__dirname, "node_modules/")
      ],
      extensions: [".js", ".scss", ".css"]
    },
    node: {
      process: false,
      global: false,
      fs: "empty"
    }
  };

  return config;
};
