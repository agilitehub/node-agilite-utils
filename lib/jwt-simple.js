const encode = async function (payload, secret) {
  let errMsg = null
  let token = null

  return new Promise((resolve, reject) => {
    try {
      if (!payload || !secret) {
        errMsg = 'Undefined value(s) passed to function - encode'
        reject(errMsg)
      } else {
        token = require('jwt-simple').encode(payload, secret)
        resolve(token)
      }
    } catch (e) {
      reject(e)
    }
  })
}

const decode = async function (token, secret) {
  let errMsg = null
  let result = null

  return new Promise((resolve, reject) => {
    try {
      if (!token || !secret) {
        errMsg = 'Undefined value(s) passed to function - decode'
        reject(errMsg)
      } else {
        result = require('jwt-simple').decode(token, secret)
        resolve(result)
      }
    } catch (e) {
      reject(e)
    }
  })
}

// EXPORTS
exports.encode = encode
exports.decode = decode
