const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const config = require('../config');
const logger = require('../utils/logger');


const typeDefs = [`
  type Query {
    hello(username: String!): String   
  }
  
  schema {
    query: Query,
  }
`];

const resolvers = {
  Query: {
    hello(root, {username}, context) {
      return "Hello " + username;
    }
  }
};

const schema = makeExecutableSchema({typeDefs, resolvers});
module.exports = schema;
