const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const UserModel = require('../../../model/user')
const fs = require('fs')
const cloudinary = require('cloudinary').v2;

const {
  MESSAGE_NOT_FOUND,
  ERROR_INVALID_ID,
  ERROR_RECORD_NOT_FOUND,
  ERROR_SERVER_ERROR,
  DEFAULT_PARAM_PAGE_SIZE,
  DEFAULT_PARAM_PAGE,
  DEFAULT_PARAM_LIMIT,
} = require("../../const");
const { secretKey } = require("../../const/config-const");
const { getToken} = require("../common");
const { emitter } = require("../../instances");

emitter.on('sendFailureResponse', (data) => {
  sendFailureResponse(data);
});

const successResponse = ({ data = undefined, message = null, pagination = undefined }) => {
  if (data === null) {
    throw new Error("error");
  }
  return {
    success: true,
    message,
    pagination,
    data,
  };
};

const failureResponse = ({ message = null }) => {
  return {
    success: false,
    message,
  };
};

const sendSuccessResponse = ({
  res = null,
  status = 200,
  data = undefined,
  message = null,
  pagination = undefined
}) => {
  if (res) {
    res.status(status).send(successResponse({ data, message, pagination }));
  } else {
    throw new Error(
      "Res is null, please send res key to sendSuccessResponse({res: ??})"
    );
  }
};

const sendFailureResponse = ({ res = null, status = 400, message = null }) => {
  if (res) {
    res.status(status).json(failureResponse({ message }));
  } else {
    throw new Error(
      "Res is null, please send res key to sendFailureResponse({res: ??})"
    );
  }
};

const isNotFoundByID = async ({ req, res, model, id = null, entity = "" }) => {
  const recordId = id || req.params.id;
  if (!mongoose.Types.ObjectId.isValid(recordId)) {
    sendFailureResponse({
      res,
      message: `Invalid ${entity} Object ID, Id dont have type pattern.`,
    });
    throw new Error(ERROR_INVALID_ID);
  } else {
    const existObj = await model.findById(recordId);
    if (!existObj) {
      sendFailureResponse({
        res,
        message: MESSAGE_NOT_FOUND(entity),
        status: 404,
      });
      throw new Error(ERROR_RECORD_NOT_FOUND);
    } else {
      return existObj
    }
  }
};

const recordNotFound = async ({
  res,
  model,
  findOne = {},
  entity = "Record",
  message = "",
  status = 404,
}) => {
  const record = await model.findOne(findOne);
  if (!record) {
    sendFailureResponse({
      res,
      status,
      message: message || MESSAGE_NOT_FOUND(entity),
    });
    throw new Error(ERROR_RECORD_NOT_FOUND);
  } else {
    return record;
  }
};

