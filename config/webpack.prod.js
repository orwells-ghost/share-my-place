const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require("glob")

module.exports = {
    mode: 'production',
    entry: {
        main: './src/SharePlace.js',
        myplace: './src/MyPlace.js'
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].[chunkhash:8].bundle.js",
        chunkFilename: "[name].[chunkhash:8].chunk.js"
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader", // transpiling our JavaScript files using Babel and webpack
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                // Tests are which files webpack should process with a 'loader'. A loader allows webpack to handle non-JS filetypes. Any files that pass the test will be processed by the proceeding loaders.
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader", // translates CSS into CommonJS
                    { // "postcss-loader", // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: './config/postcss.config.js'
                            }
                        }
                    },
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: true
                    }
                }]
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: [{
                    loader: "file-loader", // This will resolves import/require() on a file into a url and emits the file into the output directory.
                    options: {
                        name: "[name].[ext]",
                        outputPath: "assets/",
                        esModule: false
                    }
                }, ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ],
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        // This will put everything with an import in node_modules into a file called 'vendors'.
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            },
            chunks: "all"
        }
    },
    // https://webpack.js.org/concepts/plugins/
    plugins: [
        // CleanWebpackPlugin will do some clean up/remove folder before build
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html', // location of html file
            chunks: ['main'], // what 'chunk', or entry, to load with file
            filename: 'index.html' // file name and location when injected
        }),
        new HtmlWebpackPlugin({
            template: './src/my-place/index.html',
            chunks: ['myplace'],
            filename: 'my-place/index.html'
        }),
        new PurgecssPlugin({
            paths: glob.sync(path.resolve(__dirname, '../src/**/*'), { nodir: true })
        }),
        // creates a CSS file per JS file which contains CSS
        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash:8].bundle.css",
            chunkFilename: "[name].[chunkhash:8].chunk.css",
        }),
        new CompressionPlugin({
            algorithm: "gzip"
        }),
    ]
}