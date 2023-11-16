const mongoose = require('mongoose');
const { NOT_FOUND_MESSAGE, ERROR_INVALID_ID, ERROR_RECORD_NOT_FOUND, ERROR_SERVER_ERROR } = require('../const');

const handleCatchedError = ({
  error,
  at = "at position not defined",
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

const returnCatchedError = ({ res = null, status = 400, error, at = "at position not defined" }) => {
  handleCatchedError({ at, error })
  res.status(status).json(error)
}

const isNotFoundByID = async ({ res, model, id, entity = "" }) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    sendFailureResponse({ res, message: `Invalid ${entity} Object ID, Id dont have type pattern.` })
    throw new Error(ERROR_INVALID_ID)
  } else {
    const existObj = await model.findById(id);
    if (!existObj) {
      sendFailureResponse({ res, message: NOT_FOUND_MESSAGE(entity), status: 404 });
      throw new Error(ERROR_RECORD_NOT_FOUND)
    }
  }
}

const successResponse = ({ data = undefined, message = null }) => {
  if (data === null) {
    throw new Error('error')
  }
  return {
    success: true,
    message,
    data,
  }
}

const failureResponse = ({ message = null }) => {
  return {
    success: false,
    message,
  }
}

const sendSuccessResponse = ({ res = null, status = 200, data = undefined, message = null }) => {
  if (res) {
    res.status(status).send(successResponse({ data, message }))
  } else {
    throw new Error('Res is null, please send res key to sendSuccessResponse({res: ??})')
  }
}

const sendFailureResponse = ({ res = null, status = 400, message = null, }) => {
  if (res) {
    res.status(status).json(failureResponse({ message }))
  } else {
    throw new Error('Res is null, please send res key to sendFailureResponse({res: ??})')
  }
}

const toCapitalCase = (string) => {
  return string?.charAt(0).toUpperCase() + string.slice(1)
}

const checkValidation = (req, res, requiredFields = null) => {
  const paramsArr = Object.entries(requiredFields || req.body).map(([key, value]) => ({ key, value }));
  paramsArr?.forEach((item) => {
    if (requiredFields) {
      if (!Object.keys(req.body)?.includes(item.key)) {
        sendFailureResponse({ res, message: `${toCapitalCase(item?.key)} is required` })
        throw new Error(ERROR_SERVER_ERROR)
      }
    }
    if (!item?.value) {
      sendFailureResponse({ res, message: `${toCapitalCase(item?.key)} cannot be not null or undefined` })
      throw new Error(ERROR_SERVER_ERROR)
    }
  })
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


module.exports = {
  handleCatchedError,
  successResponse,
  failureResponse,
  sendSuccessResponse,
  sendFailureResponse,
  returnCatchedError,
  toCapitalCase,
  checkValidation,
  compareObjectsDeepEqual,
  isNotFoundByID,
};
