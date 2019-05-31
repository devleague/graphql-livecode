const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: new graphql.GraphQLList(models.Match),
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * from matches';
    const result = await knex.raw(q);
    const matches = result.rows;
    return matches;
  },
};
