var Twit = require('twit')
var fs = require('fs')

var T = new Twit({
  consumer_key:         '65Mqgi4IcZATwIytk1uvtIUPW',
  consumer_secret:      'WjcmIF6Xzr3eAY8D4iSOSjtGLwTXqtPSYOOx1vs4tV1a4McEID',
  access_token:         '915913284779376640-D2iQgsZyamzLi5s0Ae8wmPyUJcZhoC8',
  access_token_secret:  'X5bwtrbnAFAg6mSCdGhJgRYaCiDSrIm0VDOMj7u9b67An',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

T.post('statuses/update', { status: 'ananas' }, function(err, data, response) {
  console.log(data)
})
