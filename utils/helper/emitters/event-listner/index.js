const { emitter } = require('../../../instances')
const { sendFailureResponse } = require('../../api')

const eventListnerFunction = () => {

    const iterateEmitterListner = [
        {
            event: "sendFailureResponse",
            eventFunc: sendFailureResponse
        }
    ]

    iterateEmitterListner.forEach((item) => {
        emitter.on(`sendFailureResponse`, (data) => {
            item?.eventFunc(data)
        })
    })

}

module.exports = eventListnerFunction


