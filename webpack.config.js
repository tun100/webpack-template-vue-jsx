// utils and node.js api
const fs = require('fs')
const sh = require('shelljs')
const _ = require('lodash')
const os = require('os')
const path = require('path')
// webpack import
const webpack = require('webpack')
const compiler = webpack.compiler
const HappyPack = require('happypack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// webpack init
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})
// function declare
const node_modules_path = path.normalize(path.join(__dirname, 'node_modules'))
const noModuleArr = [node_modules_path, /^~/gi]
const utils = {
  getCrtPath: relativePath => {
    return path.join(__dirname, relativePath)
  }
}
function createStyleUseObject (isModule = true) {
  return [
		{ loader: MiniCssExtractPlugin.loader },
    {
      loader: 'css-loader',
      options:
				isModule === true
					? {
  modules: true,
  localIdentName: '[name]__[local]___[hash:base64:5]'
							//  modules: true,
							//   localIdentName: '[hash:base64:6]'
					  }
					: { modules: false }
    },
    {
      loader: 'less-loader'
    },
		{ loader: 'postcss-loader' }
  ]
}
// variables declare
var entryobj = {}
var htmlPlugins = []
var distFolderName = 'build'
var distdir = utils.getCrtPath(distFolderName)
// add page by read dir
var pagesPath = utils.getCrtPath('./pages')
var pagesArr = fs.readdirSync(pagesPath)
_.forEach(pagesArr, eachPage => {
  var chunkName = eachPage
  var indexHtmlPath = utils.getCrtPath(`./pages/${chunkName}/index.html`)
  var indexPageArg = {
    template: indexHtmlPath,
    filename: utils.getCrtPath(`./${distFolderName}/${chunkName}/index.html`),
    chunks: [chunkName]
  }
  var indexPagePlugin = new HtmlWebpackPlugin(indexPageArg)
  htmlPlugins.push(indexPagePlugin)
  entryobj[chunkName] = utils.getCrtPath(`./pages/${chunkName}/index.js`)
})
if (entryobj['index']) {
  htmlPlugins.push(
		new HtmlWebpackPlugin({
  template: utils.getCrtPath(`./config/redirect.html`),
  filename: utils.getCrtPath(`./${distFolderName}/index.html`),
  chunks: []
})
	)
}

var configureWebpack = require('./config/configureWebpack')

module.exports = mode => {
  var isDev = mode === 'dev'
  var babelrc = JSON.parse(fs.readFileSync(utils.getCrtPath(isDev ? 'devbabel.json' : 'distbabel.json'), 'UTF-8'))
	// environment
  process.env.NODE_ENV = isDev ? 'development' : 'production'
  var contentHashValue = isDev ? 'hash' : 'contenthash'
  var webpackConfig = {
    devServer: {
      inline: true,
      hot: true,
      inline: true,
      progress: true,
      publicPath: '/',
      contentBase: utils.getCrtPath(distFolderName),
      compress: true,
      port: 10010
    },
    entry: entryobj,
    plugins: _.filter(
      [
        new CleanWebpackPlugin([distdir], {
          allowExternal: true
        }),
        new VueLoaderPlugin(),
        ...htmlPlugins,
        new MiniCssExtractPlugin({
          filename: '[name].[' + contentHashValue + '].css'
        })
				// new HappyPack({
				//   id: 'happybabel',
				//   loaders: ['babel-loader', 'xml-loader'],
				//   threadPool: happyThreadPool,
				//   verbose: true
				// })
      ],
			(x, d, n) => {
  return !_.isNil(x)
}
		),
    output: {
      filename: '[name].[' + contentHashValue + '].js',
      publicPath: '../',
      path: distdir
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js'
      }
    },
    optimization: {},
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader'
            }
          ]
        },
        {
          test: /\.less$/,
          exclude: noModuleArr,
          use: createStyleUseObject(true)
        },
        {
          test: /\.less$/,
          include: noModuleArr,
          use: createStyleUseObject(false)
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: babelrc
            }
          ]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.(png|svg|jpg|gif|jpeg)$/,
          use: ['file-loader']
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '../[name].[ext]'
              }
            }
          ]
        }
      ]
    }
  }

  return configureWebpack(webpackConfig, mode)
}
