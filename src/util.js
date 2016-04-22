import moment from 'moment'

exports.detectType = function (sample) {
  if (sample === '') {
    return 'null'
  } else if (sample.includes('-') && moment(sample, 'YYYY-MM-DD', true).isValid()) {
    return 'date'
  } else if (sample.includes('-') && moment(sample, moment.ISO_8601, true).isValid()) {
    return 'datetime'
  } else if (moment(sample, 'X', true).isValid() && +sample >= 31536000) {
    // sanity check since '1' is technically a timestamp (>= 1971)
    return 'timestamp'
  } else if (!isNaN(sample) && sample.includes('.')) {
    return 'float'
  } else if (sample === '1' || sample === '0' || ['true', 'false'].includes(sample.toLowerCase())) {
    return 'boolean'
  } else if (!isNaN(sample)) {
    return 'integer'
  } else if (sample.length > 255) {
    return 'text'
  } else {
    return 'string'
  }
}

/**
 *  Determine which type wins
 *  - timestamp could be int
 *  - integer could be float
 *  - everything could be string
 *  - if detect an int, don't check for timestamp anymore, only check for float or string
 *  - maybe this optimization can come later...
 */
exports.determineWinner = function (fieldTypes) {
  const keys = Object.keys(fieldTypes)

  if (keys.length === 1) {
    return keys[0]
  } else if (fieldTypes.text) {
    return 'text'
  } else if (fieldTypes.string) {
    return 'string'
  } else if (fieldTypes.float) {
    return 'float'
  } else if (fieldTypes.integer) {
    return 'integer'
  } else { // TODO: if keys.length > 1 then... what? always string? what about date + datetime?
    return fieldTypes[0]
  }
}

exports.formatBytes = function (bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i
  for (i = 0; bytes >= 1024 && i < 4; i++) {
    bytes /= 1024
  }
  return bytes.toFixed(2) + units[i]
}
