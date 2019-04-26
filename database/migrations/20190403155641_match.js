
exports.up = function(knex, Promise) {
  return knex.schema.createTable('matches', function(table) {
    table.increments().primary();
    table.timestamp('date').notNull().defaultTo(knex.fn.now());
    table.integer('winner_team_id').references('id').inTable('teams').notNull();
    table.integer('loser_team_id').references('id').inTable('teams').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('matches');
};
