const getQueryParams = (qs) => {
  qs = qs.split('+').join(' ')

  const params = {}
  const re = /[?&]?([^=]+)=([^&]*)/g
  let tokens = null

  // eslint-disable-next-line
  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2])
  }

  return params
}

const isNumber = (value) => {
  const str = ('' + value).trim()
  if (str.length === 0) return false
  return !isNaN(+str)
}

const padValue = (n, width, z) => {
  z = z || '0'
  n = n + ''

  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

const toProperCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

// EXPORTS
exports.getQueryParams = getQueryParams
exports.isNumber = isNumber
exports.padValue = padValue
exports.toProperCase = toProperCase
