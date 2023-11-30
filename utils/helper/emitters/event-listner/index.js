const { CON_IDENTITY } = require('../../../const')
const { sendFailureResponse } = require('../../api')
const { emitCreator } = require('../../common')

const iterateEmitterListner = [
    {
        event: "sendFailureResponse",
        eventFunc: sendFailureResponse
    }
]

// iterateEmitterListner.forEach((item) => {
//     // if (emitter) {
//     emitter.on(`sendFailureResponse`, (data) => {
//         console.log(CON_IDENTITY, data)
//         item?.eventFunc(data)
//     })
//     // }
// })


emitCreator.on(`sendFailureResponse`, (data) => {
    console.log(CON_IDENTITY, data)
    sendFailureResponse(data)
})


