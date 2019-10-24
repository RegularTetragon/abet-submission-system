
exports.up = function(knex) {
    table.string('passwordhash')
        .notNullable()
    table.string('authtoken')
        .unique()
        .nullable()
};

exports.down = function(knex) {
  
};
