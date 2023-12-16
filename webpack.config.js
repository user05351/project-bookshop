const path = require('path');
const mode = process.env.NODE_ENV || 'development';
const devMode = mode === "development";
const target = devMode ? "web" : "browserslist";
const devtool = devMode? 'source-map' : undefined; 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    mode, 
    target ,
    devtool,
    devServer: {
        port: 3000,
        open: true,
        hot: true,
    },
    entry: ["@babel/polyfill", path.resolve(__dirname, 'src', 'index.js')],
    output: {
        filename: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: "[name].[contenthash].js",
        assetModuleFilename: "assets/[name][ext]"
    },
    optimization: {
        minimizer: [
          new CssMinimizerPlugin(),
        ],
        minimize: devMode? false : true,
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html"),
        }),
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
    ],
    module: {
        rules:[
        {
            test: /\.html$/i,
            loader: 'html-loader',
        },
        {
            test: /\.(c|sa|sc)ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                {
                    loader: "postcss-loader",
                    options:{
                        postcssOptions: {
                            plugins: [require('postcss-preset-env')]
                        }
                    }
                },
                "sass-loader",
            ],
        },
        {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
        },
        {  
            test: /\.woff2?$/i,
            type: "asset/resource",
            generator: {
                filename: 'fonts/[name][ext]',
            }
        },
        {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
                {
                    loader: 'image-webpack-loader',
                    options: {
                      mozjpeg: {
                        progressive: true,
                      },
                      optipng: {
                        enabled: false,
                      },
                      pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                      },
                      gifsicle: {
                        interlaced: false,
                      },
                      webp: {
                        quality: 75
                      }
                    }
                },
            ],
            type: "asset/resource",
        },
        ],
    },
};
