const userRoles = {
    "superMaster": "4",
    "master": "3",
    "superAdmin": "2",
    "admin": "0",
    "user": "1"


}

const statusCodes = {
    401: {
        status: 401,
        msgIncludes: ["authenticaiton failed", "authenticaiton failed!", "Token not found"]
    }, // for authenticaiton
    403: {
        status: 403,
        msgIncludes: ["Unauthorized", "unAuthorized", "don't have access", "do not have access"]
    }, // for authorization
    404: {
        statu: 404,
        msgIncludes: ["not found", "Record not found", "user not found"]
    }
       
}

module.exports = {
    userRoles,
    statusCodes
};
