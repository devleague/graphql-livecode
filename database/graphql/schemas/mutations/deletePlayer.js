const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Player,
  args: {
    id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    const q = 'DELETE FROM players WHERE id = ? RETURNING *';
    const params = [args.id];
    const result = await knex.raw(q, params);
    const player = result.rows[0];
    return player;
  },
};
