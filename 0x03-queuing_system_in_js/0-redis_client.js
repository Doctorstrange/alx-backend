import redis from 'redis';

const serve = redis.createClient();

serve.on('connect', () => {
  console.log('Redis client connected to the server');
});

serve.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err}`);
});