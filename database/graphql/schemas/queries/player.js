const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: models.Player,
  args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
  where: (playerTable, args, context) => `${playerTable}.id = ${args.id}`,
  resolve: (parent, args, context, resolveInfo) => {
    return joinMonster.default(resolveInfo, {}, (sql) => {
      return knex.raw(sql);
    });
  },
};
