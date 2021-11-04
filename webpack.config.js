const path = require('path')
const { getAbsolutePathFiles, getDirectoryNames, getWebapckEntryObj } = require('./utils/webpack')
const { curry, compose } = require('./utils/fp')
const HtmlWebapckPlugin = require('html-webpack-plugin')

const srcFolerPath = path.resolve(__dirname, 'src/lib')
function boblog(obj) {
  console.log('webpackEntry:', obj);
  return obj
  
}
// const webpackEntry = getWebapckEntryObj(getDirectoryNames(getAbsolutePathFiles(srcFolerPath)))
const webpackEntry = compose(boblog, getWebapckEntryObj, getDirectoryNames, getAbsolutePathFiles)(srcFolerPath)

console.log(webpackEntry)

module.exports = {
  entry: webpackEntry,
  output: {
    path: path.resolve(__dirname, 'dist/lib'),
    filename: '[name].js',
    library: 'd3traffic',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /(antd).*\.less$/,
        include: path.resolve(__dirname, 'node_modules'),
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader')
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true
            }
          }
        ],
      },
      {
        test: /\.less$/,
        include: path.resolve(__dirname, 'src/lib'),
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader')
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              javascriptEnabled: true
            }
          }
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebapckPlugin({
      template: './src/index.html',
      chunks: ['app']
    })
  ],
  devServer: {
    contentBase: 'dist/lib',
    open: true
  },
  mode: 'development'
}