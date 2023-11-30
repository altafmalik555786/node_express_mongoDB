const express = require("express");
const { Router } = require("express");
const EventEmitter = require('events');

const app = express();
const router = Router();
const emitter = new EventEmitter();

module.exports = {
    app,
    router,
    emitter
}