const graphql = require('graphql');

const Player = new graphql.GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    first_name: { type: graphql.GraphQLString },
    last_name: { type: graphql.GraphQLString },
    team: {
      type: Team,
      sqlJoin: (playerTable, teamTable, args) => `${playerTable}.team_id = ${teamTable}.id`,
    },
  }),
});

Player._typeConfig = {
  sqlTable: 'players',
  uniqueKey: 'id',
};

var Team = new graphql.GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    players: {
      type: graphql.GraphQLList(Player),
      sqlJoin: (teamTable, playerTable, args) => `${teamTable}.id = ${playerTable}.team_id`,
    },
  }),
});

Team._typeConfig = {
  sqlTable: 'teams',
  uniqueKey: 'id',
};

const Match = new graphql.GraphQLObjectType({
  name: 'Match',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    loser: {
      type: Team,
      sqlJoin: (matchTable, teamTable, args) => `${matchTable}.loser_team_id = ${teamTable}.id`,
    },
    winner: {
      type: Team,
      sqlJoin: (matchTable, teamTable, args) => `${matchTable}.winner_team_id = ${teamTable}.id`,
    },
  }),
});

Match._typeConfig = {
  sqlTable: 'matches',
  uniqueKey: 'id',
};

module.exports = {
  Player,
  Team,
  Match,
};
