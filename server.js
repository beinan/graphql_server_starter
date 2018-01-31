const config = require('./config')
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const root_schema = require('./schema/root')
const logger = require('./utils/logger')
const app = express()

const port = 8888

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: root_schema }));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

app.listen(port, () => logger.info('Now browse to http://localhost:' + port + '/graphiql'));
