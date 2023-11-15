const mongoose = require('mongoose');
const { NOT_FOUND_MESSAGE } = require('../const');


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
  if (res) {
    sendFailureResponse({ res, status, message })
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
    return true
  } else {
    const existObj = await model.findById(id);
    if (!existObj) {
      sendFailureResponse({ res, message: NOT_FOUND_MESSAGE(entity), status: 404 });
      return true
    }
  }
  return false
}

const successResponse = ({ data = null, message = null }) => {
  return {
    success: true,
    message,
    data,
  }
}

const failureResponse = ({ data = null, message = null }) => {
  return {
    success: false,
    message,
    data,
  }
}

const sendSuccessResponse = ({ res = null, status = 200, data = null, message = null }) => {
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

const checkValidation = (req, res, customBodyParams = null) => {
  const paramsArr = Object.entries(customBodyParams || req.body).map(([key, value]) => ({ key, value }));
  paramsArr?.forEach((item) => {
    if (!item?.value) {
      return sendFailureResponse({ res, message: `${toCapitalCase(item?.key)} is required` })
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
