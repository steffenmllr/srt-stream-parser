var tape = require('tape');
var srt = require('./..');
var fs = require('fs');

var file = fs.createReadStream('./test/test.srt');
file.pipe(srt()).on('data', function (data) { console.log(data); });
