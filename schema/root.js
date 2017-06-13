const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const config = require('../config');
const logger = require('../utils/logger');
const Redis = require ('../database/redis');
const AuthService = require('../services/auth');

const redis = new Redis(config.redis)
const auth = new AuthService({db:redis})


const typeDefs = [`
  type User {
    id: ID!
    name: String!
    timeline: [Post]
    my_posts: [Post]
    friends: [User]
  }

  type Post {
    id: ID!
    title: String
    content: String
    created_at: String
    author: User
    comments: [Comment]
    likes: [User]  
  }
  
  type AuthResult {
    refresh_token: ID
    access_token: ID
  }

  type Comment {
    content: String
    author: User
    created_at: String
  }

  type Query {
    me(token: String!): User   
  }
  
  input AuthInput {
    username:String
    password:String
  }

  type Mutation {
    signin(input: AuthInput): AuthResult
    signup(input: AuthInput): AuthResult
    refresh(token: String): String
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`];

//see: http://dev.apollodata.com/tools/graphql-tools/resolvers.html
const resolvers = {
  Query: {
    me(root, {token}, context) {
      return auth.authenticate(token);
    }
  },
  Mutation:{
    signin(root, {input}, context) {
      logger.info(`${input.username} is signing in.`);
      return auth.signin(input.username, input.password);
    },
    signup(root, {input}, context) {
      logger.info("A new user is signing up:" + input.username);
      return auth.signup(input.username, input.password);
    },
    refresh(root, {token}, context) {
      logger.debug("refresh token");
      return auth.refresh(token);
    }
    
  }
};

const schema = makeExecutableSchema({typeDefs, resolvers});
module.exports = schema;
