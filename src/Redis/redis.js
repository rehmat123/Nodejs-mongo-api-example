const redis = require('redis');
const { promisify } = require("util");
 class Redis {

     constructor(host, port) {
        this.client = redis.createClient({
            legacyMode: true,
            expire: 60
        });
         this.connect().then(()=> {
             console.log('Redis connected');
         })
    }

     async connect(){
        return await this.client.connect();
    }

    set(key, val, timeout = 10) {
         if (typeof val === 'object') {
             val = JSON.stringify(val)
         }
        if (typeof key === 'object') {
            key = JSON.stringify(key)
        }
        key = key.replace(/^"(.*)"$/, '$1');
        console.log(key,val)
        this.client.set(key, val)
        this.client.expire(key, timeout)
     }

    async get(key) {
        const getAsync = promisify(this.client.get).bind(this.client)
        return getAsync(key)
    }

    del(key) {
        this.client.del(key, function(err, reply) {
            console.log(reply); // 1
        });
    }

    exists(key) {
        this.client.exists(key, function(err, reply) {
            if (reply === 1) {
                console.log('has key in redis')
                let data = this.get(key);
                return data;
            } else {
                console.log('not has key in redis')
                return false;
            }
        });
    }
}

module.exports = Redis;