const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production'

    return {
        entry: './src/index.ts',
        output: {
            filename: 'bundle.[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
        },
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        devServer: {
            static: path.resolve(__dirname, 'dist'),
            port: 3000,
            open: true,
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[contenthash].[ext]',
                                outputPath: 'assets/images/',
                            },
                        },
                    ],
                },
            ],
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
            extensions: ['.ts', '.js', '.json', '.png', '.jpg'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
                minify: isProduction,
            }),
            new CleanWebpackPlugin(),
        ],
    }
}
