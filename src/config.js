
// Primitives
const createKnexClient = require('./knex-client') 

const createRecordViewingsApp = require('./app/record-viewings') 
const createHomeApp = require('./app/home')

const createPostgresClient = require('./postgres-client')
const createMessageStore = require('./message-store')

const createHomePageAggregator = require('./aggregators/home-page')

function createConfig ({ env }) {

  const knexClient = createKnexClient({ 
    connectionString: env.databaseUrl
  })
  
  const postgresClient = createPostgresClient({
    connectionString: env.messageStoreConnectionString
  })

  const messageStore = createMessageStore({ 
    db: postgresClient 
  })

  const homeApp = createHomeApp({ 
    db: knexClient 
  })

  const recordViewingsApp = createRecordViewingsApp({ 
    messageStore 
  })

  const homePageAggregator = createHomePageAggregator({
    db: knexClient,
    messageStore
  })

  const aggregators = [
    homePageAggregator
  ]

  const components = [

  ]

  return {
    env,
    // ...
    db: knexClient,
    homeApp,
    messageStore,
    recordViewingsApp,
    homePageAggregator,
    aggregators,
    components
  }
}

module.exports = createConfig
