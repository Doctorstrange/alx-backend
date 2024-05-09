import redis from 'redis';

const serve = redis.createClient();

serve.hset("HolbertonSchools", "Portland", 50, redis.print);
serve.hset("HolbertonSchools", "Seattle", 80, redis.print);
serve.hset("HolbertonSchools", "New York", 20, redis.print);
serve.hset("HolbertonSchools", "Bogota", 20, redis.print);
serve.hset("HolbertonSchools", "Cali", 40, redis.print);
serve.hset("HolbertonSchools", "Paris", 2, redis.print);

serve.hgetall("HolbertonSchools", function(err, reply) {
  console.log(reply);
});