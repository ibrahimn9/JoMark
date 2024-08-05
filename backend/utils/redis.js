const redis = require("redis");
const config = require("../utils/config");

const auth = async ()=>{
    const client = redis.createClient({url: 'redis://127.0.0.1:6379'});
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
    return client;
}

module.exports = auth;