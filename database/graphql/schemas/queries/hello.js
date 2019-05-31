const graphql = require('graphql');

module.exports = {
  type: graphql.GraphQLString,
  resolve: () => {
    return 'Hello world!';
  },
};
