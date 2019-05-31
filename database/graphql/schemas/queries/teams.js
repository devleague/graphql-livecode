const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: new graphql.GraphQLList(models.Team),
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * FROM teams';
    const result = await knex.raw(q);
    const teams = result.rows;
    return teams;
  },
};
