const express = require('express');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');
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
      resolve: async (player) => {
        const q = 'SELECT * from teams WHERE id = ?';
        const result = await knex.raw(q, [player.team_id]);
        const team = result.rows[0];
        return team;
      }
    }
  })
});

const Team = new graphql.GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    players: {
      type: graphql.GraphQLList(Player),
      resolve: async (team) => {
        const q = 'SELECT * from players WHERE team_id = ?';
        const result = await knex.raw(q, [team.id]);
        const players = result.rows;
        return players;
      }
   }
  })
})

const Match = new graphql.GraphQLObjectType({
  name: 'Match',
  fields: () => ({
    id: { type: graphql.GraphQLInt },
    loser: {
      type: Team,
      resolve: async (match) => {
        const q = 'SELECT * from teams WHERE id = ?';
        const result = await knex.raw(q, [match.loser_team_id]);
        const team = result.rows[0];
        return team;
      }
    },
    winner: {
      type: Team,
      resolve: async (match) => {
        const q = 'SELECT * from teams WHERE id = ?';
        const result = await knex.raw(q, [match.winner_team_id]);
        const team = result.rows[0];
        return team;
      }
    }
  })
})


const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => { return 'Hello world!'; }
    },
    players: {
      type: new graphql.GraphQLList(Player),
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'SELECT * from players';
        const result = await knex.raw(q);
        const players = result.rows;
        return players;
      }
    },
    player: {
      type: Player,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (playerTable, args, context) => `${playerTable}.id = ${args.id}`,
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'SELECT * from players WHERE id = ?';
        const player = (await knex.raw(q, [args.id])).rows[0];
        return player;
      }
    },
    teams: {
      type: new graphql.GraphQLList(Team),
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'SELECT * FROM teams';
        const result = await knex.raw(q);
        const teams = result.rows;
        return teams;
      }
    },
    team: {
      type: Team,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'SELECT * from teams WHERE id = ?';
        const result = await knex.raw(q, [args.id]);
        const team = result.rows[0];
        return team;
      }
    },
    matches: {
      type: new graphql.GraphQLList(Match),
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'SELECT * from matches';
        const result = await knex.raw(q);
        const matches = result.rows;
        return matches;
      }
    },
    match: {
      type: Match,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      where: (teamTable, args, context) => `${teamTable}.id = ${args.id}`,
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'SELECT * from matches WHERE id = ?';
        const result = await knex.raw(q, [args.id]);
        const match = result.rows[0];
        return match;
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
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'INSERT INTO players (first_name, last_name, team_id) VALUES (?, ?, ?) RETURNING *';
        const params = [args.first_name, args.last_name, args.team_id];
        const result = await knex.raw(q, params);
        const player = result.rows[0];
        return player;
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
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'UPDATE players SET (first_name, last_name, team_id) = (?, ?, ?) WHERE id = ? RETURNING *';
        const params = [args.first_name, args.last_name, args.team_id, args.id];
        const result = await knex.raw(q, params);
        const player = result.rows[0];
        return player;
      }
    },
    deletePlayer: {
      type: Player,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'DELETE FROM players WHERE id = ? RETURNING *';
        const params = [args.id];
        const result = await knex.raw(q, params);
        const player = result.rows[0];
        return player;
      }
    },
    createTeam: {
      type: Team,
      args: {
        name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'INSERT INTO teams (name) VALUES (?) RETURNING *';
        const params = [args.name];
        const result = await knex.raw(q, params);
        const team = result.rows[0];
        return team;
      }
    },
    updateTeam: {
      type: Team,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
        name: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'UPDATE teams SET name = ? WHERE id = ? RETURNING *';
        const params = [args.name, args.id];
        const result = await knex.raw(q, params);
        const team = result.rows[0];
        return team;
      }
    },
    deleteTeam: {
      type: Team,
      args: {
        id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'DELETE FROM teams WHERE id = ? RETURNING *';
        const params = [args.id];
        const result = await knex.raw(q, params);
        const team = result.rows[0];
        return team;
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
        const q = 'INSERT INTO matches (winner_team_id, loser_team_id) VALUES (?, ?) RETURNING *';
        const params = [args.winner_team_id, args.loser_team_id];
        const result = await knex.raw(q, params);
        const match = result.rows[0];
        return match;
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
        const q = 'UPDATE matches SET (winner_team_id, loser_team_id) = (?, ?)  WHERE id = ? RETURNING *';
        const params = [args.winner_team_id, args.loser_team_id, args.id];
        const result = await knex.raw(q, params);
        const match = result.rows[0];
        return match;
      }
    },
    deleteMatch: {
      type: Match,
      args: {
        id: {
          type: graphql.GraphQLNonNull(graphql.GraphQLInt)
        }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        const q = 'DELETE FROM matches WHERE id = ? RETURNING *';
        const params = [args.id];
        const result = await knex.raw(q, params);
        const match = result.rows[0];
        return match;
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
