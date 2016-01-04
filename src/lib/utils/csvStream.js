'use strict';

const stream = require('stream');
const _ = require('underscore');

/**
 * @class CsvStream
 */
class CsvStream extends stream.Transform {
  /**
   * @constructor
   */
  constructor(csvKeys) {
    super({
      objectMode: true
    });

    this.csvKeys = csvKeys;
  }
}

CsvStream.prototype._transform = function(chunk, encoding, next) {

  if (!this._hasWritten) { //write the 1rst line of the CSV
    this._hasWritten = true;

    var csvHeader = '';

    _.each(this.csvKeys, (csvKey) => {
      if (_.isObject(csvKey)) {
        csvHeader += (csvKey.name + ',');
      } else {
        csvHeader += (csvKey + ',');
      }
    });

    csvHeader += '\n';

    this.push(csvHeader);
  }

  var csvLine = '';

  _.each(this.csvKeys, function(csvKey) {
    if (_.isObject(csvKey)) {
      if (csvKey.hasOwnProperty('getProperty')) {
        csvLine += (csvKey.getProperty(chunk) + ',');
      } else {
        csvLine += (_getProperty(chunk, csvKey.property) + ',');
      }
    } else {
      csvLine += (_getProperty(chunk, csvKey) + ',');
    }
  });

  csvLine += '\n';

  this.push(csvLine);

  return next();
};

function _getProperty(obj, propertyName) {

  if (propertyName && propertyName.indexOf('.') > 0) {

    var parts = propertyName.split('.');
    var subObj = obj;

    for (var i = 0; i < parts.length; i++) {
      var currentPart = parts[i];

      if (subObj[currentPart]) {
        subObj = subObj[currentPart];
      } else {
        subObj = null;
        break;
      }
    }

    return subObj;
  } else {
    return obj[propertyName] || null;
  }
}

/**
 * @exports
 */
module.exports = CsvStream;
