const http2 = require('http2');
const fs = require('fs');
const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_METHOD
} = http2.constants;


const client = http2.connect('https://localhost:4000', {
  ca: fs.readFileSync('localhost-cert.pem')
});


client.on('error', (err) => console.error(err));

const req = client.request({ [HTTP2_HEADER_PATH]: '/api/v1/health-check', [HTTP2_HEADER_METHOD]: 'GET' });

req.on('response', (headers, flags) => {
  for (const name in headers) {
    console.log(`${name}: ${headers[name]}`);
  }
});

req.setEncoding('utf8');
let data = '';
req.on('data', (chunk) => { data += chunk; });
req.on('end', () => {
  console.log(`\n${data}`);
  client.close();
});
req.end();