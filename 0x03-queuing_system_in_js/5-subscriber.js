import redis from 'redis';
import { promisify } from 'util';

const serve = redis.createClient();

serve.on('connect', () => {
  console.log('Redis client connected to the server');
});

serve.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

serve.subscribe('holberton school channel');

serve.on('message', (channel, message) => {
  console.log(message);
  if (message === 'KILL_SERVER') {
    serve.unsubscribe();
    serve.quit();
  }
});

async function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    serve.publish('holberton school channel', message);
  }, time);
}

publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);