import redis from 'redis';

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

function displaySchoolValue(schoolName) {
  serve.get(schoolName, (err, reply) => {
    console.log(reply);
  });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');