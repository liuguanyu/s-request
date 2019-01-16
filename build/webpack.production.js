var webpack = require("webpack");
var path = require('path');

var {
    resolve
} = require("./loader.js")

module.exports = {
    entry: {
        index: './index.js',
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 's-request.js',
        library: 's-request',
        libraryTarget: 'umd',
        publicPath: '/dist/',
        umdNamedDefine: true
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {}
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: [resolve('src')],
                loader: "babel-loader"
            },
            {
                // edit this for additional asset file types
                test: /\.(png|jpg|gif)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]"
                }
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     sourceMap: true,
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]
};