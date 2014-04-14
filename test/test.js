var tape = require('tape');
var srt = require('./..');
var fs = require('fs');
var _ = require('lodash');

var file = fs.createReadStream('./test/test.srt');

tape('srt reading', function (t) {
    var subutitles = [];
    var single = false;

    t.plan(6);
    file.pipe(srt()).on('data', function(data) {
        var data = JSON.parse(data);
        if(!single) {
            t.ok(data.start, 'start time');
            t.ok(data.end, 'end time');
            t.ok(data.id, 'id');
            t.ok(data.dialogs, 'dialogs');
            single = true;
        }
        subutitles.push(data);
    }).on('end', function () {
        t.deepEqual(_.find(subutitles, {id: '1263'}), { dialogs: [ 'But what?' ], id: '1263', start: 113051, end: 113052 }, 'subtitle id');
        t.equal(subutitles.length, 1340, 'get all subtitles');
    });
});



