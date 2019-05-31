const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: models.Team,
  args: {
    id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
  },
  where: (matchTable, args, context) => {
    if (context.id) {
      return `${matchTable}.id = ${context.id}`;
    }
  },
  resolve: async (parent, args, context, resolveInfo) => {
    try {
      let qString = 'DELETE FROM teams WHERE id = ? RETURNING *';
      const team = (await knex.raw(qString, [args.id])).rows[0];
      return team;
    } catch (err) {
      throw new Error(err);
    }
  },
};
