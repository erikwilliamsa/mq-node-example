var amqp = require('amqplib/callback_api');
var amqurl = 'amqp://' + process.env.AMQ_HOST;
amqp.connect(amqurl, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var exchange = 'provision';
    var key = 'foo';

    ch.assertExchange(exchange, 'topic');
    ch.assertQueue('', {
      exclusive: true
    }, function(err, q) {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
      ch.bindQueue(q.queue, exchange, key);
      ch.consume(q.queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
      }, {
        noAck: true
      });
    })
  });
});
