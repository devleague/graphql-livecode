const express = require('express');
const DataLoader = require('dataloader');
const graphqlHTTP = require('express-graphql');

const dataLoaders = require('./database/graphql/loaders');
const schema = require('./database/graphql/schemas');

const app = express();

app.use('/api', (req, res) => {
  const loaders = {
    playerTeams: new DataLoader(dataLoaders.loadPlayerTeams),
    teamPlayers: new DataLoader(dataLoaders.loadTeamPlayers),
    matchWinnerTeams: new DataLoader(dataLoaders.loadMatchWinnerTeams),
    matchLoserTeams: new DataLoader(dataLoaders.loadMatchLoserTeams),
  };

  return graphqlHTTP({
    schema: schema,
    graphiql: true,
    context: { loaders },
  })(req, res);
});

app.listen(4000, () => {
  console.log('Server started on PORT: 4000');
});
