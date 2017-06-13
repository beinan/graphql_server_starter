module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET
  },
  redis: {
    url: process.env.REDIS_URL
  },
  log: {
    level: 'info',
    log_file: 'graphql_server.log'
  }
}
