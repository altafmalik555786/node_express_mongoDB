const { MESSAGE_CREATED, MESSAGE_DELETED, MESSAGE_UPDATED } = require("../const");

const userRoles = {
    "superMaster": "4",
    "master": "3",
    "superAdmin": "2",
    "admin": "0",
    "user": "1"

}

const statusCodes = {
    200: {
        status: 200,
        msgIncludes: [MESSAGE_UPDATED(), MESSAGE_UPDATED(""), "has been updated successfully."]
    }
    ,
    201: {
        stats: 201,
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
        msgIncludes: ["not found", "Record not found", "user not found"]
    }

}

module.exports = {
    userRoles,
    statusCodes
};
