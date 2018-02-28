console.log('whooooo');
const path = require('path')
const {app, BrowserWindow} = require('electron')

// var sqlite3 = require('sqlite3');
const db_path = path.join(app.getPath("userData"), "info.sqlite");

const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', null, null, {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: db_path
});

const Employee = sequelize.define('employee', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        get() {
            const title = this.getDataValue('title');
            // 'this' allows you to access attributes of the instance
            return this.getDataValue('name') + ' (' + title + ')';
        },
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('title', val.toUpperCase());
        }
    }
});
// force: true not supported for sqlite?
sequelize.sync()

return sequelize.transaction(function (t) {

    // chain all your queries here. make sure you return them.
    return Employee
        .create({ name: 'John Doe', title: 'senior engineer' }
            , {transaction: t});

}).then(function (result) {
    // Transaction has been committed
    // result is whatever the result of the promise chain returned to the transaction callback
    console.log("it worked")
}).catch(function (err) {
    // Transaction has been rolled back
    // err is whatever rejected the promise chain returned to the transaction callback
    console.log(err)
});

//sequelize.sync()
//
// Employee
//     .create({ name: 'John Doe', title: 'senior engineer' })
//     .then(employee => {
//         console.log(employee.get('name')); // John Doe (SENIOR ENGINEER)
//         console.log(employee.get('title')); // SENIOR ENGINEER
//     })