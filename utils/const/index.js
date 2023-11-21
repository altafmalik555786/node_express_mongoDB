const constants = {
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
        return `${entityName} has been deleted successfully.`
    },
    MESSAGE_NOT_FOUND: (entityName) => {
        return `${entityName} not found.`
    }
} 


module.exports = {
    ...constants
};
