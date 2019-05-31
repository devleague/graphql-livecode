const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Match,
  args: {
    id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'DELETE FROM matches WHERE id = ? RETURNING *';
    const params = [args.id];
    const result = await knex.raw(q, params);
    const match = result.rows[0];
    return match;
  },
};
