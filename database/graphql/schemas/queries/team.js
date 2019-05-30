const graphql = require('graphql');
const knex = require('../../../knex');
const models = require('../models');

module.exports = {
  type: models.Team,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * from teams WHERE id = ?';
    const result = await knex.raw(q, [args.id]);
    const team = result.rows[0];
    return team;
  },
};
