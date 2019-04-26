const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');
const joinMonster = require('join-monster');
const knex = require('./database/knex');

// Data Models
const Player = new graphql.GraphQLObjectType({
  name: 'Player',
  fields: () => ({
    id: { type: graphql.GraphQLString },
    first_name: { type: graphql.GraphQLString },
    last_name: { type: graphql.GraphQLString },
    team: {
      type: Team,
      sqlJoin: (playerTable, teamTable, args) => `${playerTable}.team_id = ${teamTable}.id`
    }
  })
});

Player._typeConfig = {
  sqlTable: 'players',
  uniqueKey: 'id',
}

var Team = new graphql.GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    players: {
      type: graphql.GraphQLList(Player),
      sqlJoin: (teamTable, playerTable, args) => `${teamTable}.id = ${playerTable}.team_id`
   }
  })
})

Team._typeConfig = {
  sqlTable: 'teams',
  uniqueKey: 'id'
}

const Match = new graphql.GraphQLObjectType({
  name: 'Match',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    loser: {
      type: Team,
      sqlJoin: (matchTable, teamTable, args) => `${matchTable}.loser_team_id = ${teamTable}.id`
    },
    winner: {
      type: Team,
      sqlJoin: (matchTable, teamTable, args) => `${matchTable}.winner_team_id = ${teamTable}.id`
    }
  })
})

Match._typeConfig = {
  sqlTable: 'matches',
  uniqueKey: 'id'
}


const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => { return 'Hello world!'; }
    },
    players: {
      type: new graphql.GraphQLList(Player),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return knex.raw(sql);
        })
      }
    },
    player: {
      type: Player,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (playerTable, args, context) => `${playerTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          console.log('sql', sql);
          return knex.raw(sql)
        });
      }
    },
    teams: {
      type: new graphql.GraphQLList(Team),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return knex.raw(sql)
        })
      }
    },
    team: {
      type: Team,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (teamTable, args, context) => `${teamTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return knex.raw(sql)
        })
      }
    },
    matches: {
      type: new graphql.GraphQLList(Match),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return knex.raw(sql)
        })
      }
    },
    match: {
      type: Match,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (teamTable, args, context) => `${teamTable}.id = ${args.id}`,
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          console.log('Match Query: ', sql);
          return knex.raw(sql)
        })
      }
    }
  })
});

const MutationRoot = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPlayer: {
      type: Player,
      args: {
        first_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        last_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        team_id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
      },
      where: (playerTable, args, context) => {
        if (args.team_id) { return `team.id = ${args.team_id} AND ${playerTable}.id = ${context.id}`; }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          // insert new user
          let qString = 'INSERT INTO players (first_name, last_name, team_id) VALUES (?, ?, ?) RETURNING *';
          const player = (await knex.raw(qString, [args.first_name, args.last_name, args.team_id])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, player, sql => {
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    updatePlayer: {
      type: Player,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
        first_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        last_name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
        team_id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
      },
      where: (playerTable, args, context) => {
        if (args.team_id) { return `team.id = ${args.team_id} AND ${playerTable}.id = ${context.id}`; }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          // update user
          let qString = 'UPDATE players SET (first_name, last_name, team_id) = (?, ?, ?) WHERE id = ? RETURNING *';
          const player = (await knex.raw(qString, [args.first_name, args.last_name, args.team_id, args.id])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, player, sql => {
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    deletePlayer: {
      type: Player,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      where: (matchTable, args, context) => {
        if (context.id) { return `${matchTable}.id = ${context.id}`; }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          // delete user
          let qString = 'DELETE FROM players WHERE id = ? RETURNING *';
          const player = (await knex.raw(qString, [args.id])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, player, sql => {
            console.log(sql);
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    createTeam: {
      type: Team,
      args: {
        name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          let qString = 'INSERT INTO teams (name) VALUES (?) RETURNING *';
          const team = (await knex.raw(qString, [args.name])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, team, sql => {
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    updateTeam: {
      type: Team,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
        name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          let qString = 'UPDATE teams SET name = ? WHERE id = ? RETURNING *';
          const team = (await knex.raw(qString, [args.name, args.id])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, team, sql => {
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    deleteTeam: {
      type: Team,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
      },
      where: (matchTable, args, context) => {
        if (context.id) { return `${matchTable}.id = ${context.id}`; }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          let qString = 'DELETE FROM teams WHERE id = ? RETURNING *';
          const team = (await knex.raw(qString, [args.id])).rows[0];
          return team;
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    createMatch: {
      type: Match,
      args: {
        winner_team_id: {
          type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        },
        loser_team_id: {
          type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          let qString = 'INSERT INTO matches (winner_team_id, loser_team_id) VALUES (?, ?) RETURNING *';
          const match = (await knex.raw(qString, [args.winner_team_id, args.loser_team_id])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, match, sql => {
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    updateMatch: {
      type: Match,
      args: {
        id: {
          type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        },
        winner_team_id: {
          type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        },
        loser_team_id: {
          type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          let qString = 'UPDATE matches SET (winner_team_id, loser_team_id) = (?, ?)  WHERE id = ? RETURNING *';
          const match = (await knex.raw(qString, [args.winner_team_id, args.loser_team_id, args.id])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, match, sql => {
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    },
    deleteMatch: {
      type: Match,
      args: {
        id: {
          type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
      },
      where: (matchTable, args, context) => {
        if (context.id) { return `${matchTable}.id = ${context.id}`; }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          let qString = 'DELETE FROM matches WHERE id = ? RETURNING *';
          const match = (await knex.raw(qString, [args.id])).rows[0];

          // return fully loaded data based on schema
          // where bounded in the where key context
          return joinMonster.default(resolveInfo, match, sql => {
            return knex.raw(sql)
          });
        }
        catch (err) {
          throw new Error(err);
        }
      }
    }
  })
})

const schema = new graphql.GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot
});

const app = express();
app.use('/api', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));
app.listen(4000);
