const constants = {
    DEFAULT_PARAM_PAGE: 1,
    DEFAULT_PARAM_PAGE_SIZE: 10,
    DEFAULT_PARAM_LIMIT: 0,
    ROUTE_PARAM_SLASH_ID: '/:id',
    ERROR_SERVER_ERROR: 'SERVER_ERROR',
    ERROR_INVALID_ID: 'INVALID_ID',
    ERROR_RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
    MESSAGE_DELETED: (entityName = "Record") => {
        return `${entityName} has been deleted successfully.`
    },
    MESSAGE_UPDATED: (entityName = "Record") => {
        return `${entityName} has been updated successfully.`
    },
    MESSAGE_CREATED: (entityName = "Record") => {
        return `${entityName} has been created successfully.`
    },
    MESSAGE_NOT_FOUND: (entityName = "Record") => {
        return `${entityName} not found.`
    },
    MESSAGE_VERIFIED: (entityName = "Record") => {
        return `${entityName} has been verified successfully.`
    },
    MESSAGE_INVALID_EXPIRY: (entityName = "Record") => {
        return `Invalid or expired ${entityName}!`
    },
    UNAUTHORIZED_DONT_HAVE_PERMISSION: (action = "") => {
        return `Access Forbidden: Unauthorized! You do not have permission to perform this ${action} action`
    },
    CON_IDENTITY: "====================================================="
}




module.exports = {
    ...constants
};
