/***
 * Excerpted from "Practical Microservices",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/egmicro for more book information.
***/
const test = require('blue-tape')

const { config, reset } = require('../../test-helper')

test('The loadHomePage query sums video views', t => {
  const videos = [
    { name: 'one', description: 'one', view_count: 1 },
    { name: 'two', description: 'one', view_count: 1 },
    { name: 'three', description: 'one', view_count: 1 }
  ]

  return reset()
    .then(() => config.db.then(client => client('videos').insert(videos)))
    .then(() =>
      config.homeApp.queries.loadHomePage().then(res => {
        t.equals(res.videosWatched, '3', 'Summed the views')
      })
    )
})
