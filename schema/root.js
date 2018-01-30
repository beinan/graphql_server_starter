const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const config = require('../config');
const logger = require('../utils/logger');

const product_data = require('../data/product_data')

const typeDefs = [`
  interface Product {
    id: ID!,
    name: String!,
    price: Float,
    inStock: Int,
    isFreeShipping: Boolean,
    images: [String]
  }

  type Wine implements Product {
    id: ID!,
    name: String!,
    price: Float,
    inStock: Int,
    isFreeShipping: Boolean,
    images: [String],
    year: Int!
  } 

  type Book implements Product {
    id: ID!,
    name: String!,
    price: Float,
    inStock: Int,
    isFreeShipping: Boolean,
    images: [String],
    isbn: String!
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
  },
  Product: {
    __resolveType(obj, context, info){
      if(obj.year){
        return 'Wine';
      }

      if(obj.isbn){
        return 'Book';
      }

      return null;
    }
  }
};

const schema = makeExecutableSchema({typeDefs, resolvers});
module.exports = schema;
