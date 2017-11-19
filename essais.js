var Twit = require('twit')
var fs = require('fs')

var T = new Twit({
  consumer_key:         '65Mqgi4IcZATwIytk1uvtIUPW',
  consumer_secret:      'WjcmIF6Xzr3eAY8D4iSOSjtGLwTXqtPSYOOx1vs4tV1a4McEID',
  access_token:         '915913284779376640-D2iQgsZyamzLi5s0Ae8wmPyUJcZhoC8',
  access_token_secret:  'X5bwtrbnAFAg6mSCdGhJgRYaCiDSrIm0VDOMj7u9b67An',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})
/*
T.post('statuses/update', { status: 'ananas' }, function(err, data, response) {
  console.log(data)
})
*/
var b64content = fs.readFileSync('D:\\Documents\\GitHub\\Twitometer\\gif\\lap_red.gif', { encoding: 'base64' })

// first we must post the media to Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
  // now we can assign alt text to the media, for use by screen readers and
  // other text-based presentations and interpreters
  var mediaIdStr = data.media_id_string
  var altText = "You completed an entire lap, congrats !"
  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

  T.post('media/metadata/create', meta_params, function (err, data, response) {
    if (!err) {
      // now we can reference the media and post a tweet (media will attach to the tweet)
      var params = { status: '@'+tweet.user.screen_name+' You completed a lap !', media_ids: [mediaIdStr] }

      T.post('statuses/update', params, function (err, data, response) {
        console.log(data)
      })
    }
  })
})

//status: '@'+tweet.user.screen_name+' Merci !',
//in_reply_to_status_id : tweet.id,
//in_reply_to_user_id : tweet.user.id,
//}, function(err, data, response) {

        //console.log(data)
                //console.log(err)
                        //console.log(response)
//})
//}

/*var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var led = new five.Led(11);

  led.fadeIn();

  // Toggle the led after 5 seconds (shown in ms)
  this.wait(500, function() {
    led.fadeOut();
  });
});*/
