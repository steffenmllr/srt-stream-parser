var tape = require('tape');
var srt = require('./..');
var fs = require('fs');
var _ = require('lodash');

var file = fs.createReadStream('./test/test.srt');
var file2 = fs.createReadStream('./test/test2.srt');
var file3 = fs.createReadStream('./test/test3.srt');

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
        t.deepEqual(_.find(subutitles, {id: '1263'}), { dialogs: [ 'But what?' ], id: '1263', start: 6831616, end: 6832658 }, 'subtitle id');
        t.equal(subutitles.length, 1340, 'get all subtitles');
    });
});

tape('srt reading 2 - currupt srt ending', function (t) {
    var subutitles = [];
    var single = false;

    t.plan(6);
    file2.pipe(srt()).on('data', function(data) {
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

        t.deepEqual(_.find(subutitles, {id: '1561'}), { dialogs: [ 'What was your wife\'s name', 'before her marriage?' ], id: '1561', start: 7338540, end: 7339891 }, 'subtitle id');
        t.equal(subutitles.length, 1654, 'get all subtitles');
    });
});

tape('srt reading 3 - empty lines at srt ending', function (t) {
    var subutitles = [];
    var single = false;

    t.plan(6);
    file3.pipe(srt()).on('data', function(data) {
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
        t.deepEqual(_.find(subutitles, {id: '1263'}), { dialogs: [ 'But what?' ], id: '1263', start: 6831616, end: 6832658 }, 'subtitle id');
        t.equal(subutitles.length, 1340, 'get all subtitles');
    });
});

