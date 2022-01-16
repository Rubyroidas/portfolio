const path = require('path');

module.exports = {
    devtool: 'cheap-module-source-map',
    stats: {
        assets: false,
        colors: true,
        version: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        chunkOrigins: false,
        children: false,
        modules: false,
        moduleTrace: false,
        reasons: false,
        source: false,
        entrypoints: false,
        cached: false,
        cachedAssets: false
    },
    performance: {
        hints: false
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, '../static'),
            watch: true,
        },
        port: 9000,
        open: true,
        client: {
            logging: 'none',
        },
        historyApiFallback: true,
    },

    optimization: {
        minimize: false
    },
};
