const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Match,
  args: {
    id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
    winner_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
    loser_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'UPDATE matches SET (winner_team_id, loser_team_id) = (?, ?)  WHERE id = ? RETURNING *';
    const params = [args.winner_team_id, args.loser_team_id, args.id];
    const result = await knex.raw(q, params);
    const match = result.rows[0];
    return match;
  },
};
