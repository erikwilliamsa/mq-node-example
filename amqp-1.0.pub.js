'use strict';
var AMQPClient = require('amqp10').Client,
Policy = require('amqp10').Policy,
Promise = require('bluebird');
var client = new AMQPClient(); // Uses PolicyBase default policy
var amqurl='amqp://'+process.env.AMQ_HOST;

function publish(message){
  console.log(amqurl);

  var AMQPClient = require('amqp10').Client,
  Promise = require('bluebird');
  var client = new AMQPClient(Policy.ActiveMQ); // Uses PolicyBase default policy
  console.log(amqurl);
  client.connect(amqurl)
  .then(function() {
    //queue prefex is default in ActiveMQ -- if using a topic you must have the topic prefeix
    // and the use the ActiveMQ policy.
    return Promise.all([
      client.createReceiver('topic://ta.ca.topic.test.amqp'),
      client.createSender('topic://ta.ca.topic.test.amqp')
    ]);
  })
  .spread(function(receiver, sender) {
    sender.send(message);
    receiver.on('errorReceived', function(err) {

      console.log(err);
      client.disconnect();
    });
    receiver.on('message', function(message) {
      console.log('Rx message: ', message.body);
      client.disconnect().then(function(){console.log('DISCONNECTED');});
    });

  })
  .error(function(err) {
    client.disconnect();
    console.log("error: ", err);
  });

  }


  publish('test');
