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

const isAlreadyExistById = async ({ req, res, model, id, bodyData, entity = "Record" }) => {
  const incomingData = bodyData || req.body;
  const findDataByID = await model.findById(id)
  const intersectedObj = findIntersectionObjects(incomingData, findDataByID.toObject())
  if (Object.keys(intersectedObj)?.length > 0) {
    sendFailureResponse({ res, message: `${entity} data already exist.` })
    throw new Error(ERROR_SERVER_ERROR)
  }
}

const checkValidation = ({ req, res, model, requiredFields = [], bodyData = null }) => {
  const allowedKeys = Object?.keys(model?.schema.tree);
  const incomingData = bodyData || req.body;

  if (Object.keys(req.body).length === 0) {
    sendFailureResponse({ res, message: 'Null payload data' })
    throw new Error(ERROR_SERVER_ERROR)
  }

  if (requiredFields?.length > 0) {
    const remainingRequiredKeys = requiredFields.filter(element => !Object.keys(incomingData).includes(element))
    remainingRequiredKeys?.length > 0 && remainingRequiredKeys?.forEach((item) => {
      sendFailureResponse({ res, message: `${toCapitalCase(item)} is required` })
      throw new Error(ERROR_SERVER_ERROR)
    })
  }

  const invalidKeys = Object.keys(incomingData).filter(key => !allowedKeys.includes(key));
  if (invalidKeys.length > 0) {
    sendFailureResponse({ res, message: `${invalidKeys?.map(item => ` ${item}`)} ${invalidKeys?.length > 1 ? 'are' : 'is'} invalid ${invalidKeys?.length > 1 ? 'keys' : 'key'}` });
    throw new Error(ERROR_SERVER_ERROR)
  }

  const paramsArr = Object.entries(incomingData).map(([key, value]) => ({ key, value }));

  paramsArr?.forEach((item) => {
    if (!item?.value) {
      sendFailureResponse({ res, message: `${toCapitalCase(item?.key)} cannot be not null or undefined` })
      throw new Error(ERROR_SERVER_ERROR)
    }
  })
}

const handlePutRequest = async ({ req, res, model, bodyData = null, requiredFields = [], entity = "Record" }) => {
  const { id } = req.params;
  checkValidation({ req, res, model, bodyData, requiredFields })
  if (id) {
    await isNotFoundByID({ res, model, id, entity })
    await isAlreadyExistById({ req, res, model, id, entity, bodyData })
  }
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
  isAlreadyExistById,
  findIntersectionObjects,
  handlePutRequest,
};
