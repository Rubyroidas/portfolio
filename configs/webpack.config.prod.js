const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const staticDir = path.resolve(__dirname, '../static');
const buildDir = path.resolve(__dirname, '../dist');

module.exports = {
    devtool: false,

    plugins: [
        new CleanWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [{
                from: staticDir,
                to: buildDir,
                noErrorOnMissing: true,
            }],
            options: {
                concurrency: 10,
            },
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            // prohibition of `<bundle_file_name.ext>.LICENSE.txt` file on the output
            extractComments: false,
        })],
    },
};
