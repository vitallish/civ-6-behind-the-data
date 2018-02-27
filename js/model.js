console.log('whooooo');
const path = require('path')
const {app, BrowserWindow} = require('electron')

var sqlite3 = require('sqlite3').verbose();
var db_path = path.join(app.getPath("userData"), "info.db")
console.log(db_path)
var db = new sqlite3.Database(db_path);

db.serialize(function () {
    db.run("CREATE TABLE lorem (info TEXT)");   

    var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
    for (var i = 0; i < 10; i++) {
        stmt.run("Ipsum " + i);
    }
    stmt.finalize();

    db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
        console.log(row.id + ": " + row.info);
    });
});
db.close();