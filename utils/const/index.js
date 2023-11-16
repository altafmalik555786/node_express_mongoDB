const constants = {
    ERROR_INVALID_ID: 'INVALID_ID',
    ERROR_RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
    DELETED_MESSAGE: (entityName = "Record") => {
     return `${entityName} has been deleted successfully.`
    },
    UPDATED_MESSAGE: (entityName = "Record") => {
        return `${entityName} has been updated successfully.`
    },
    CREATED_MESSAGE: (entityName = "Record") => {
        return `${entityName} has been deleted successfully.`
    },
    NOT_FOUND_MESSAGE: (entityName) => {
        return `${entityName} not found.`
    }
} 


module.exports = {
    ...constants
};
