const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Match,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  where: (teamTable, args, context) => `${teamTable}.id = ${args.id}`,
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * from matches WHERE id = ?';
    const result = await knex.raw(q, [args.id]);
    const match = result.rows[0];
    return match;
  },
};
