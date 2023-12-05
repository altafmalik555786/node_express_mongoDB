const constants = {
    DEFAULT_PARAM_PAGE: 1,
    DEFAULT_PARAM_PAGE_SIZE: 10,
    DEFAULT_PARAM_LIMIT: 0,
    ROUTE_PARAM_SLASH_ID: '/:id',
    ERROR_SERVER_ERROR: 'SERVER_ERROR',
    ERROR_INVALID_ID: 'INVALID_ID',
    ERROR_RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
    MSG_DELETED: (entityName = "Record") => {
        return `${entityName} has been deleted successfully.`
    },
    MSG_UPDATED: (entityName = "Record") => {
        return `${entityName} has been updated successfully.`
    },
    MSG_CREATED: (entityName = "Record") => {
        return `${entityName} has been created successfully.`
    },
    MSG_NOT_FOUND: (entityName = "Record") => {
        return `${entityName} not found.`
    },
    MSG_VERIFIED: (entityName = "Record") => {
        return `${entityName} has been verified successfully.`
    },
    MSG_INVALID_EXPIRY: (entityName = "Record") => {
        return `Invalid or expired ${entityName}!`
    },
    MSG_FORBIDDEN: (action = "") => {
        return `Access Forbidden: Unauthorized! You do not have permission to perform this ${action} action`
    },
    CON_IDENTITY: "====================================================="
}


module.exports = {
    ...constants
};
