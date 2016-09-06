var fs = require('fs');

function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
    callback(null, lines[+line_no]);
}

get_line('./random.txt', rand(0, 8), (err, line) => {
  console.log('The line: ' + line);
});

function rand(min, max) {
  return (Math.floor(Math.random() * (max - min)) + min);
}