const path = require('path');

module.exports = {
    // mode: 'development',
    entry: './src/index.ts',
    devtool: 'source-map',   // or inline-source-map
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'nc-site-backend.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'node'
};