const Redis = require('ioredis');
require('dotenv').config();

console.log('Testing Redis connection with:');
console.log('Host:', process.env.REDIS_HOST || 'localhost');
console.log('Port:', process.env.REDIS_PORT || 6379);

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

redis.ping()
  .then(result => {
    console.log('Redis connection successful!');
    console.log('PING response:', result); 
    return redis.set('test_key', 'test_value');
  })
  .then(() => {
    console.log('Successfully set test key');
    return redis.get('test_key');
  })
  .then(value => {
    console.log('Successfully retrieved test key:', value);
    redis.quit();
  })
  .catch(err => {
    console.error('Redis connection error:', err.message);
    redis.quit();
  });