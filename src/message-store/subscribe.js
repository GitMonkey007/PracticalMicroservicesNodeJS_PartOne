const Bluebird = require('bluebird')
const { v4: uuid } = require('uuid')
const read = require('./read')

const category = require('./category')

function configureCreateSubscription({ read, readLastMessage, write }) {
    return ({
        streamName,
        handlers,
        messagesPerTick = 100,
        subscriberId,
        positionUpdateInterval = 100,
        tickIntervalMs = 100
    }) => {
        const subscriberStreamName = `subscriberPosition-${subscriberId}`

        let currentPosition = 0
        let messagesSinceLastPositionWrite = 0
        let keepGoing = true
        return {
            loadPosition,
            start,
            stop,
            tick,
            writePosition
        }

        function updateReadPosition(position) {
            currentPosition = position
            messagesSinceLastPositionWrite += 1

            if (messagesSinceLastPositionWrite === positionUpdateInterval) {
                messagesSinceLastPositionWrite = 0

                return writePosition(position)
            }

            return Bluebird.resolve(true)
        }

        function writePosition(position) {
            const positionEvent = {
                id: uuid(),
                type: 'Read',
                data: { position }
            }

            return write(subscriberStreamName, positionEvent)
        }

        function loadPosition() {

            return readLastMessage(subscriberStreamName)
                .then(message => {
                    currentPosition = message ? message.data.position : 0
                })
        }

        function handleMessage(message) {
            const handler = handlers[message.type] || handlers.any$

            return handler ? handler(message) : Promise.resolve(true)
        }

        function getNextBatchOfMessages() {
            return read(streamName, currentPosition + 1, messagesPerTick)
        }

        function processBatch(messages) {

            return Bluebird.each(messages, message =>
                handleMessage(message)
                    .then(() => updateReadPosition(message.globalPosition))
                    .catch(err => {
                        logError(message, err)

                        throw err
                    })
            )
                .then(() => messages.length)
        }

        function logError(lastMessage, error) {
            // eslint-disable-next-line no-console
            console.error(
                'error processing:\n',
                `\t${subscriberId}\n`,
                `\t${lastMessage.id}\n`,
                `\t${error}\n`
            )
        }

        function start() {
            console.log(`Started ${subscriberId}`)

            return poll()
        }

        function stop() {
            console.log(`Stopped ${subscriberId}`)

            keepGoing = false
        }

        async function poll() {
            await loadPosition()

            while (keepGoing) {
                const messagesProcessed = await tick()

                if (messagesProcessed === 0) {
                    await Bluebird.delay(tickIntervalMs)
                }
            }
        }

        function tick() {
            return getNextBatchOfMessages()
                .then(processBatch)
                .catch(err => {
                    console.error('Error processing batch', err)
                    stop()
                })
        }
    }
}

module.exports = configureCreateSubscription