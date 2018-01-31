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
  
  input OrderItem{
    productID: ID!,
    quantity: Int
  }

  input Order{
    items: [OrderItem]
    address: String
  }
  type Query {
    getAllProducts: [Product] 
    getProduct(id: ID!): Product  
  }
  
  type Mutation {
    makeOrder(productID: ID!, quantity: Int): Product
    makeOrderV2(order: Order): [Product]
  }
  schema {
    query: Query
    mutation: Mutation
  }
`];

const resolvers = {
  Query: {
    getAllProducts(root, ignore, context) {
      return product_data;
    },
    getProduct(root, {id}, context){
      return product_data.find(p => p.id == id);
    }
  },
  Mutation: {
    makeOrder(root, {productID, quantity}, context) {
      let product = product_data.find(p => p.id == productID);
      if(product)
	product.inStock -= quantity;
      return product;
    },
    makeOrderV2(root, {order}, context) {
      return order.items.map (item => {
        let product = product_data.find(p => p.id == item.productID);
	if(product)
	  product.inStock -= item.quantity;
	return product;
      });
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
