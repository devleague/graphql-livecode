const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('./database/graphql/schemas');

const app = express();
app.use(
  '/api',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);
app.listen(4000, () => {
  console.log('Server started on PORT: 4000');
});
