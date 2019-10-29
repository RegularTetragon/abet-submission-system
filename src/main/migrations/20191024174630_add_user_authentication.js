
exports.up = function(knex) {
    return knex.schema.alterTable('users', table => {
        table.string('passwordhash')
            .notNullable()
        table.string('authtoken')
            .unique()
            .nullable()
    });
};

exports.down = function(knex) {
  
};