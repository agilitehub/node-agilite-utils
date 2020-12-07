'use strict'

const PasswordValidator = require('password-validator')
const TypeDetect = require('type-detect')
const EnumsTypeDetect = require('./enums-type-detect')
const EnumsValidations = require('./enums-validations')
const Validate = require('validate.js')

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

const validateValue = (value, constraintType, maxLength, disableTrim, defaultValue) => {
  const validateConstraints = {}
  const validateParam = {}

  let tmpVal = null
  let tmpVal2 = null
  let result = null
  let optional = false

  return new Promise((resolve, reject) => {
    try {
      // First, Validate Null and Undefined
      tmpVal = TypeDetect(value)
      tmpVal2 = TypeDetect(defaultValue)

      if ((tmpVal === EnumsTypeDetect.NULL) || (tmpVal === EnumsTypeDetect.UNDEFINED)) {
        if ((tmpVal2 === EnumsTypeDetect.NULL) || (tmpVal2 === EnumsTypeDetect.UNDEFINED)) {
          return reject(EnumsValidations.resultTypes.UNDEFINED)
        } else {
          value = defaultValue
          optional = true
        }
      } else if ((tmpVal === EnumsTypeDetect.STRING) && !value) {
        if ((tmpVal2 !== EnumsTypeDetect.NULL) && (tmpVal2 !== EnumsTypeDetect.UNDEFINED)) optional = true
      }

      // Next Validate Length
      tmpVal = value.length
      tmpVal2 = TypeDetect(maxLength)

      if (tmpVal2 !== EnumsTypeDetect.NUMBER) maxLength = EnumsValidations.maxLengths.GENERAL
      if ((maxLength !== 0) && (tmpVal > maxLength)) return reject(EnumsValidations.resultTypes.MAX_LENGTH)

      // Pre Operations
      if (!disableTrim) value = value.trim()

      switch (constraintType) {
        case EnumsValidations.constraintTypes.FIRST_LAST_NAME:
          value = value.charAt(0).toUpperCase() + value.slice(1) // Capitalize

          validateConstraints[EnumsValidations.constraintTypes.FIRST_LAST_NAME] = {
            type: 'string',
            presence: { allowEmpty: false, message: EnumsValidations.resultTypes.EMPTY }
          }

          break
        case EnumsValidations.constraintTypes.PROFILE_KEY:
          value = value.toLowerCase().replace(/[^a-z0-9_-]/gi, '')

          validateConstraints[EnumsValidations.constraintTypes.PROFILE_KEY] = {
            type: 'string',
            presence: { allowEmpty: false, message: EnumsValidations.resultTypes.EMPTY }
          }

          break
        case EnumsValidations.constraintTypes.TEAM_ID:
          value = value.toLowerCase().replace(/[^\w]/gi, '')

          validateConstraints[EnumsValidations.constraintTypes.TEAM_ID] = {
            type: 'string',
            presence: { allowEmpty: optional, message: EnumsValidations.resultTypes.EMPTY }
          }

          break
        case EnumsValidations.constraintTypes.EMAIL:
          value = value.toLowerCase()

          validateConstraints[EnumsValidations.constraintTypes.EMAIL] = {
            presence: { allowEmpty: false, message: EnumsValidations.resultTypes.EMPTY },
            email: { message: EnumsValidations.resultTypes.INVALID }
          }

          break
        default:
          validateConstraints[EnumsValidations.constraintTypes.GENERAL] = {
            type: 'string',
            presence: { allowEmpty: optional, message: EnumsValidations.resultTypes.EMPTY }
          }
      }

      // Check for bypassing of Validate
      switch (constraintType) {
        case EnumsValidations.constraintTypes.PASSWORD:
          // Do nothing
          break
        default:
          validateParam[constraintType] = value
          result = Validate(validateParam, validateConstraints, { fullMessages: false })
      }

      // Post Operations
      switch (constraintType) {
        case EnumsValidations.constraintTypes.PASSWORD:
          result = validatePassword(value)
          break
      }

      // Finalize
      if (result) {
        if (TypeDetect(result) !== EnumsTypeDetect.STRING) result = result[constraintType][0]
        reject(result)
      } else {
        resolve(value)
      }
    } catch (e) {
      reject(e)
    }
  })
}

const validatePassword = (password = '') => {
  const passwordSchema = new PasswordValidator()
  let valid = null
  let errMsg = null
  let x = null
  let y = null

  try {
    passwordSchema
      .is().min(8)
      .has().symbols()
      .has().digits()
      .has().uppercase()

    valid = passwordSchema.validate(password, { list: true })
    x = 0
    y = valid.length

    for (; x < y; x++) {
      switch (valid[x]) {
        case 'min':
          errMsg = 'Password must at least be 8 characters in length'
          break
        case 'uppercase':
          errMsg = 'Password must contain at least 1 uppercase letter'
          break
        case 'digits':
          errMsg = 'Password must contain at least 1 numeric value'
          break
        case 'symbols':
          errMsg = 'Password must contain at least 1 symbol'
          break
      }

      if (errMsg) break
    }
  } catch (e) {
    errMsg = e.message
  }

  return errMsg
}

const trimObjectValues = (dataObject, disableImmediate) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        if (disableImmediate) {
          await _trimObjectValuesExtended(dataObject)
        } else {
          setImmediate(await _trimObjectValuesExtended(dataObject))
        }

        resolve()
      } catch (e) {
        reject(e.message)
      }
    })()
  })
}

// PRIVATE FUNCTIONS
const _trimObjectValuesExtended = (dataObject) => {
  return new Promise((resolve, reject) => {
    (async () => {
      let value = null
      let type = null

      try {
        type = TypeDetect(dataObject)
        if ((type !== EnumsTypeDetect.OBJECT) && (type !== EnumsTypeDetect.ARRAY)) dataObject = {}

        for (const prop in dataObject) {
          value = dataObject[prop]
          type = TypeDetect(value)

          if (type === EnumsTypeDetect.OBJECT || type === EnumsTypeDetect.ARRAY) {
            await trimObjectValues(value)
          } else if (type === EnumsTypeDetect.STRING) {
            dataObject[prop] = value.trim()
          }
        }

        resolve()
      } catch (e) {
        reject(e.message)
      }
    })()
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
exports.validateValue = validateValue
exports.validatePassword = validatePassword
exports.trimObjectValues = trimObjectValues
