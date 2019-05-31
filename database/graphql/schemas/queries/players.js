const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: new graphql.GraphQLList(models.Player),
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * from players';
    const result = await knex.raw(q);
    const players = result.rows;
    return players;
  },
};
