const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        main: './src/SharePlace.js',
        myplace: './src/MyPlace.js'
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].bundle.js'
    },
    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        port: 3000,
        overlay: true
    },
    devtool: "cheap-module-eval-source-map",
    // https://webpack.js.org/concepts/loaders/
    module: {
        rules: [
        {
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
                "style-loader", // creates style nodes from JS strings
                {
                    loader: "css-loader", // translates CSS into CommonJS
                    options: {
                        sourceMap: true
                    }
                },
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
                loader: "html-loader"
            }]
        },
        {
            test: /\.(png|svg|jpe?g|gif)$/,
            use: [
              {
                loader: "file-loader", // This will resolves import/require() on a file into a url and emits the file into the output directory.
                options: {
                  name: "[name].[ext]",
                  outputPath: "assets/",
                  esModule: false
                }
              },
            ]
            },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
                'file-loader'
            ],
        }]
    },
    // https://webpack.js.org/concepts/plugins/
    plugins: [
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
        new CleanWebpackPlugin(),
    ]
}