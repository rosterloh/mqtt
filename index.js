/**
 * Module dependencies.
 */

var program = require('commander'),
    colors  = require('colors'),
    mqtt    = require('mqtt'),
    pkg     = require('./package.json');

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-s, --server [url]', 'URL of the server. Can be of types mqtt://, mqtts://, tcp://, tls://, ws:// or wss://', 'mqtt://test.mosquitto.org')
  .option('-p, --port [port]', 'Port to connect to', 1883)
  .parse(process.argv);

var client = mqtt.connect(program.server);

client.subscribe('presence');
client.publish('presence', 'Hello mqtt');

client.on('connect', function () {
  console.log('Connected to '.green, program.server);
});

client.on('close', function () {
  console.log('Client connection closed'.yellow);
});

client.on('offline', function () {
  console.log('Client offline'.yellow);
});

client.on('error', function (error) {
  console.log('There was an error: '.bold.red, error);
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
});

process.on('SIGINT', function () {
  console.log('got ctrl+c, exiting...'.blue);
  client.unsubscribe('presence').end();
  process.exit();
});
