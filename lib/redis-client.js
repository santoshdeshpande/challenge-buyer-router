var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

var client = redis.createClient();

const addToRedis = (criteriaKey, criteria, key) => {
  criteria[criteriaKey].forEach((val) => {
    var k = `${criteriaKey}:${val}`;
    client.sadd(k, key);
  });
}

const addBuyer = (buyer) => {
  var key = `buyer:${buyer.id}`;
  client.set(key, JSON.stringify(buyer));

  buyer.offers.forEach((offer, index) => {
    var key = `buyer:${buyer.id}${index}`;
    client.set(key, JSON.stringify(offer));
    addToRedis('device', offer.criteria, key);
    addToRedis('hour', offer.criteria, key);
    addToRedis('day', offer.criteria, key);
    addToRedis('state', offer.criteria, key);
  });
}

const getBuyer = (buyerId) => {
  var key = `buyer:${buyerId}`;
  return client.getAsync(key)
}

const route = (day, hour, state, device) => {
  var key = `device:${device} hour:${hour} day:${day} state:${state}`;
  return client.sinterAsync(key.split(' '))
    .then((res) => client.mgetAsync(res))
    .then((data) => {
      return new Promise((resolve, reject) => {
        data.map((d) => JSON.parse(d))
          .sort((a, b) => +b.value - +a.value);
      });
    })
    .catch((err)=> console.log(err));
}


module.exports = {
  addBuyer,
  getBuyer,
  route,
  client
}
