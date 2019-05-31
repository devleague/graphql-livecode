const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: models.Player,
  args: {
    id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    first_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    last_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    team_id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
  },
  where: (playerTable, args, context) => {
    if (args.team_id) {
      return `team.id = ${args.team_id} AND ${playerTable}.id = ${context.id}`;
    }
  },
  resolve: async (parent, args, context, resolveInfo) => {
    try {
      // update user
      let qString = 'UPDATE players SET (first_name, last_name, team_id) = (?, ?, ?) WHERE id = ? RETURNING *';
      const player = (await knex.raw(qString, [args.first_name, args.last_name, args.team_id, args.id])).rows[0];

      // return fully loaded data based on schema
      // where bounded in the where key context
      return joinMonster.default(resolveInfo, player, (sql) => {
        return knex.raw(sql);
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
