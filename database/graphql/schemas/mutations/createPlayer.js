const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

module.exports = {
  type: models.Player,
  args: {
    first_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    last_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    team_id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
  },
  resolve: async (parent, args) => {
    const q = 'INSERT INTO players (first_name, last_name, team_id) VALUES (?, ?, ?) RETURNING *';
    const params = [args.first_name, args.last_name, args.team_id];
    const result = await knex.raw(q, params);
    const player = result.rows[0];
    return player;
  },
};
