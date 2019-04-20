const { resolve } = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack') // to access built-in plugins
const CopyPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    app: './src/index.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            compact: true
          }
        }
      },
      // 这里采用imports-loader引用three/examples/js下的内容
      // 因为three/examples/jsm下的模块尚不全面
      {
        test: /three\/examples\/js/,
        use: 'imports-loader?THREE=three'
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyPlugin([
      {
        from: resolve(__dirname, '../public'),
        to: resolve(__dirname, '../docs/public')
      },
      {
        from: resolve(__dirname, '../node_modules/three/build/three.min.js'),
        to: resolve(__dirname, '../docs')
      }
    ])
  ],
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, '../docs')
  },
  externals: {
    three: 'THREE'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all'
        }
      }
    }
  }
}
