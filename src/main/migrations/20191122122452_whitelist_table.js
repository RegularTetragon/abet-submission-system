
exports.up = function(knex, Promise)
{
    return Promise.all([
    knex.schema.createTable('whitelist', function(table)
    {
        table.increments('id')
				.primary()
        table.string('email', 50).unique();
    }),
    ]);
};

exports.down = function(knex, Promise)
{
    return Promise.all([
    knex.schema.dropTable('whitelist'),
    ]);
};