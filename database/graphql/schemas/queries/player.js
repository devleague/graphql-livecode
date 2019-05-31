const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Player,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  where: (playerTable, args, context) => `${playerTable}.id = ${args.id}`,
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'SELECT * from players WHERE id = ?';
    const player = (await knex.raw(q, [args.id])).rows[0];
    return player;
  },
};
