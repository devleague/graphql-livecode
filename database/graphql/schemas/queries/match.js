const graphql = require('graphql');
const knex = require('../../../knex');
const models = require('../models');

module.exports = {
  type: models.Match,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * from matches WHERE id = ?';
    const result = await knex.raw(q, [args.id]);
    const match = result.rows[0];
    return match;
  },
};
