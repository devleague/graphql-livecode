const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');
const joinMonster = require('join-monster');

module.exports = {
  type: models.Match,
  args: {
    winner_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
    loser_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    try {
      let qString = 'INSERT INTO matches (winner_team_id, loser_team_id) VALUES (?, ?) RETURNING *';
      const match = (await knex.raw(qString, [args.winner_team_id, args.loser_team_id])).rows[0];

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
