import  Koa from 'koa';
import validate from 'koa-validate';
import views from 'koa-views';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import cors from 'koa-cors';
import session from 'koa-session';
import fs from 'fs';
import path from 'path';
import http from 'http';
import _debug from 'debug';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import camelcase from './middlewares/koa-camelcase'

import router from './routes';

const app = new Koa();
validate(app);
var debug = _debug('demo:server');

mongoose.Promise = bluebird;
mongoose.connect('mongodb://97.64.36.18:27017/moapi',{useMongoClient: true});

// error handler
onerror(app);

// middlewares
app.keys = ['moapi'];
app.use(cors());
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));

app.use(json());
app.use(camelcase());
app.use(logger());
app.use(session(app));
app.use(require('koa-static')(path.join(__dirname ,'/public')));
app.use(views(path.join(__dirname , '/views'), {extension: 'ejs'}));

// logger
app.use(async(ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
router(app)



/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3014');
// app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app.callback());

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
