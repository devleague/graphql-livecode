const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Match,
  args: {
    winner_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
    loser_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'INSERT INTO matches (winner_team_id, loser_team_id) VALUES (?, ?) RETURNING *';
    const params = [args.winner_team_id, args.loser_team_id];
    const result = await knex.raw(q, params);
    const match = result.rows[0];
    return match;
  },
};
