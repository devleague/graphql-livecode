const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Player,
  args: {
    id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    first_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    last_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    team_id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
  },
  resolve: async (parent, args) => {
    const q = 'UPDATE players SET (first_name, last_name, team_id) = (?, ?, ?) WHERE id = ? RETURNING *';
    const params = [args.first_name, args.last_name, args.team_id, args.id];
    const result = await knex.raw(q, params);
    const player = result.rows[0];
    return player;
  },
};
