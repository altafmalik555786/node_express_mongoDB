const { MSG_CREATED, MSG_DELETED, MSG_UPDATED, MSG_NOT_FOUND } = require("../const");

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
        msgIncludes: ["failed", "not found", "Record not found", "user not found", MSG_NOT_FOUND(""), MSG_NOT_FOUND()]
    },
    200: {
        status: 200,
        msgIncludes: [MSG_UPDATED(), MSG_UPDATED(""), "has been updated successfully.", "has been created successfully.", MSG_CREATED(), MSG_CREATED("")]
    }
    ,
    201: {
        status: 201,
        msgIncludes: [MSG_CREATED(""), MSG_CREATED(), "has been created successfully."]
    },
    202: {
        status: 202,
        msgIncludes: [MSG_DELETED(), MSG_DELETED(""), "has been deleted successfully."]
    }, // deleted and returning sends the respoonse payload.
    204: {
        status: 204,
        msgIncludes: [MSG_DELETED(), MSG_DELETED(""), "has been deleted successfully."]
    }, // deleted and don't sending the respoonse payload.
    400: {
        status: 400,
        msgIncludes: ["failed"]
    },
    401: {
        status: 401,
        msgIncludes: ["authenticaiton failed", "authenticaiton failed!", "Token not found"]
    }, // for authenticaiton
    403: {
        status: 403,
        msgIncludes: ["Unauthorized", "unAuthorized", "don't have access", "do not have access", "Access Forbidden: Unauthorized! You do not have permission to perform this", "Invalid or expired", "You do not have permission"]
    }, // for authorization
    404: {
        status: 404,
        msgIncludes: ["not found", "Record not found", "user not found", MSG_NOT_FOUND(""), MSG_NOT_FOUND()]
    }

}

module.exports = {
    userRoles,
    statusCodes
};
