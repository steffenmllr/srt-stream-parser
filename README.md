# srt-stream-parser [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Let's you stream decode srt files - gives you back a json string with the id, start, end and the dialogs. The start and end time are in milliseconds.

### Installation

```shell
npm install srt-stream-parser --save-dev
```

## Usage

```js
var srt = require('srt-stream-parser');
var srt_file = fs.createReadStream('./path/to/your/file.srt');

var subutitles = [];
file.pipe(srt()).on('data', function(data) {
    var data = JSON.parse(data);
    subutitles.push(data);
}).on('end', function () {
    console.log('All done, parsed: ' + subutitles.length + ' subtitles');
});

```

Where in the single data entry concists of:

```json
 {
     "id": "1337",
     "start": 56880000,
     "end": 57060000,
     "dialogs": ["A world without rules and controls,", "without borders or boundaries."]
 }
```


[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/srt-stream-parser
[npm-image]: https://badge.fury.io/js/srt-stream-parser.png

[travis-url]: http://travis-ci.org/steffenmllr/srt-stream-parser
[travis-image]: https://secure.travis-ci.org/steffenmllr/srt-stream-parser.png?branch=master

[depstat-url]: https://david-dm.org/steffenmllr/srt-stream-parser
[depstat-image]: https://david-dm.org/steffenmllr/srt-stream-parser.png