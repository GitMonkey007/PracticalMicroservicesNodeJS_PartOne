const camelCaseKeys = require('camelcase-keys')
const express = require('express')

function createHandlers ({ queries }) {

  function home (req, res, next) {
    return queries
      .loadHomePage()
      .then(homePage =>
        res.render('home/templates/home', homePage.pageData)
      )
      .catch(next)
  }

  return {
    home
  }
}

function createQueries ({ db }) {
  function loadHomePage () {

    return db.then(client =>
      client('pages')
        .where({ page_name: 'home'})
        .limit(1)
        .then(camelCaseKeys)
        .then(rows => rows[0])
    )
    // return db.then(client =>
    //   client('videos')
    //     .sum('view_count as videosWatched')
    //     .then(rows => rows[0])
    // )
  }

  return {
    loadHomePage
  }
}

function createHome ({ db }) {
  const queries = createQueries({ db })
  const handlers = createHandlers({ queries })

  const router = express.Router()

  router.route('/').get(handlers.home)

  return { handlers, queries, router }
}

module.exports = createHome
