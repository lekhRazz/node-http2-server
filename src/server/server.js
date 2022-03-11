const http2 = require('http2');
const fs = require('fs');
const app = require('./app');

const port = 4000 || process.env.PORT;

const server = http2.createSecureServer({
  key: fs.readFileSync('localhost-privkey.pem'),
  cert: fs.readFileSync('localhost-cert.pem'),
  allowHTTP1: true
},
  app
);

server.on('error', (err) => console.error('error', err));


server.on('error', (err) => console.error(err));

server.listen(port, () => {
  console.log(`Server is running on port : ${port} at ${new Date()} with process id::  ${process.pid}`)
});

//@graceful server shutdown
server.on('SIGTERM', () => {
  console.log("server is closing");
  server.close(() => {
    process.exit(0);
  });
})

