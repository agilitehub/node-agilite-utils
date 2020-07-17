'use strict'

const getQueryParams = (url) => {
  const newUrl = new URL(url)
  const params = {}
  const re = /[?&]?([^=]+)=([^&]*)/g

  let qs = newUrl.search
  let tokens = null

  qs = qs.split('+').join(' ')

  // eslint-disable-next-line
  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
  }

  return params
}

const getUrlPath = () => {
  const urlPath = window.location.pathname.split('/')
  const resultPath = []

  for (const x in urlPath) if (urlPath[x] !== '') resultPath.push(urlPath[x])
  return resultPath
}

const isNumber = (value) => {
  const str = ('' + value).trim()
  return (str.length === 0) ? false : !isNaN(+str)
}

const padValue = (n, width, z) => {
  z = z || '0'
  n = n + ''

  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

const toProperCase = (str) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

const parseJSONAsync = (data, asyncType) => {
  return new Promise((resolve, reject) => {
    try {
      switch (asyncType) {
        case 'immediate':
          setImmediate(() => {
            resolve(JSON.parse(data))
          })
          break
        case 'tick':
          process.nextTick(() => {
            resolve(JSON.parse(data))
          })
          break
        default:
          setTimeout(() => {
            resolve(JSON.parse(data))
          }, 0)
      }
    } catch (e) {
      reject(e)
    }
  })
}

const stringifyJSONAsync = (data, asyncType) => {
  return new Promise((resolve, reject) => {
    try {
      switch (asyncType) {
        case 'immediate':
          setImmediate(() => {
            resolve(JSON.stringify(data))
          })
          break
        case 'tick':
          process.nextTick(() => {
            resolve(JSON.stringify(data))
          })
          break
        default:
          setTimeout(() => {
            resolve(JSON.stringify(data))
          }, 0)
      }
    } catch (e) {
      reject(e)
    }
  })
}

const createJSONCopy = (data, asyncType) => {
  return new Promise((resolve, reject) => {
    try {
      switch (asyncType) {
        case 'immediate':
          setImmediate(() => {
            resolve(JSON.parse(JSON.stringify(data)))
          })
          break
        case 'tick':
          process.nextTick(() => {
            resolve(JSON.parse(JSON.stringify(data)))
          })
          break
        default:
          setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(data)))
          }, 0)
      }
    } catch (e) {
      reject(e)
    }
  })
}

// EXPORTS
exports.getQueryParams = getQueryParams
exports.getUrlPath = getUrlPath
exports.isNumber = isNumber
exports.padValue = padValue
exports.toProperCase = toProperCase
exports.parseJSONAsync = parseJSONAsync
exports.stringifyJSONAsync = stringifyJSONAsync
exports.createJSONCopy = createJSONCopy
