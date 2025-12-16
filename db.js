const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Video-upload',
  password: 'Sravani1@',
  port: 5432,
});

module.exports = pool;
