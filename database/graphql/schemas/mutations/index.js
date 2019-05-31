const graphql = require('graphql');
const models = require('../models');
const knex = require('../../../knex');

const createPlayer = require('./createPlayer');
const updatePlayer = require('./updatePlayer');
const deletePlayer = require('./deletePlayer');
const createTeam = require('./createTeam');
const updateTeam = require('./updateTeam');
const deleteTeam = require('./deleteTeam');
const createMatch = require('./createMatch');
const updateMatch = require('./updateMatch');
const deleteMatch = require('./deleteMatch');

module.exports = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPlayer,
    updatePlayer,
    deletePlayer,
    createTeam,
    updateTeam,
    deleteTeam,
    createMatch,
    updateMatch,
    deleteMatch,
  }),
});
