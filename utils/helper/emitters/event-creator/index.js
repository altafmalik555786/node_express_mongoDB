const { emitter } = require("../../../instances");

const sendFailureResponse = (data) => {
 emitter.emit('sendFailureResponse', data)
}

module.exports = {
    sendFailureResponse,
};