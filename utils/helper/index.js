const mongoose = require('mongoose');
const { ERROR_INVALID_ID, ERROR_RECORD_NOT_FOUND, ERROR_SERVER_ERROR } = require('../const');
const { sendFailureResponse } = require('./api');

const handleCatchedError = ({
  error,
  at = "at position is not defined",
  res = null,
  status = 500,
  message = "Server error! Something went wrong."
}) => {
  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" ////////////////////////// handleCatchedError Start /////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")

  console.log(" -----------------> [At]:", at, "[Error]: ", error);

  if (![ERROR_INVALID_ID, ERROR_RECORD_NOT_FOUND, ERROR_SERVER_ERROR]?.includes(error?.message)) {
    if (res) {
      sendFailureResponse({ res, status, message })
    }
  }

  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  console.log(" ////////////////////////// handleCatchedError End ///////////////////////////// ")
  console.log(" /////////////////////////////////////////////////////////////////////////////// ")
  // console.log(" /////////////////////////////////////////////////////////////////////////////// ")
};



const toCapitalCase = (string) => {
  return string?.charAt(0).toUpperCase() + string.slice(1)
}

const compareObjectsDeepEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}

const findIntersectionObjects = (obj1, obj2) => {
  const result = {};
  const deepIntersection = (source, target, currentKey = '') => {
    for (const key in source) {
      const newKey = currentKey ? `${currentKey}.${key}` : key;
      if (target.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && typeof target[key] === 'object') {
          result[newKey] = {};
          deepIntersection(source[key], target[key], newKey);
        } else if (source[key] === target[key]) {
          result[newKey] = source[key];
        }
      }
    }
  };
  deepIntersection(obj1, obj2);
  return result;
};

module.exports = {
  handleCatchedError,
  compareObjectsDeepEqual,
  toCapitalCase,
  findIntersectionObjects
};
