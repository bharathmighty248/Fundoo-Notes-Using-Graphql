const redis = require('redis');

const client = redis.createClient();

client.connect();

class Redis {
    redisNotebyId = (key) => {
        const cachevalue = client.get(key);
        return cachevalue;
    };

    setData = (key,redisData) => {
        client.set(key,redisData);
    };

    redisLabelbyName = (key) => {
        const cachevalue = client.get(key);
        return cachevalue;
    }
}
module.exports = new Redis();
