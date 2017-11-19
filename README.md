# Twitometer
![](https://github.com/bastiencro/Twitometer/blob/master/assets/IMG_8911.JPG)

The twitometer is a race based on twitter and a specific hashtag. As they tweet for the first time with an hashtag, the players will join a team and compete for both a team victory and a personnal one. Indeed, when a player reach a certain amount of individual tweets he will receive a notification with a gif telling him that he completed a lap. But at the same time, a tweet from a team member will move a car on a miniature racing circuit. At the end of the race, the person and the team with the most points (tweets) will win !

#### The race is on !

## Node libraries requirements (software requirements in a nutshell)
### twit
https://github.com/ttezel/twit

this one will allow you to connect to the twitter A.P.I. (more on that down the line)

install with :

    npm install twit
    
 ### jonhy-five
 https://github.com/rwaldron/johnny-five
 
 This library is used in order to connect to the arduino in nodejs
 
 install with :

    npm install johnny-five

### fs
https://nodejs.org/api/fs.html

And this one is used to send media trough twitter (by getting them on a directory)
## Hardware required
•miniature electric cars (i used this one, and it worked just fine : https://www.amazon.fr/deAO-Top-Turbo-Piste-Course/dp/B072XT75MM/ref=sr_1_1?ie=UTF8&qid=1511114405&sr=8-1&keywords=deao+top+turbo)

•arduino uno

•2 NPN Transistors 2222A

•L.E.Ds (for testing purposes)

•electric resistances (I used those that were in the remotes)

• jumper cables

## How to connect node to arduino ?
![](https://github.com/bastiencro/Twitometer/blob/master/assets/IMG_8912.JPG)

Onto the tricky part ! If you want to connect your program to, let's say a miniature racing circuit, you will have to 'hack' your way into the electronic components. 

![](https://github.com/bastiencro/Twitometer/blob/master/assets/IMG_8896.JPG)

But don't worry ! It's easier than it look. Obviously it will depend on the racing circuit, but if you use the same as me (not sponsored) it shall be fine.

First off, you will have to dismantle the remotes and extract the resistances. Then you'll have to weld them together.

Time to get your NPN transistor ! As a general rule of thumbs, always check the documentation online for your electronics. Here's the one for the transistor I used : https://www.onsemi.com/pub/Collateral/PN2222-D.PDF. Next up, you will have to identify (using the doc) the leads number (1,2,3).

Weld the resistances to the collector (3), the input from the arduino to the base (2) and the grounded socket to the emitter (1). When in doubt check the picture below.

![](https://github.com/bastiencro/Twitometer/blob/master/assets/IMG_8915.JPG)

Now all you have to do, is connect for the first one the arduino input to the pin 13 and to the ground. Redo all those steps for the second remote and connect to the pin 12 and the ground.

![](https://github.com/bastiencro/Twitometer/blob/master/assets/IMG_8897.JPG)

## How to set up a twitter bot ?
It's easy.

First off, you'll need to create a new twitter account for your app. (NB : don't use your's because you could get it blocked, which would be a bummer).

Then you need to register your app through the 'Twitter Application Manager'
    
    get it here : https://apps.twitter.com/
 
 All you have to do from now on is to follow the instructions on your screen. Pretty self forward.
 
 Then in your nodejs file you'll have to set up a new variable in order to call the 'twit' library

```javascript
var Twit = require('twit')
```

 Now it's time to use those strings of letters/numbers you just acquired during the app registration, like so :
 
```javascript
var T = new Twit({
    consumer_key:         '65Mqgi4IcZATwIytk1uvtIUPW',
    consumer_secret:      'WjcmIF6Xzr3eAY8D4iSOSjtGLwTXqtPSYOOx1vs4tV1a4McEID',
    access_token:         '915913284779376640-D2iQgsZyamzLi5s0Ae8wmPyUJcZhoC8',
    access_token_secret:  'X5bwtrbnAFAg6mSCdGhJgRYaCiDSrIm0VDOMj7u9b67An',
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})
```

All you have to do now, is : replace the keys !

You are now able to send tweets with your app ! Let's start with a classic 'Hello world'

Be careful though as you aren't limited by the number of characters HERE. If you go over 140 (now 280 ?!) your message won't be sent.

 ```javascript
T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
    console.log(data)
})
```

Sending tweets with a video/image/gif attached to it is also possible, a bit trickier but possible.
        
 ```javascript
var b64content = fs.readFileSync('/path/to/img', { encoding: 'base64' })

// first we NEED to post the media on Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, this is for the screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string
    var altText = "Small flowers in a planter on a sunny balcony, blossoming."
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

    T.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
        // lets put a custom message right here ! (NB : you can also tag someone if you want to)
        var params = { status: 'wow this is the best pic ever !', media_ids: [mediaIdStr] }

            T.post('statuses/update', params, function (err, data, response) {
                console.log(data)
            })
        }
    })
})
```

Now, what if you want to detect the use of an specific hashtag ? Easy use the stream function !

```javascript
var stream = T.stream('statuses/filter', { track: '#test_ixda18_1' }) // your hashtag here
stream.on('tweet', function (tweet) {
    //console.log(tweet) //usefull to track the different parts of the tweets you are getting
    process_tweet(tweet) //this line calls the fonction used to process the tweets in my code
})
```

## Changelog
### •V1.6.1 :
-Connected the code to a miniature circuit : it went well
#### •V1.5.1 :
-Added score dependent replies : when reaching %5 == 0 the player will receive a tweet
#### •V 1.4.2 : 
-Changed files names
#### •V 1.4.1 :
-Added folders : the organisation is now in better shape !
#### •V 1.3.1 :
-Added dialogue with arduino : two L.E.D.s can be activated whenever a person from the corresponding team tweets with the right hashtag (based on the team scoreboard + stream tweet)

-Will later be changed : from L.E.D. to Servo motors
#### •V 1.2.1 :
-Added dialogue with the twitter A.P.I. : get specfic hashtags, send tweets, send videos, send messages to specific users

-Added tweet stream : get tweet with a specific hashtag in real time

-Added scoreboard : store number of tweets with a specific hashtag as score

-Added teams : when using a specific hashtag for the first time, make the person join a team

-Added team scoreboard : store number of tweets w/ a specific hashtag from all the players in a team

![](https://github.com/bastiencro/Twitometer/blob/master/gif/fin.gif)
