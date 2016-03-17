var express = require('express');
var amqp = require('amqplib/callback_api');
var app = express();

var amqurl='amqp://'+process.env.AMQ_HOST;

app.get('/send', function(req, res) {
  var msg=req.query.message;
  amqp.connect(amqurl, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var exchange = 'provision';
      var topic = req.query.topic;

      ch.assertExchange(exchange, 'topic');

      ch.publish(exchange, topic, new Buffer(msg));
      console.log(' [x] Sent ' + msg + ' to exhange '+ exchange + ' & topic ' + topic);
    });
    setTimeout(function() {
      conn.close();
    }, 500);
  });

  res.send(' [x] Sent ' + msg);
});

app.listen(process.env.PORT, function() {
  console.log('Listening on port ' + process.env.PORT + '!');
});
