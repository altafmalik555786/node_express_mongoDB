const constants = {

    DELETED_MESSAGE: (entityName = "Item") => {
     return `${entityName} has been deleted successfully.`
    },
    UPDATED_MESSAGE: (entityName = "Item") => {
        return `${entityName} has been updated successfully.`
    },
    CREATED_MESSAGE: (entityName = "Item") => {
        return `${entityName} has been deleted successfully.`
    },
    NOT_FOUND_MESSAGE: (entityName) => {
        return `${entityName} not found.`
    }
} 



module.exports = {
    ...constants
};
