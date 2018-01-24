const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const config = require('../config');
const logger = require('../utils/logger');

const product_data = require('../data/product_data')

const typeDefs = [`
  type Product {
    id: ID!,
    name: String!,
    description: String,
    images: [String]
  }
  type Query {
    getAllProducts: [Product]   
  }
  
  schema {
    query: Query
  }
`];

const resolvers = {
  Query: {
    getAllProducts(root, ignore, context) {
      return product_data;
    }
  }
};

const schema = makeExecutableSchema({typeDefs, resolvers});
module.exports = schema;
