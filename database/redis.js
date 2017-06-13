const IoRedis = require('ioredis');
const logger = require('../utils/logger')

class Redis{
  constructor({url}){
    this.redis = new IoRedis(url);
    logger.info('Connecting to redis:' + url)
  }

  get(key){
    logger.debug("redis getting:" + key)
    return this.redis.get(key);
  }
  
  set(key, value, ...options){
    logger.debug(`redis setting: key ${key} with value ${value}`)
    return this.redis.set(key, value, ...options)
	       .then((res) => {
		 if(res != 'OK')
		   throw new Error("Redis set failed:" + key + " options:" + options);
	       });  
  }
  
  expire(key, ttl){
    logger.debug(`redis setting or updating the ttl of a key ${key} with the new ttl ${ttl}`)
    return this.redis.expire(key, ttl);
  }  
}

module.exports = Redis;



