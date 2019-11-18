const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (_, {development}) => {
    return {
        // entry: './src/index.js',
        // output: {
        //     filename: 'main.js',
        //     path: path.resolve(__dirname, 'dist'),
        // },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/,
                    use: [{
                        loader: 'style-loader',
                    }, {
                        loader: 'css-loader',
                        options: {
                            importLoaders: true,
                        }
                    }, {
                        loader: 'postcss-loader'
                    }]
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: true,
                                conservativeCollapse: false,
                            }
                        }
                    ]
                },
            ]
        },
        devtool: 'cheap-module-source-map',
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new webpack.HotModuleReplacementPlugin(),
        ],
        devServer: {
            contentBase: path.resolve(__dirname, 'src'),
            open: true,
            port: 9000,
        }
    }
};
