// eslint-disable-next-line import/no-extraneous-dependencies
const Bluebird = require('bluebird')
const test = require('blue-tape')

const { app, config } = require('./')

test.onFinish(() => {
  config.db.then(client => client.destroy())
})

/* eslint-disable no-console */
process.on('unhandledRejection', err => {
  console.error('Uh-oh. Unhandled Rejection')
  console.error(err)

  process.exit(1)
})
/* eslint-enable no-console */

function reset () {
  const tablesToWipe = ['videos']

  return Bluebird.each(tablesToWipe, table =>
    config.db.then(client => client(table).del())
  )
}

module.exports = {
  app,
  config,
  reset
}
