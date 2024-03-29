const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const devConfig = require('./webpack.config.dev');
const prodConfig = require('./webpack.config.prod');
const getGlobalVars = require('./globalVars');

module.exports = (_, baseConfig) => {
    const development = baseConfig.mode === 'development';
    const config = {
        entry: './src/index.jsx',
        output: {
            publicPath: '/',
            filename: 'bundle.js',
            path: path.resolve(__dirname, '../dist'),
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    use: 'babel-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.html$/,
                    use: 'html-loader'
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin(getGlobalVars(development)),
            new HtmlWebPackPlugin({
                template: path.resolve(__dirname, '../src/index.html'),
                inject: true,
                filename: 'index.html',
            }),
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
        },
    };

    return merge(config, development ? devConfig : prodConfig);
};
