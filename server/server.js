const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the Apollo server
const startApolloServer = async () => {
  await server.start();

  // Enable CORS for requests from the client
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }));

  // Parse request bodies as JSON
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Attach the Apollo GraphQL middleware
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware,
  }));

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Connect to MongoDB and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`GraphQL playground available at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();