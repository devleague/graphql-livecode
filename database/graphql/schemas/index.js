const graphql = require('graphql');
const QueryRoot = require('./queries');
const MutationRoot = require('./mutations');

module.exports = new graphql.GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot,
});
