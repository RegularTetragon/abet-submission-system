
exports.up = function(knex)
{
    return knex.schema
        .createTable('whitelist', function(table)
            {
                table.increments('id')
    				.primary()
                table.string('email', 50).unique();
            })
            .alterTable('users', function(table)
            {
                table.integer('permission_level').notNull().defaultTo(1);
                // restrict from 0-3
            })
};

exports.down = function(knex)
{
    return knex.schema.dropTableIfExists('whitelist')
};

