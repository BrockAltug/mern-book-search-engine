const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/books_db';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;