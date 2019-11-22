const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (_, {development}) => {
    const config = {
        // entry: './src/index.js',
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, 'docs'),
        },
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
        plugins: [
            new HtmlWebPackPlugin({
                template: "./src/index.html",
                filename: "./index.html"
            }),
            new webpack.HotModuleReplacementPlugin(),
        ],
        devServer: {
            contentBase: path.resolve(__dirname, 'src'),
            open: 'http://localhost:9000/',
            host: '0.0.0.0',
            port: 9000,
        }
    };

    if (development) {
        config.devtool = 'cheap-module-source-map';
    } else {
        config.devtool = 'none';
    }

    return config;
};
