function category(streamName) {
    if (streamName == null) {
        return ''
    }

    return streamName.split('-')[0]
}

module.exports = category