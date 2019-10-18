const Utils = {
  dotEnv: require('dotenv'),
  enumsTypeDetect: require('./lib/enums-type-detect'),
  typeDetect: require('type-detect'),
  nanoPerformance: require('nano-performance'),
  dateFNS: require('date-fns'),
  genericPool: require('generic-pool'),
  servicePool: require('service-pool'),
  axios: require('axios').default,
  bcrypt: require('./lib/bcrypt'),
  jwtSimple: require('./lib/jwt-simple'),
  uuid: require('uuid')
}

module.exports = Utils
