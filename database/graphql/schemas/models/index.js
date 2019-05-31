const graphql = require('graphql');
const knex = require('../../../knex');

const Player = new graphql.GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    first_name: { type: graphql.GraphQLString },
    last_name: { type: graphql.GraphQLString },
    team: {
      type: Team,
      resolve: async (player) => {
        const q = 'SELECT * from teams WHERE id = ?';
        const result = await knex.raw(q, [player.team_id]);
        const team = result.rows[0];
        return team;
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
      resolve: async (team) => {
        const q = 'SELECT * from players WHERE team_id = ?';
        const result = await knex.raw(q, [team.id]);
        const players = result.rows;
        return players;
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
      resolve: async (match) => {
        const q = 'SELECT * from teams WHERE id = ?';
        const result = await knex.raw(q, [match.loser_team_id]);
        const team = result.rows[0];
        return team;
      },
    },
    winner: {
      type: Team,
      resolve: async (match) => {
        const q = 'SELECT * from teams WHERE id = ?';
        const result = await knex.raw(q, [match.winner_team_id]);
        const team = result.rows[0];
        return team;
      },
    },
  }),
});

module.exports = {
  Player,
  Team,
  Match,
};
