var express = require('express');
var amqp = require('amqplib/callback_api');
var app = express();

var amqurl='amqp://'+process.env.AMQ_HOST;

app.get('/send', function(req, res) {
  var msg=req.query.message;
  amqp.connect(amqurl, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var exchange = 'amq.direct';
      var key = req.query.key;

      ch.assertExchange(exchange, 'direct');

      ch.publish(exchange, key, new Buffer(msg));
      console.log(' [x] Sent ' + msg + ' to exhange '+ exchange + ' & key ' + key);
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
