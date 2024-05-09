import redis from 'redis';
import { promisify } from 'util';

const serve = redis.createClient();

serve.on('connect', () => {
  console.log('Redis client connected to the server');
});

serve.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err}`);
});

function setNewSchool(schoolName, value) {
  serve.set(schoolName, value, redis.print);
}

async function displaySchoolValue(schoolName) {
  const getAsync = promisify(serve.get).bind(serve);
  const value = await getAsync(schoolName);
  console.log(value);
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');