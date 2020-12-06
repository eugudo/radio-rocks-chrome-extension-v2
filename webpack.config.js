const path = require('path');
const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist'),
};
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const fs = require('fs');
const PUG_PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PUG_FILES = fs.readdirSync(PUG_PAGES_DIR).filter((fileName) => fileName.endsWith('.pug'));

module.exports = {
    externals: {
        paths: PATHS,
    },
    context: path.resolve(__dirname, 'src'),
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000
    },
    mode: 'development',
    entry: {
        popup: `${PATHS.src}/ts/popup.ts`,
        background: `${PATHS.src}/ts/background.ts`,
    },

    output: {
        filename: '[name].js',
        path: `${PATHS.dist}/js`,
    },
    module: {
        rules: [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                options: {
                    pretty: true,
                },
            },
            {
                test: /\.less$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader?url=false', 'less-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|webp)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    plugins: [
        ...PUG_FILES.map(
            (page) =>
                new HtmlWebpackPlugin({
                    template: `${PUG_PAGES_DIR}/${page}`,
                    filename: `${PATHS.dist}/${page.replace(/\.pug/, '.html')}`,
                    inject: false,
                    minify: false,
                })
        ),
        new MiniCssExtractPlugin({
            filename: '../css/styles.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: `${PATHS.src}/manifest.json`, to: `${PATHS.dist}/manifest.json` },
                {
                    from: 'img/*',
                    to: `${PATHS.dist}`,
                },
                {
                    from: '_locales/',
                    to: `${PATHS.dist}/_locales/`,
                },
            ],
        }),
    ],
};