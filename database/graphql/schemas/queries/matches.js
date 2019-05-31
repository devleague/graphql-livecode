const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: new graphql.GraphQLList(models.Match),
  resolve: (parent, args, context, resolveInfo) => {
    return joinMonster.default(resolveInfo, {}, (sql) => {
      return knex.raw(sql);
    });
  },
};
