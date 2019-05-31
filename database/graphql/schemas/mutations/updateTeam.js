const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: models.Team,
  args: {
    id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
    name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    try {
      let qString = 'UPDATE teams SET name = ? WHERE id = ? RETURNING *';
      const team = (await knex.raw(qString, [args.name, args.id])).rows[0];

      // return fully loaded data based on schema
      // where bounded in the where key context
      return joinMonster.default(resolveInfo, team, (sql) => {
        return knex.raw(sql);
      });
    } catch (err) {
      throw new Error(err);
    }
  },
};
