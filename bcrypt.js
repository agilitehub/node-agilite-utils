'use strict'

const BCrypt = require('bcryptjs')

const hashValue = async (value) => {
  return new Promise((resolve, reject) => {
    try {
      BCrypt.genSalt(10, (err, salt) => {
        if (err) reject(err)

        BCrypt.hash(value, salt, (err, hash) => {
          if (err) reject(err)
          resolve(hash)
        })
      })
    } catch (e) {
      reject(e)
    }
  })
}

const compareValues = async (valueToCompare, hashedValue) => {
  return new Promise((resolve, reject) => {
    try {
      BCrypt.compare(valueToCompare, hashedValue, (err, isMatch) => {
        if (err) reject(err)
        resolve(isMatch)
      })
    } catch (e) {
      reject(e)
    }
  })
}

// EXPORTS
exports.hashValue = hashValue
exports.compareValues = compareValues
