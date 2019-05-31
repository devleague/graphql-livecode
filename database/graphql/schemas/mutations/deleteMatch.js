const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: models.Match,
  args: {
    id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
  },
  where: (matchTable, args, context) => {
    if (context.id) {
      return `${matchTable}.id = ${context.id}`;
    }
  },
  resolve: async (parent, args, context, resolveInfo) => {
    try {
      let qString = 'DELETE FROM matches WHERE id = ? RETURNING *';
      const match = (await knex.raw(qString, [args.id])).rows[0];

      // return fully loaded data based on schema
      // where bounded in the where key context
      return joinMonster.default(resolveInfo, match, (sql) => {
        return knex.raw(sql);
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
