const config = require('./config')
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const root_schema = require('./schema/root')
const logger = require('./utils/logger')
const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: root_schema }));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => logger.info('Now browse to localhost:4000/graphiql'));
