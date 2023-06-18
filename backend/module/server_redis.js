const express = require("express");
const redisclient = require("../config/redis");
const redis_time_expire = '10';
require("dotenv").config();



module.exports = {
    async set(redis_key,result){
        await  redisclient.sendCommand(['SET',redis_key ,JSON.stringify(result),'EX',redis_time_expire]).then((result,err) => {});
    },
};