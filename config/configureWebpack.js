var _ = require('lodash')
var webpack = require('webpack')
var path = require('path')

function makeDefault (str) {
  return [str, 'default']
}

var path_vue = ['vue/dist/vue.js']
var path_vuex = ['vuex/dist/vuex.js']
var path_vuerouter = ['vue-router/dist/vue-router.js']

module.exports = (conf, mode) => {
  conf.plugins = [
    new webpack.ProvidePlugin({
      _: 'lodash',
      moment: 'moment',
      axios: 'axios',
      vue: path_vue,
      Vue: path_vue,
      vuex: path_vuex,
      Vuex: path_vuex,
      VueRouter: path_vuerouter,
      ELEMENT: 'element-ui',
      utils: path.join(__dirname, 'object_utils.js')
    }),
    ...conf.plugins
  ]
  return _.merge(conf, {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3000'
        }
      }
    }
  })
}
