
exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', function(table) {
    table.increments().primary();
    table.string('first_name');
    table.string('last_name');
    table.integer('team_id').references('id').inTable('teams').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
