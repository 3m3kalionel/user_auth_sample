const dotenv = require('dotenv');
require('babel-register');
require('./app');

dotenv.config({ path: '.env' });