const findIntersectionObjects = (obj1, obj2) => {
  const result = {};
  const deepIntersection = (source, target, currentKey = "") => {
    for (const key in source) {
      const newKey = currentKey ? `${currentKey}.${key}` : key;
      if (target.hasOwnProperty(key)) {
        if (
          typeof source[key] === "object" &&
          typeof target[key] === "object"
        ) {
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

const isAlreadyExistById = async ({
  req,
  res,
  model,
  id,
  bodyData,
  entity = "Record",
}) => {
  const incomingData = bodyData || req.body;
  const findDataByID = await model.findById(id);
  const intersectedObj = findIntersectionObjects(
    incomingData,
    findDataByID.toObject()
  );
  if (Object.keys(intersectedObj)?.length > 0) {
    sendFailureResponse({ res, message: `${entity} data already exist.` });
    throw new Error(ERROR_SERVER_ERROR);
  }
};

const toCapitalCase = (string) => {
  return string?.charAt(0).toUpperCase() + string.slice(1);
};

const checkValidation = ({
  req,
  res,
  model,
  requiredFields = [],
  bodyData = null,
}) => {
  const allowedKeys = Object?.keys(model?.schema.tree);
  const incomingData = bodyData || req.body;

  if (Object.keys(req.body).length === 0) {
    sendFailureResponse({ res, message: "Null payload data" });
    throw new Error(ERROR_SERVER_ERROR);
  }

  if (requiredFields?.length > 0) {
    requiredFields.forEach((element) => {
      if (!Object.keys(incomingData).includes(element)) {
        sendFailureResponse({
          res,
          message: `${toCapitalCase(element)} is required`,
        });
        throw new Error(ERROR_SERVER_ERROR);
      } else {
        if (bodyData && incomingData[element] === undefined) {
          sendFailureResponse({
            res,
            message: `${toCapitalCase(element)} is required`,
          });
          throw new Error(ERROR_SERVER_ERROR);
        }
      }
    });
  }

  const invalidKeys = Object.keys(incomingData).filter(
    (key) => !allowedKeys.includes(key)
  );
  if (invalidKeys.length > 0) {
    sendFailureResponse({
      res,
      message: `${invalidKeys?.map((item) => ` ${item}`)} ${invalidKeys?.length > 1 ? "are" : "is"
        } invalid ${invalidKeys?.length > 1 ? "keys" : "key"}`,
    });
    throw new Error(ERROR_SERVER_ERROR);
  }

  const paramsArr = Object.entries(incomingData).map(([key, value]) => ({
    key,
    value,
  }));

  paramsArr?.forEach((item) => {
    if (!item?.value) {
      sendFailureResponse({
        res,
        message: `${toCapitalCase(item?.key)} cannot be not null or undefined`,
      });
      throw new Error(ERROR_SERVER_ERROR);
    }
  });
};

const handlePutRequest = async ({
  req,
  res,
  model,
  bodyData = null,
  requiredFields = [],
  entity = "Record",
}) => {
  const { id } = req.params;
  checkValidation({ req, res, model, bodyData, requiredFields });
  if (id) {
    await isNotFoundByID({ req, res, model, id, entity });
    await isAlreadyExistById({ req, res, model, id, entity, bodyData });
  }
};

const verifyToken = (req, res) => {
  return new Promise((resolve, reject) => {
    jwt.verify(getToken(req), secretKey, function (err, decoded) {
      if (err) {
        sendFailureResponse({ res, message: MESSAGE_INVALID_EXPIRY("Token") })
      } else {
        resolve(decoded);
      }
    });
  });
}

const getUserFromToken = async (req, res) => {
  const decoded = await verifyToken(req, res);
  return await isNotFoundByID({ req, res, model: UserModel, id: decoded.id, entity: 'User' })
}

const handleCloudinaryFiles = async (req) => {
  const picture = req.files.files.data;
  const tempFilePath = req.files?.files.name;
  fs.writeFileSync(tempFilePath, picture);
  const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
    resource_type: "auto",
  });
  fs.unlinkSync(tempFilePath);
  return uploadResult
}

const getPaginatedData = async ({ req, res = null, model, populate = [] }) => {
  const page = parseInt(req.query.page) || DEFAULT_PARAM_PAGE;
  const limitedTotal = parseInt(req.query.limit) || DEFAULT_PARAM_LIMIT;
  const pageSize = parseInt(req.query.pageSize) || DEFAULT_PARAM_PAGE_SIZE;
  try {
    let query = model.find();
    if (populate?.length > 0) {
      query = query.populate(...populate);
    }
    const total = await model.countDocuments();
    if (limitedTotal > 0) {
      total = Math.min(total, limitedTotal);
    }
    const totalPages = Math.ceil(total / pageSize);
    const data = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    const pagination = {
      page,
      pageSize,
      totalPages,
      total
    };
    if (res) {
      sendSuccessResponse({ res, data, pagination })
    }
    return { query, data, pagination };
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = {
  successResponse,
  failureResponse,
  sendSuccessResponse,
  sendFailureResponse,
  checkValidation,
  isNotFoundByID,
  isAlreadyExistById,
  handlePutRequest,
  recordNotFound,
  getUserFromToken,
  verifyToken,
  handleCloudinaryFiles,
  getPaginatedData,
};
