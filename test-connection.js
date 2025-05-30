
const { Client } = require('pg');
require('dotenv').config();

console.log('Testing connection with:');
console.log('Host:', process.env.DB_HOST);
console.log('Port:', process.env.DB_PORT);
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD ? '***masked***' : 'undefined');

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.query('SELECT NOW()');
  })
  .then(result => {
    console.log('✅ Query result:', result.rows[0]);
    client.end();
  })
  .catch(err => {
    console.error('❌ Connection error:', err.message);
    client.end();
  });
// "@ | Out-File -FilePath "test-connection.js" -Encoding UTF8