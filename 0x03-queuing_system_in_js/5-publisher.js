import redis from 'redis';

const serve = redis.createClient();

serve.on('connect', function() {
  console.log('Redis client connected to the server');
});

serve.on('error', function(err) {
  console.log('Redis client not connected to the server: ' + err);
});

serve.subscribe('holberton school channel');

serve.on('message', function(channel, message) {
  console.log('Message received on channel ' + channel + ': ' + message);
  if (message === 'KILL_SERVER') {
    serve.unsubscribe();
    serve.quit();
  }
});