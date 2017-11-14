var Twit = require('twit')
var fs = require('fs')
var five = require("johnny-five");
var board = new five.Board();

var T = new Twit({
  consumer_key:         '65Mqgi4IcZATwIytk1uvtIUPW',
  consumer_secret:      'WjcmIF6Xzr3eAY8D4iSOSjtGLwTXqtPSYOOx1vs4tV1a4McEID',
  access_token:         '915913284779376640-D2iQgsZyamzLi5s0Ae8wmPyUJcZhoC8',
  access_token_secret:  'X5bwtrbnAFAg6mSCdGhJgRYaCiDSrIm0VDOMj7u9b67An',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var scoreboard = {};
var teamscoreboard = { //lancer team, declarer structure donnees
  1 : 0,
  2 : 0,
  3 : 0, //lap rhone
  4 : 0, //lap
};
var team1 = true;
var RHONE = 1; //var globale
var SAONE = 2;

var stream = T.stream('statuses/filter', { track: '#test_ixda18_1' })
stream.on('tweet', function (tweet) {
    //console.log(tweet)
    process_tweet(tweet)
})


  function process_tweet( tweet ) {
    //console.log(tweet)
    //console.log(tweet.id_str)
    var id = tweet.id;

    if (!(tweet.user.name in scoreboard)) {
      scoreboard[tweet.user.name] = {}
      scoreboard[tweet.user.name].score = 0;
      if (team1) scoreboard[tweet.user.name].team = RHONE; //car bouléen
      else scoreboard[tweet.user.name].team = SAONE; //replace by team name a l'affichage
      team1 = !team1;
    }

    var team  = scoreboard[tweet.user.name].team;
    teamscoreboard[team]+=1;
    scoreboard[tweet.user.name].score+=1;

    if (scoreboard[tweet.user.name].score % 5 == 0) {
    console.log("score 1");
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
  }

        //status: '@'+tweet.user.screen_name+' Merci !',
        //in_reply_to_status_id : tweet.id,
        //in_reply_to_user_id : tweet.user.id,
      //}, function(err, data, response) {

                //console.log(data)
                        //console.log(err)
                                //console.log(response)
      //})
    //}


    if (team === 1) {
      var led = new five.Led(13);
      led.on();
      setTimeout(function() {
        led.off();
      }, (1000));}
    else {
      var led = new five.Led(12);
      led.on();
      setTimeout(function() {
        led.off();
      }, (1000));}

    console.log(scoreboard);
  }
