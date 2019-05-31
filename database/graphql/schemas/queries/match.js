const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: models.Match,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  where: (teamTable, args, context) => `${teamTable}.id = ${args.id}`,
  resolve: (parent, args, context, resolveInfo) => {
    return joinMonster.default(resolveInfo, {}, (sql) => {
      return knex.raw(sql);
    });
  },
};
