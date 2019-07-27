function commonResHandler (res) {
  return res.data
}

function getPlainFiles (contenxt) {
  var keys = contenxt.keys()
  var layerpath = _.chain(keys)
		.map(x => {
  if (!_.endsWith(x, '.js')) {
    return x + '.js'
  } else {
    return x
  }
})
		.uniq()
		.map(x => {
  var cptpath = x
  var obj = contenxt(cptpath)
  var cpt = _.get(obj, 'default', obj)
  return { cptpath, cpt }
})
		.value()
  return layerpath
}

function getFirstLayerDirToStringList (context) {
  var keys = context.keys()
  var cptList = _.chain(keys)
		.map(rawkey => {
  var cptname = _.get(_.split(rawkey, '/'), 1)
  var cptobj = context(rawkey)
  var cptctn = _.get(cptobj, 'default', cptobj)
  return {
    cptctn,
    cptname,
    rawkey
  }
})
		.value()
  return cptList
}

var pathUtils = {
  getFirstLayerDirToStringList,
  getPlainFiles
}

const crtUtils = {
  init () {
    var cptctx = require.context('../components')
    var cptlist = pathUtils.getFirstLayerDirToStringList(cptctx)
    _.forEach(cptlist, (x, d, n) => {
      Vue.component(x.cptname, x.cptctn)
    })
  },
  get (...args) {
    return commonResHandler(axios.get(...args))
  },
  post (...args) {
    return commonResHandler(axios.post(...args))
  },
  defer (func, timeval) {
    return setTimeout(func, timeval)
  },
  isdev () {
    return !_.isNil(localStorage.getItem('DEV_MODE'))
  },
  now () {
    return new Date().getTime()
  },
  log (...args) {
    console.log(...args)
  },
  contains (val, str) {
    return _.indexOf(val, str) !== -1
  },
  sleep (timeval) {
    return new Promise(r => {
      setTimeout(() => {
        r()
      }, timeval)
    })
  },
  info: {
    title: ''
  }
}

module.exports = crtUtils
