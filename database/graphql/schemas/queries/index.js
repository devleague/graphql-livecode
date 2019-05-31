const graphql = require('graphql');

const hello = require('./hello');
const players = require('./players');
const player = require('./player');
const teams = require('./teams');
const team = require('./team');
const matches = require('./matches');
const match = require('./match');

module.exports = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello,
    players,
    player,
    teams,
    team,
    matches,
    match,
  }),
});
