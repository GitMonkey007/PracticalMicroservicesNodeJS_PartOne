/***
 * Excerpted from "Practical Microservices",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/egmicro for more book information.
***/
exports.up = knex =>
  knex.schema.createTable('videos', table => {
    table.increments()
    table.string('owner_id')

    table.string('name')
    table.string('description')
    table.string('transcoding_status')
    table.integer('view_count').defaultsTo(0)
  })

exports.down = knex => knex.schema.dropTable('videos')
