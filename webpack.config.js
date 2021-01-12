const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (_, {mode}) => {
    const development = mode === 'development';
    const config = {
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
                                minimize: {
                                    conservativeCollapse: false,
                                    minifyCSS: !development,
                                    minifyJS: !development,
                                    collapseWhitespace: !development,
                                }
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
            open: true,
            port: 9000,
        }
    };

    if (development) {
        config.devtool = 'cheap-module-source-map';
    } else {
        config.devtool = false;
    }

    return config;
};
