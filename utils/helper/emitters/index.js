const { sendFailureResponse } = require('../api')
const { emitter } = require('../common')

const iterateEmitterListner = [
    {
        event: "sendFailureResponse",
        eventFunc: sendFailureResponse
    }
]

iterateEmitterListner.forEach((item) => {
    emitter.on(item?.event, (data) => {
        item?.eventFunc(data)
    })
})




