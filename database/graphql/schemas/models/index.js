const graphql = require('graphql');

const Player = new graphql.GraphQLObjectType({
  name: 'player',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    first_name: { type: graphql.GraphQLString },
    last_name: { type: graphql.GraphQLString },
    team: {
      type: Team,
      resolve: async (player, args, { loaders }) => {
        return loaders.playerTeams.load(player.id);
      },
    },
  }),
});

const Team = new graphql.GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    players: {
      type: graphql.GraphQLList(Player),
      resolve: async (team, args, { loaders }) => {
        return loaders.teamPlayers.load(team.id);
      },
    },
  }),
});

const Match = new graphql.GraphQLObjectType({
  name: 'Match',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    loser: {
      type: Team,
      resolve: async (match, args, { loaders }) => {
        return loaders.matchLoserTeams.load(match.id);
      },
    },
    winner: {
      type: Team,
      resolve: async (match, args, { loaders }) => {
        return loaders.matchWinnerTeams.load(match.id);
      },
    },
  }),
});

module.exports = {
  Player,
  Team,
  Match,
};
