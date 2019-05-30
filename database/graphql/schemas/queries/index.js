const graphql = require('graphql');
const models = require('../models');
const hello = require('./hello');
const players = require('./players');
const player = require('./player');
const teams = require('./teams');
const team = require('./team');
const matches = require('./matches');
const match = require('./match');

const QueryRoot = new graphql.GraphQLObjectType({
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

module.exports = QueryRoot;
