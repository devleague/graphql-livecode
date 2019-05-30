const graphql = require('graphql');
const knex = require('../../../knex');
const models = require('../models');

module.exports = {
  type: models.Player,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * from players WHERE id = ?';
    const player = (await knex.raw(q, [args.id])).rows[0];
    return player;
  },
};
