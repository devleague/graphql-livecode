const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Team,
  args: {
    name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'INSERT INTO teams (name) VALUES (?) RETURNING *';
    const params = [args.name];
    const result = await knex.raw(q, params);
    const team = result.rows[0];
    return team;
  },
};
