const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

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
