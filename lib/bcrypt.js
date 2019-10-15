const hashValue = async function (value) {
  return new Promise((resolve, reject) => {
    const BCrypt = require('bcrypt')

    try {
      BCrypt.genSalt(10, function (err, salt) {
        if (err) {
          return reject(err)
        }

        BCrypt.hash(value, salt, function (err, hash) {
          if (err) {
            return reject(err)
          }

          resolve(hash)
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}

const compareValues = async function (valueToCompare, hashedValue) {
  return new Promise((resolve, reject) => {
    const BCrypt = require('bcrypt')

    try {
      BCrypt.compare(valueToCompare, hashedValue, function (err, isMatch) {
        if (err) {
          reject(err)
        } else {
          resolve(isMatch)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

// EXPORTS
exports.hashValue = hashValue
exports.compareValues = compareValues
