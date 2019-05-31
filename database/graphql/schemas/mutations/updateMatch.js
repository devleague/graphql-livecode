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
    winner_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
    loser_team_id: {
      type: graphql.GraphQLNonNull(graphql.GraphQLInt),
    },
  },
  resolve: async (parent, args, context, resolveInfo) => {
    try {
      let qString = 'UPDATE matches SET (winner_team_id, loser_team_id) = (?, ?)  WHERE id = ? RETURNING *';
      const match = (await knex.raw(qString, [args.winner_team_id, args.loser_team_id, args.id])).rows[0];

      console.log(match);

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
