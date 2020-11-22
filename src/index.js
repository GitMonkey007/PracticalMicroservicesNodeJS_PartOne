const createExpressApp = require('./app/express') // (1)
const createConfig = require('./config')
const env = require('./env')

const config = createConfig({ env }) // (2)
const app = createExpressApp({ config, env })

function start () { // (3)
  config.aggregators.forEach(x => x.start())
  config.components.forEach(x => x.start())
  app.listen(env.port, signalAppStart)
}

function signalAppStart () {
  console.log(`${env.appName} started`)
  console.table([['Port', env.port], ['Environment', env.env]])
}

module.exports = {
  app,
  config,
  start
}
