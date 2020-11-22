const express = require('express')
const { v4: uuid } = require('uuid')

function createActions ({
  messageStore
}) {
  function recordViewing (traceId, videoId, userId) {
    const viewedEvent = {
      id: uuid(),
      type: 'VideoViewed',
      metadata: {
        traceId,
        userId
      },
      data: {
        userId,
        videoId
      }
    }
    const streamName = `viewing-${videoId}`

    return messageStore.write(streamName, viewedEvent)
  }

  return {
    recordViewing
  }
}

function createHandlers ({ actions }) {
  function handleRecordViewing (req, res) {
    return actions
      .recordViewing(req.context.traceId, req.params.videoId)
      .then(() => res.redirect('/'))
  }

  return {
    handleRecordViewing
  }
}

function createRecordViewings ({ 
  messageStore
}) {
  const actions = createActions({
    messageStore
  })
  const handlers = createHandlers({ actions }) 

  const router = express.Router() 

  router.route('/:videoId').post(handlers.handleRecordViewing) 

  return { actions, handlers, router }
}

module.exports = createRecordViewings
