var connect = require('connect');
var logger = require('./logger.js')

connect()
  .use(logger(':url :method'))
  .use(hello)
  .listen(3000);

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}