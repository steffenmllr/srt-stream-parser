var tape = require('tape');
var srt = require('./..');
var fs = require('fs');

var file = fs.createReadStream('./test/test.srt');

tape('srt reading', function (t) {
    var subutitles = [];
    var single = false;

    t.plan(5);
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
        console.log(subutitles);
        t.equal(subutitles.length, 1340, 'get all subtitles');
    });
});



