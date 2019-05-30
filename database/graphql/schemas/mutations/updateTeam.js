const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Team,
  args: {
    id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'UPDATE teams SET name = ? WHERE id = ? RETURNING *';
    const params = [args.name, args.id];
    const result = await knex.raw(q, params);
    const team = result.rows[0];
    return team;
  },
};
