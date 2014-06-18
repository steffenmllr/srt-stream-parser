// Most of this is shamlessly copied from:
// https://github.com/rvagg/csv2

var  Transform = require('stream').Transform,
    util = require('util'),
    moment = require('moment');

function SrtStream() {
    var self = this;
    if (!(this instanceof SrtStream)) {
        return new SrtStream();
    }
    this._rawbuf = '';
    this._reset();
    Transform.call(this, { objectMode: true});
}

util.inherits(SrtStream, Transform);

SrtStream.prototype.end = function () {
    this.push(JSON.stringify(this.element));
    this.emit('end');
};

SrtStream.prototype._reset = function () {
    this.state = 'PARSE_NUMBER';
    this.element = { dialogs: [] };
};

SrtStream.prototype._processSRT = function(last) {
    var lines = this._rawbuf.split(/\r?\n/), i;
    for (i = 0; i <= lines.length - 1; i++) {
        this._processLine(lines[i]);
    }
    if (!last) {
        this._rawbuf = lines[lines.length - 1] || '';
    } else if (lines.length && lines[lines.length - 1].length) {
        this._processLine(lines[lines.length - 1]);
    }
};

SrtStream.prototype._processLine = function(line) {
    var self = this;
    switch (this.state) {
        case 'PARSE_NUMBER':
            self.element.id = line;
            self.state = 'PARSE_TIME';
        break;

        case 'PARSE_TIME':
            var matches = line.match(/(\d+):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d+):(\d{2}):(\d{2}),(\d{3})/);
            if(matches) {
                self.element.start = moment.duration({ hours: matches[1], minutes: matches[2], seconds: matches[3], milliseconds: matches[4]}).asMilliseconds();
                self.element.end = moment.duration({ hours: matches[5], minutes: matches[6], seconds: matches[7], milliseconds: matches[8]}).asMilliseconds();
            }
            self.state = 'PARSE_TEXT';
        break;

        case 'PARSE_TEXT':
            if (line.match(/^\s*$/)) {
                self.push(JSON.stringify(self.element));
                self._reset();
            } else {
                self.element.dialogs.push(line);
            }
        break;
    }

};

SrtStream.prototype._transform = function(chunk, enc, callback) {
    this._rawbuf += chunk.toString('utf8');
    this._processSRT();
    callback();
};

SrtStream.prototype._flush = function(callback) {
    this._processSRT(true);
    callback();
};

module.exports = SrtStream;
