var log = require('log-stream')({name: 'myApp'})
log.stream.pipe(process.stdout)

log('The sky is falling!')
log.fatal('This message should be %s.', 'fatal')

