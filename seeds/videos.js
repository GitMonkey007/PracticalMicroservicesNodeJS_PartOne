/***
 * Excerpted from "Practical Microservices",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/egmicro for more book information.
***/
//const uuid = require('uuid/v4')
const { v4: uuid } = require('uuid')

const seedVideos = [
  {
    owner_id: uuid(),
    name: `video ${uuid()}`,
    description: 'Best video ever',
    transcoding_status: 'transcoded',
    view_count: 0
  },
  {
    owner_id: uuid(),
    name: `video ${uuid()}`,
    description: 'Even more best video',
    transcoding_status: 'transcoded',
    view_count: 1
  },
  {
    owner_id: uuid(),
    name: `video ${uuid()}`,
    description: 'Even still more best video',
    transcoding_status: 'transcoded',
    view_count: 2
  }
]

exports.seed = knex =>
  knex('videos')
    .del()
    .then(() => knex('videos').insert(seedVideos))
