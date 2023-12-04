const { MESSAGE_CREATED, MESSAGE_DELETED, MESSAGE_UPDATED, MESSAGE_NOT_FOUND } = require("../const");

const userRoles = {
    "superMaster": "4",
    "master": "3",
    "superAdmin": "2",
    "admin": "0",
    "user": "1"

}

const statusCodes = {
    standardSuccess: {
        status: 200,
        msgIncludes: ["successfully.", "has been updated successfully.",]
    },
    standardFailed: {
        status: 400,
        msgIncludes: ["failed", "not found", "Record not found", "user not found", MESSAGE_NOT_FOUND(""), MESSAGE_NOT_FOUND()]
    },
    200: {
        status: 200,
        msgIncludes: [MESSAGE_UPDATED(), MESSAGE_UPDATED(""), "has been updated successfully.", "has been created successfully.", MESSAGE_CREATED(), MESSAGE_CREATED(""), "Unauthorized", "unAuthorized", "don't have access", "do not have access", "Access Forbidden: Unauthorized! You do not have permission to perform this", "Invalid or expired"]
    }
    ,
    201: {
        status: 201,
        msgIncludes: [MESSAGE_CREATED(""), MESSAGE_CREATED(), "has been created successfully."]
    },
    204: {
        status: 204,
        msgIncludes: [MESSAGE_DELETED(), MESSAGE_DELETED(""), "has been deleted successfully."]
    }, // deleted and don't sending the respoonse payload.
    401: {
        status: 401,
        msgIncludes: ["authenticaiton failed", "authenticaiton failed!", "Token not found"]
    }, // for authenticaiton
    403: {
        status: 403,
        msgIncludes: ["Unauthorized", "unAuthorized", "don't have access", "do not have access", "Access Forbidden: Unauthorized! You do not have permission to perform this", "Invalid or expired"]
    }, // for authorization
    404: {
        status: 404,
        msgIncludes: ["not found", "Record not found", "user not found", MESSAGE_NOT_FOUND(""), MESSAGE_NOT_FOUND()]
    }

}

module.exports = {
    userRoles,
    statusCodes
};
