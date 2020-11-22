exports.up = knex =>
    knex.schema.createTable('pages', table => {
        table.string('page_name').primary()
        table.jsonb('page_data').defaultsTo('{}')
    })

exports.down = knex => 
    knex.schema.dropTable('pages')