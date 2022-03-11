'use strict';
const express = require('express');
const path = require('path');
const helmet = require("helmet");
const http2Express = require('http2-express-bridge')
const app = http2Express(express)

const cors = require('cors');
const uuid = require('uuid')
require('dotenv').config({ path: path.join(__dirname, '.env') });

try {


  app.use(helmet());
  app.use(cors())
  app.options('*', cors());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization,x-access-token,Accept,Origin');
    res.setHeader('Cache-Control', 'no-cache="Set-Cookie, Set-Cookie2"');
    next();
  });


  app.use(async (req, res, next) => {
    req.debug = {
      ip: req.ip,
      debugId: uuid.v4(),
      userId: null
    }
    return next();
  });




  app.set('rateLimit', 100);

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/api/v1/health-check', async (req, res, next) => {
    res.status(200);
    return res.json({
      message: "Okay"
    });
  });


  app.use((err, req, res, next) => {
    res.status(500);
    return res.json({
      message: process.env.NODE_ENV === 'production' ? 'Someting went wrong.' : err.message
    });
  });

  app.use('/api/*', (req, res, next) => {
    return res.json({ message: 'Api route not found' })
  })

} catch (error) {
  console.log('error', error);
  process.exit(0);
}


module.exports = app;
