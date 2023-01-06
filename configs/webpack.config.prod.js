const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    devtool: false,
    output: {
        clean: true,
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                // prohibition of `<bundle_file_name.ext>.LICENSE.txt` file on the output
                extractComments: false,
            }),
            new CssMinimizerPlugin(),
        ],
    },
};
